import type { ServerEventData } from '../../../types/api/server-event';
import type { ServerEvent } from '../../../types/battlemetrics';

export const transformServerEvent = (event: ServerEventData): ServerEvent => ({
  id: event.id,
  type: event.attributes.eventType,
  timestamp: event.attributes.timestamp,
  name: event.attributes.name
});