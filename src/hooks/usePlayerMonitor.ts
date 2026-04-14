import { useState, useEffect, useCallback } from 'react';
import { fetchServerInfo } from '../services/battlemetrics';
import { generateId } from '../utils/idGenerator';
import { logger } from '../utils/logger';
import { storage } from '../utils/storage';
import { DEFAULT_SERVER_ID } from '../services/api/constants';
import type { Player, ServerResponse, ServerInfo, ServerEvent } from '../types/battlemetrics';

const STORAGE_KEY = 'monitored_players';
const SERVER_ID_KEY = 'active_server_id';
const REFRESH_INTERVAL = 60000; // 1 minute

export const usePlayerMonitor = () => {
  const [serverId, setServerId] = useState<string>(() =>
    storage.get(SERVER_ID_KEY, DEFAULT_SERVER_ID)
  );
  const [server, setServer] = useState<ServerInfo | null>(null);
  const [players, setPlayers] = useState<Player[]>(() =>
    storage.get(STORAGE_KEY, [])
  );
  const [serverPlayers, setServerPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<ServerEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshingPlayers, setRefreshingPlayers] = useState<string[]>([]);
  const [lastApiResponse, setLastApiResponse] = useState<ServerResponse | null>(null);

  const updatePlayerStatuses = useCallback(async (playerIds?: string[], overrideServerId?: string) => {
    try {
      if (playerIds) {
        setRefreshingPlayers(prev => [...prev, ...playerIds]);
      } else {
        setLoading(true);
      }

      const activeServerId = overrideServerId ?? storage.get(SERVER_ID_KEY, DEFAULT_SERVER_ID);
      const response = await fetchServerInfo(activeServerId);
      setLastApiResponse(response);
      setServer(response.server);
      setServerPlayers(response.players);

      // Get the most recent removePlayer event for each player
      const lastSeenMap = new Map<string, string>();
      response.events.forEach(event => {
        if (event.type === 'removePlayer' && event.name) {
          const playerName = event.name.toLowerCase();
          if (!lastSeenMap.has(playerName)) {
            lastSeenMap.set(playerName, event.timestamp);
          }
        }
      });

      setEvents(prev => [...response.events, ...prev].slice(0, 100));

      const serverPlayerMap = new Map(
        response.players.map(player => [player.battlemetricsId, player])
      );

      setPlayers(current =>
        current.map(player => {
          const serverPlayer = serverPlayerMap.get(player.battlemetricsId);
          const playerName = player.name.toLowerCase();
          const sessions = [...(player.sessions || [])];

          if (!serverPlayer) {
            // Player is offline - use the most recent removePlayer event timestamp
            const lastSeen = lastSeenMap.get(playerName);
            if (lastSeen && sessions.length > 0 && !sessions[0].endTime) {
              // Update the last session's end time instead of creating a new one
              sessions[0].endTime = lastSeen;
            }
            return {
              ...player,
              status: 'offline' as const,
              sessions,
              identifiers: []
            };
          }

          // Player is online
          if (sessions.length === 0) {
            // Create new session with the actual start time from the API
            sessions.unshift({
              id: generateId(),
              startTime: serverPlayer.sessions[0]?.startTime || new Date().toISOString(),
              endTime: undefined
            });
          } else if (sessions[0].endTime) {
            // Last session ended, create a new one with actual start time
            sessions.unshift({
              id: generateId(),
              startTime: serverPlayer.sessions[0]?.startTime || new Date().toISOString(),
              endTime: undefined
            });
          }

          // name: serverPlayer.name intentionally overwrites stored name (handles renames)
          return {
            ...player,
            ...serverPlayer,
            status: 'online',
            sessions
          };
        })
      );

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update player statuses';
      setError(errorMessage);
      setLastApiResponse(null);
      logger.error('Error updating player statuses', err);
    } finally {
      if (playerIds) {
        setRefreshingPlayers(prev =>
          prev.filter(id => !playerIds.includes(id))
        );
      } else {
        setLoading(false);
      }
    }
  }, []);

  const addPlayer = useCallback(async (name: string) => {
    if (!name.trim()) {
      setError('Player name cannot be empty');
      return;
    }

    const normalizedName = name.trim();
    const existingPlayer = players.find(
      p => p.name.toLowerCase() === normalizedName.toLowerCase()
    );

    if (existingPlayer) {
      setError('Player is already being monitored');
      return;
    }

    try {
      const activeServerId = storage.get(SERVER_ID_KEY, DEFAULT_SERVER_ID);
      const response = await fetchServerInfo(activeServerId);
      const serverPlayer = response.players.find(
        p => p.name.toLowerCase() === normalizedName.toLowerCase()
      );

      if (!serverPlayer) {
        setError('Player not found on server');
        return;
      }

      const alreadyTracked = players.find(p => p.battlemetricsId === serverPlayer.battlemetricsId);
      if (alreadyTracked) {
        setError('Player is already being monitored');
        return;
      }

      const newPlayer: Player = {
        id: generateId(),
        battlemetricsId: serverPlayer.battlemetricsId,
        name: serverPlayer.name,
        status: serverPlayer.status,
        firstTime: serverPlayer.firstTime,
        identifiers: serverPlayer.identifiers,
        createdAt: serverPlayer.createdAt,
        sessions: serverPlayer.sessions || []
      };

      setPlayers(prev => [...prev, newPlayer]);
      setError(null);
    } catch (err) {
      setError('Failed to add player');
      logger.error('Error adding player', err);
    }
  }, [players]);

  const changeServer = useCallback((newId: string) => {
    storage.set(SERVER_ID_KEY, newId);
    setServerId(newId);
    setPlayers([]);
    updatePlayerStatuses(undefined, newId);
  }, [updatePlayerStatuses]);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  }, []);

  const refreshPlayer = useCallback((id: string) => {
    updatePlayerStatuses([id]);
  }, [updatePlayerStatuses]);

  const clearPlayerSession = useCallback((playerId: string, sessionId: string) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          sessions: player.sessions.filter(session => session.id !== sessionId)
        };
      }
      return player;
    }));
  }, []);

  // Save players to storage when they change
  useEffect(() => {
    storage.set(STORAGE_KEY, players);
  }, [players]);

  // Set up periodic refresh interval
  useEffect(() => {
    updatePlayerStatuses();
    const intervalId = setInterval(() => {
      updatePlayerStatuses();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [updatePlayerStatuses]);

  return {
    server,
    serverId,
    players,
    serverPlayers,
    events,
    loading,
    error,
    addPlayer,
    removePlayer,
    refreshPlayer,
    clearPlayerSession,
    changeServer,
    refreshingPlayers,
    lastApiResponse
  };
};
