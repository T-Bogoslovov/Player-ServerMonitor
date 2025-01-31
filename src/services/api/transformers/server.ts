import type { ServerData } from '../../../types/api/server';
import type { ServerInfo } from '../../../types/battlemetrics';

export const transformServer = (data: ServerData): ServerInfo => ({
  id: data.id,
  name: data.attributes.name,
  players: data.attributes.players,
  maxPlayers: data.attributes.maxPlayers,
  status: data.attributes.status,
  details: {
    map: data.attributes.details.map,
    gameMode: data.attributes.details.rust_gamemode,
    modded: data.attributes.details.rust_modded,
    description: data.attributes.details.rust_description,
    uptime: data.attributes.details.rust_uptime,
    worldSize: data.attributes.details.rust_world_size,
    nextWipe: data.attributes.details.rust_next_wipe,
    headerImage: data.attributes.details.rust_headerimage,
    rates: {
      gather: data.attributes.details.rust_settings?.rates.gather || 1,
      craft: data.attributes.details.rust_settings?.rates.craft || 1,
      component: data.attributes.details.rust_settings?.rates.component || 1,
      scrap: data.attributes.details.rust_settings?.rates.scrap || 1
    }
  },
  location: {
    country: data.attributes.country,
    regions: [data.attributes.country]
  }
});