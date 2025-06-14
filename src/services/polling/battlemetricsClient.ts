import axios, { AxiosInstance } from 'axios';
import { config } from './config';
import { logger } from './logger';

export interface BMPlayer {
  id: string;
  type: 'player';
  attributes: {
    id: string;
    name: string;
    private: boolean;
    positiveMatch: boolean;
    createdAt: string;
    updatedAt: string;
  };
  relationships: {
    server?: {
      data: {
        type: 'server';
        id: string;
      };
    };
    identifiers?: {
      data: Array<{
        type: string;
        id: string;
      }>;
    };
  };
  meta?: {
    metadata: Array<{
      key: string;
      value: any;
      private: boolean;
    }>;
  };
}

export interface BMSession {
  id: string;
  type: 'session';
  attributes: {
    firstTime: boolean;
    start: string;
    stop: string | null;
    name: string;
    metadata: any[];
    private: boolean;
  };
  relationships: {
    player: {
      data: {
        type: 'player';
        id: string;
      };
    };
    server: {
      data: {
        type: 'server';
        id: string;
      };
    };
  };
}

export interface BMServerResponse {
  data: any;
  included?: Array<BMPlayer | BMSession>;
}

export class BattleMetricsClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.battlemetrics.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.battlemetrics.apiToken}`,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('BM API Request', {
          url: config.url,
          method: config.method?.toUpperCase()
        });
        return config;
      },
      (error) => {
        logger.error('BM API Request Error', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('BM API Response', {
          status: response.status,
          url: response.config.url
        });
        return response;
      },
      (error) => {
        logger.error('BM API Response Error', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
  }

  async getServerInfo(serverId: string): Promise<BMServerResponse> {
    const response = await this.client.get(
      `/servers/${serverId}?include=player,session,serverEvent`
    );
    return response.data;
  }

  async getPlayerById(playerId: string): Promise<BMPlayer> {
    const response = await this.client.get(`/players/${playerId}`);
    return response.data.data;
  }

  async getPlayerSessions(playerId: string, serverId?: string): Promise<BMSession[]> {
    let url = `/players/${playerId}/sessions?page[size]=100`;
    if (serverId) {
      url += `&filter[servers]=${serverId}`;
    }
    
    const response = await this.client.get(url);
    return response.data.data;
  }

  async searchPlayerByName(name: string): Promise<BMPlayer[]> {
    const response = await this.client.get(
      `/players?filter[search]=${encodeURIComponent(name)}&page[size]=10`
    );
    return response.data.data;
  }

  async retryRequest<T>(
    operation: () => Promise<T>,
    maxRetries: number = config.polling.maxRetries
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        const delay = config.polling.retryDelayMs * Math.pow(2, attempt - 1);
        logger.warn(`Request failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`, {
          error: lastError.message
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}