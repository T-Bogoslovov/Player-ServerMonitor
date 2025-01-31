import React from 'react';
import { Users } from 'lucide-react';
import type { Player } from '../../types/battlemetrics';
import { sortPlayersBySessionStart } from '../../utils/playerSorter';

interface OnlinePlayersListProps {
  players: Player[];
  serverPlayers?: Player[];
}

export const OnlinePlayersList: React.FC<OnlinePlayersListProps> = ({ 
  players,
  serverPlayers = []
}) => {
  const allPlayers = React.useMemo(() => {
    const followedOnlinePlayers = players.filter(p => p.status === 'online');
    const uniquePlayers = new Map<string, Player>();
    
    // Add followed players first
    followedOnlinePlayers.forEach(player => {
      uniquePlayers.set(player.name.toLowerCase(), player);
    });
    
    // Add server players if not already included
    serverPlayers.forEach(player => {
      const key = player.name.toLowerCase();
      if (!uniquePlayers.has(key)) {
        uniquePlayers.set(key, player);
      }
    });
    
    // Convert to array and sort by session start time
    return sortPlayersBySessionStart(Array.from(uniquePlayers.values()));
  }, [players, serverPlayers]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-bold text-gray-800">
          Online Players ({allPlayers.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allPlayers.map(player => (
          <div 
            key={player.id} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <a 
              href={`https://www.battlemetrics.com/players/${player.battlemetricsId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {player.name}
            </a>
            {player.firstTime && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                NEW
              </span>
            )}
          </div>
        ))}
        {allPlayers.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-4">
            No players online
          </div>
        )}
      </div>
    </div>
  );
};