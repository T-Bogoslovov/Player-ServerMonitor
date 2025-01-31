import type { PlayerData } from '../../../types/api/player';
import type { SessionData } from '../../../types/api/session';
import type { Player, PlayerSession } from '../../../types/battlemetrics';
import { formatDuration } from '../../../utils/dateFormatter';
import { generateId } from '../../../utils/idGenerator';

export const transformPlayer = (
  playerData: PlayerData, 
  sessions?: SessionData[]
): Player => {
  // Get all sessions for this player
  const playerSessions = sessions
    ?.filter(session => session.relationships.player.data.id === playerData.id)
    .map(session => ({
      id: generateId(),
      startTime: session.attributes.start,
      endTime: session.attributes.stop || undefined,
      duration: session.attributes.stop ? 
        formatDuration(
          new Date(session.attributes.start), 
          new Date(session.attributes.stop)
        ) : undefined
    }))
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()) || [];

  // Find current active session
  const currentSession = sessions?.find(
    session => 
      session.relationships.player.data.id === playerData.id && 
      session.attributes.stop === null
  );

  return {
    id: playerData.id,
    battlemetricsId: playerData.id,
    name: playerData.attributes.name,
    status: currentSession ? 'online' : 'offline',
    private: playerData.attributes.private,
    firstTime: currentSession?.attributes.firstTime || false,
    createdAt: playerData.attributes.createdAt,
    identifiers: playerData.relationships?.identifiers?.data.map(id => ({
      type: id.type,
      identifier: id.id
    })) || [],
    sessions: playerSessions
  };
};