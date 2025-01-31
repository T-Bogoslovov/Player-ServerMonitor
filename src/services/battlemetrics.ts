import { apiClient } from './api/client';
import { endpoints } from './api/endpoints';
import { transformPlayer, transformServer, transformServerEvent } from './api/transformers';
import { logger } from '../utils/logger';
import type { ApiResponse } from '../types/api/response';
import type { ServerResponse } from '../types/battlemetrics';
import type { PlayerData } from '../types/api/player';
import type { SessionData } from '../types/api/session';
import type { ServerEventData } from '../types/api/server-event';

export const fetchServerInfo = async (): Promise<ServerResponse> => {
  try {
    const { data: responseData } = await apiClient.get<ApiResponse>(endpoints.serverInfo());

    if (!responseData?.data) {
      throw new Error('Invalid server response format');
    }

    const players = responseData.included
      ?.filter((item): item is PlayerData => item.type === 'player') || [];
    
    const sessions = responseData.included
      ?.filter((item): item is SessionData => item.type === 'session') || [];

    const events = responseData.included
      ?.filter((item): item is ServerEventData => item.type === 'serverEvent')
      .map(transformServerEvent) || [];

    const serverInfo = transformServer(responseData.data);
    const playerList = players.map(player => transformPlayer(player, sessions));

    return {
      server: serverInfo,
      players: playerList,
      events,
      meta: {
        totalPlayers: responseData.data.attributes.players,
        debug: {
          requestUrl: `${apiClient.defaults.baseURL}${endpoints.serverInfo()}`,
          rawResponse: responseData
        }
      }
    };
  } catch (error) {
    logger.error('API Error', error);
    throw error instanceof Error ? error : new Error('Failed to fetch server info');
  }
};