export interface ServerEventAttributes {
  timestamp: string;
  eventType: 'addPlayer' | 'removePlayer' | 'query';
  querySuccess?: boolean;
  name?: string;
}

export interface ServerEventData {
  id: string;
  type: 'serverEvent';
  attributes: ServerEventAttributes;
  relationships: {
    server: {
      data: {
        type: 'server';
        id: string;
      };
    };
    player?: {
      data: {
        type: 'player';
        id: string;
      };
    };
    session?: {
      data: {
        type: 'session';
        id: string;
      };
    };
  };
}