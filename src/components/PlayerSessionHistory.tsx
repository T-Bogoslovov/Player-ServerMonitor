import React from 'react';
import { Clock, X } from 'lucide-react';
import type { Player } from '../types/battlemetrics';
import { formatDuration } from '../utils/dateFormatter';

interface PlayerSessionHistoryProps {
  player: Player;
  onClearSession: (sessionId: string) => void;
}

export const PlayerSessionHistory: React.FC<PlayerSessionHistoryProps> = ({ 
  player,
  onClearSession
}) => {
  if (!player.sessions?.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-700">Session History</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left font-medium text-gray-600">Start Time</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">End Time</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Duration</th>
              <th className="px-4 py-2 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {player.sessions.map((session) => {
              const duration = !session.endTime ? 
                formatDuration(new Date(session.startTime), new Date()) :
                formatDuration(new Date(session.startTime), new Date(session.endTime));
              
              return (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">
                    {new Date(session.startTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {session.endTime ? 
                      new Date(session.endTime).toLocaleString() : 
                      'Active'
                    }
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {duration}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => onClearSession(session.id)}
                      className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove session"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};