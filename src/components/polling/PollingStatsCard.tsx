import React from 'react';
import { BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PollingStats } from '../../hooks/usePollingData';

interface PollingStatsCardProps {
  stats: PollingStats[];
}

export const PollingStatsCard: React.FC<PollingStatsCardProps> = ({ stats }) => {
  if (stats.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-800">Polling Statistics</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          No polling statistics available yet
        </div>
      </div>
    );
  }

  const totalPolls = stats.length;
  const successfulPolls = stats.filter(s => s.errorCount === 0).length;
  const successRate = (successfulPolls / totalPolls) * 100;
  const avgDuration = stats.reduce((acc, s) => acc + s.duration, 0) / stats.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-bold text-gray-800">Polling Statistics</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Total Polls</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{totalPolls}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-700">{successRate.toFixed(1)}%</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Avg Duration</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{avgDuration.toFixed(0)}ms</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Failed Polls</span>
          </div>
          <div className="text-2xl font-bold text-red-700">{totalPolls - successfulPolls}</div>
        </div>
      </div>

      {/* Recent Polling History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Polling History</h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {stats.map(stat => (
            <div 
              key={stat.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                stat.errorCount === 0 ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {stat.errorCount === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium text-gray-800">
                    {stat.successCount}/{stat.playersCount} players polled
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(stat.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {stat.duration}ms
                </div>
                {stat.errorCount > 0 && (
                  <div className="text-xs text-red-600">
                    {stat.errorCount} errors
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};