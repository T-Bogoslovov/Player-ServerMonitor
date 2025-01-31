export interface PlayerIdentifier {
  type: string;
  identifier: string;
}

export interface PlayerSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: string;
}

export interface Player {
  id: string;
  battlemetricsId: string;
  name: string;
  status: 'online' | 'offline';
  private?: boolean;
  firstTime?: boolean;
  createdAt?: string;
  identifiers: PlayerIdentifier[];
  sessions: PlayerSession[];
}

export interface ServerInfo {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline';
  details: {
    map: string;
    gameMode: string;
    modded: boolean;
    description: string;
    uptime: number;
    worldSize: number;
    nextWipe: string;
    headerImage?: string;
    rates: {
      gather: number;
      craft: number;
      component: number;
      scrap: number;
    };
  };
  location: {
    country: string;
    regions: string[];
  };
}

export interface ServerEvent {
  id: string;
  type: 'addPlayer' | 'removePlayer' | 'query';
  timestamp: string;
  name?: string;
}

export interface ServerResponse {
  server: ServerInfo;
  players: Player[];
  events: ServerEvent[];
  meta: {
    totalPlayers: number;
    debug: {
      requestUrl: string;
      rawResponse: any;
    };
  };
}