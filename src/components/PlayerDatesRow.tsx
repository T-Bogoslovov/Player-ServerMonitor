import React from 'react';
import { Clock, History } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import { getAccountAge } from '../utils/dateUtils';
import type { Player } from '../types/battlemetrics';

interface PlayerDatesRowProps {
  player: Player;
}

export const PlayerDatesRow: React.FC<PlayerDatesRowProps> = ({ player }) => {
  const currentSession = player.sessions?.[0];
  
  return (
    <div className="space-y-2">
      {/* Session Info */}
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-blue-500 shrink-0" />
        <div className="space-y-1">
          {player.status === 'online' && currentSession && (
            <>
              <div className="text-green-600">
                Online since: {formatDate(currentSession.startTime)}
              </div>
              {currentSession.duration && (
                <div className="text-green-700 text-xs">
                  Duration: {currentSession.duration}
                </div>
              )}
            </>
          )}
          {player.status === 'offline' && currentSession?.endTime && (
            <div className="text-red-600">
              Last seen: {formatDate(currentSession.endTime)}
            </div>
          )}
        </div>
      </div>

      {/* Account Age */}
      {player.createdAt && (
        <div className="flex items-center gap-2 text-sm">
          <History className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="text-gray-600">
            Account age: {getAccountAge(player.createdAt)}
          </span>
        </div>
      )}
    </div>
  );
};