import React from 'react';
import { UserRound, UserMinus, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { Player } from '../types/battlemetrics';
import { PlayerStatusBadge } from './PlayerStatusBadge';
import { PlayerDatesRow } from './PlayerDatesRow';
import { PlayerIdentifiers } from './PlayerIdentifiers';
import { PlayerSessionHistory } from './PlayerSessionHistory';

interface PlayerCardProps {
  player: Player;
  onRemove: (id: string) => void;
  onRefresh: (id: string) => void;
  onClearSession: (playerId: string, sessionId: string) => void;
  isRefreshing: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onRemove,
  onRefresh,
  onClearSession,
  isRefreshing
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow-md transition-all hover:shadow-lg border-l-4 ${
        player.status === 'online'
          ? 'border-l-green-500'
          : 'border-l-red-500'
      }`}
    >
      {/* Header */}
      <div className={`p-4 ${isExpanded ? 'border-b border-gray-100' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <UserRound className="w-6 h-6 text-gray-600" />
            <div>
              <a
                href={`https://www.battlemetrics.com/players/${player.battlemetricsId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {player.name}
              </a>
              <PlayerStatusBadge status={player.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRefresh(player.id)}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
              title="Refresh player info"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onRemove(player.id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Remove player"
            >
              <UserMinus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-gray-50">
          <PlayerDatesRow player={player} />
          <PlayerIdentifiers identifiers={player.identifiers} />
          <PlayerSessionHistory
            player={player}
            onClearSession={(sessionId) => onClearSession(player.id, sessionId)}
          />
        </div>
      )}
    </div>
  );
};
