export interface SessionAttributes {
  firstTime: boolean;
  start: string;
  stop: string | null;
  name: string;
  metadata: any[];
  private: boolean;
}

export interface SessionData {
  type: 'session';
  id: string;
  attributes: SessionAttributes;
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
    identifiers: {
      data: Array<{
        type: string;
        id: string;
      }>;
    };
  };
}