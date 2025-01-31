import React from 'react';
import type { Player } from '../types/battlemetrics';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
  onRefreshPlayer: (id: string) => void;
  onClearSession: (playerId: string, sessionId: string) => void;
  refreshingPlayers: string[];
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  onRemovePlayer,
  onRefreshPlayer,
  onClearSession,
  refreshingPlayers
}) => {
  return (
    <div className="space-y-4">
      {players.map(player => (
        <PlayerCard
          key={player.id}
          player={player}
          onRemove={onRemovePlayer}
          onRefresh={onRefreshPlayer}
          onClearSession={onClearSession}
          isRefreshing={refreshingPlayers.includes(player.id)}
        />
      ))}
      {players.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500">
          No players added yet
        </div>
      )}
    </div>
  );
};