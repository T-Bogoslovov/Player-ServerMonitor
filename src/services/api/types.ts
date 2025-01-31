export interface ApiResponse<T> {
  data: T;
  included?: any[];
}

export interface ServerData {
  type: string;
  id: string;
  attributes: {
    name: string;
    players: number;
    maxPlayers: number;
    status: string;
  };
}