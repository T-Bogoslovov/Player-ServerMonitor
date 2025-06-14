import React, { useState } from 'react';
import { Activity, Clock, Users, AlertCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { usePollingData } from '../../hooks/usePollingData';
import { PlayerHistoryChart } from './PlayerHistoryChart';
import { PollingStatsCard } from './PollingStatsCard';
import { PlayerActivityHeatmap } from './PlayerActivityHeatmap';

export const PollingDashboard: React.FC = () => {
  const { 
    players, 
    stats, 
    loading, 
    error, 
    addPlayer, 
    triggerPoll,
    fetchPollingStats 
  } = usePollingData();
  
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    
    try {
      await addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleTriggerPoll = async () => {
    setIsTriggering(true);
    try {
      await triggerPoll();
    } catch (err) {
      console.error('Failed to trigger poll:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  const onlinePlayers = players.filter(p => 
    p.snapshots.length > 0 && p.snapshots[0].isOnline
  );

  const recentStats = stats.slice(0, 10);
  const avgSuccessRate = stats.length > 0 
    ? (stats.reduce((acc, s) => acc + (s.successCount / s.playersCount), 0) / stats.length * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              Player Polling Dashboard
            </h1>
          </div>
          <button
            onClick={handleTriggerPoll}
            disabled={isTriggering}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isTriggering ? 'animate-spin' : ''}`} />
            {isTriggering ? 'Polling...' : 'Trigger Poll'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users className="w-5 h-5" />
              <span className="font-medium">Tracked Players</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{players.length}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Online Now</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{onlinePlayers.length}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{avgSuccessRate.toFixed(1)}%</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Last Poll</span>
            </div>
            <div className="text-sm font-medium text-orange-700">
              {stats.length > 0 
                ? new Date(stats[0].timestamp).toLocaleTimeString()
                : 'Never'
              }
            </div>
          </div>
        </div>

        {/* Add Player Form */}
        <form onSubmit={handleAddPlayer} className="flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name to track"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !newPlayerName.trim()}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            Add Player
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>

      {/* Player List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tracked Players</h2>
        <div className="space-y-3">
          {players.map(player => {
            const latestSnapshot = player.snapshots[0];
            const isOnline = latestSnapshot?.isOnline || false;
            
            return (
              <div 
                key={player.id}
                className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${
                  isOnline 
                    ? 'border-l-green-500 bg-green-50 hover:bg-green-100' 
                    : 'border-l-red-500 bg-red-50 hover:bg-red-100'
                } ${selectedPlayer === player.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedPlayer(selectedPlayer === player.id ? null : player.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <h3 className="font-semibold text-gray-800">{player.currentName}</h3>
                      <p className="text-sm text-gray-600">
                        {latestSnapshot 
                          ? `Last seen: ${new Date(latestSnapshot.timestamp).toLocaleString()}`
                          : 'No data yet'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Snapshots: {player.snapshots.length}
                    </div>
                    {latestSnapshot?.durationSec && (
                      <div className="text-sm text-gray-600">
                        Session: {Math.floor(latestSnapshot.durationSec / 60)}m
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {players.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No players being tracked yet. Add some players to get started!
            </div>
          )}
        </div>
      </div>

      {/* Player History Chart */}
      {selectedPlayer && (
        <PlayerHistoryChart playerId={selectedPlayer} />
      )}

      {/* Activity Heatmap */}
      <PlayerActivityHeatmap players={players} />

      {/* Polling Statistics */}
      <PollingStatsCard stats={recentStats} />
    </div>
  );
};