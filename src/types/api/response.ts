import type { ServerData } from './server';
import type { PlayerData } from './player';
import type { SessionData } from './session';
import type { ServerEventData } from './server-event';

export type IncludedData = PlayerData | SessionData | ServerEventData;

export interface ApiResponse {
  data: ServerData;
  included?: IncludedData[];
}