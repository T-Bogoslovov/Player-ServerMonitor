import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';
import { usePollingData, PlayerSnapshot } from '../../hooks/usePollingData';

interface PlayerHistoryChartProps {
  playerId: number;
}

export const PlayerHistoryChart: React.FC<PlayerHistoryChartProps> = ({ playerId }) => {
  const { fetchPlayerHistory } = usePollingData();
  const [snapshots, setSnapshots] = useState<PlayerSnapshot[]>([]);
  const [timeRange, setTimeRange] = useState(24);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const data = await fetchPlayerHistory(playerId, timeRange);
        setSnapshots(data);
      } catch (err) {
        console.error('Failed to load player history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [playerId, timeRange, fetchPlayerHistory]);

  const onlineSnapshots = snapshots.filter(s => s.isOnline);
  const totalOnlineTime = onlineSnapshots.reduce((acc, s) => acc + (s.durationSec || 0), 0);
  const avgSessionLength = onlineSnapshots.length > 0 
    ? totalOnlineTime / onlineSnapshots.length 
    : 0;

  // Group snapshots by hour for visualization
  const hourlyData = snapshots.reduce((acc, snapshot) => {
    const hour = new Date(snapshot.timestamp).getHours();
    if (!acc[hour]) {
      acc[hour] = { online: 0, offline: 0 };
    }
    if (snapshot.isOnline) {
      acc[hour].online++;
    } else {
      acc[hour].offline++;
    }
    return acc;
  }, {} as Record<number, { online: number; offline: number }>);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-800">Player Activity History</h2>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value={6}>Last 6 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={72}>Last 3 days</option>
          <option value={168}>Last week</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading history...</div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Total Online Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {Math.floor(totalOnlineTime / 3600)}h {Math.floor((totalOnlineTime % 3600) / 60)}m
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Sessions</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{onlineSnapshots.length}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Avg Session</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {Math.floor(avgSessionLength / 60)}m
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {snapshots.slice(0, 20).map(snapshot => (
                <div 
                  key={snapshot.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    snapshot.isOnline ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      snapshot.isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className={`font-medium ${
                      snapshot.isOnline ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {snapshot.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {new Date(snapshot.timestamp).toLocaleString()}
                    </div>
                    {snapshot.durationSec && (
                      <div className="text-xs text-gray-500">
                        Duration: {Math.floor(snapshot.durationSec / 60)}m
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Activity Chart */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity by Hour</h3>
            <div className="flex items-end justify-between h-32 bg-gray-50 p-4 rounded-lg">
              {Array.from({ length: 24 }, (_, hour) => {
                const data = hourlyData[hour] || { online: 0, offline: 0 };
                const total = data.online + data.offline;
                const maxHeight = 80;
                const height = total > 0 ? Math.max(4, (total / Math.max(...Object.values(hourlyData).map(d => d.online + d.offline), 1)) * maxHeight) : 4;
                
                return (
                  <div key={hour} className="flex flex-col items-center">
                    <div 
                      className="w-3 bg-blue-500 rounded-t"
                      style={{ height: `${height}px` }}
                      title={`${hour}:00 - Online: ${data.online}, Offline: ${data.offline}`}
                    />
                    <div className="text-xs text-gray-500 mt-1">{hour}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};