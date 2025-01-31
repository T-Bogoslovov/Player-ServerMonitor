import React from 'react';
import { Clock } from 'lucide-react';
import { formatDate, formatHours } from '../utils/dateFormatter';

interface PlayerSessionProps {
  status: 'online' | 'offline';
  timePlayed?: number;
  sessionStart?: string;
  sessionEnd?: string;
}

export const PlayerSession: React.FC<PlayerSessionProps> = ({
  status,
  timePlayed,
  sessionStart,
  sessionEnd
}) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Clock className="w-4 h-4" />
      <div className="flex flex-col">
        {timePlayed !== undefined && (
          <span>Total: {formatHours(timePlayed)}</span>
        )}
        {status === 'online' && sessionStart && (
          <span className="text-green-600">
            Started: {formatDate(sessionStart)}
          </span>
        )}
        {status === 'offline' && sessionStart && sessionEnd && (
          <span>
            Last: {formatDate(sessionStart)} - {formatDate(sessionEnd)}
          </span>
        )}
      </div>
    </div>
  );
};