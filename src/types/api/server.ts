export interface ServerDetails {
  tags: string[];
  official: boolean;
  rust_type: string;
  map: string;
  environment: string;
  rust_build: string;
  rust_ent_cnt_i: number;
  rust_fps: number;
  rust_fps_avg: number;
  rust_gc_cl: number;
  rust_gc_mb: number;
  rust_hash: string;
  rust_headerimage: string;
  rust_mem_pv: null | number;
  rust_mem_ws: null | number;
  pve: boolean;
  rust_uptime: number;
  rust_url: string;
  rust_world_seed: number;
  rust_world_size: number;
  rust_description: string;
  rust_modded: boolean;
  rust_queued_players: number;
  rust_gamemode: string;
  rust_born: string;
  rust_last_ent_drop: string;
  rust_last_wipe: string;
  rust_last_wipe_ent: number;
  rust_settings?: {
    upkeep: number;
    version: number;
    teamUILimit: number;
    groupLimit: number;
    timeZone: string;
    rates: {
      gather: number;
      craft: number;
      component: number;
      scrap: number;
    };
    blueprints: boolean;
    kits: boolean;
    decay: number;
    forceWipeType: string;
    wipes: any[];
  };
  rust_wipes?: Array<{
    type: string;
    timestamp: string;
  }>;
  rust_next_wipe?: string;
  rust_next_wipe_map?: string;
  serverSteamId?: string;
}

export interface ServerAttributes {
  id: string;
  name: string;
  address: string | null;
  ip: string;
  port: number;
  players: number;
  maxPlayers: number;
  rank: number;
  location: [number, number];
  status: 'online' | 'offline';
  details: ServerDetails;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  portQuery: number;
  country: string;
  queryStatus: string;
}

export interface ServerData {
  type: 'server';
  id: string;
  attributes: ServerAttributes;
  relationships: {
    game: {
      data: {
        type: 'game';
        id: string;
      };
    };
  };
}