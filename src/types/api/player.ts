export interface PlayerMetadata {
  key: string;
  value: boolean;
  private: boolean;
}

export interface PlayerAttributes {
  id: string;
  name: string;
  private: boolean;
  positiveMatch: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerData {
  type: 'player';
  id: string;
  attributes: PlayerAttributes;
  relationships: {
    server: {
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
    metadata: PlayerMetadata[];
  };
}