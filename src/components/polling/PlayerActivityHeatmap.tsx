import React from 'react';
import { Calendar, Activity } from 'lucide-react';
import { PollingPlayer } from '../../hooks/usePollingData';

interface PlayerActivityHeatmapProps {
  players: PollingPlayer[];
}

export const PlayerActivityHeatmap: React.FC<PlayerActivityHeatmapProps> = ({ players }) => {
  // Generate last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  // Calculate activity for each day
  const activityData = days.map(day => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    let totalActivity = 0;
    let playersActive = 0;

    players.forEach(player => {
      const daySnapshots = player.snapshots.filter(snapshot => {
        const snapshotDate = new Date(snapshot.timestamp);
        return snapshotDate >= dayStart && snapshotDate <= dayEnd;
      });

      if (daySnapshots.length > 0) {
        playersActive++;
        totalActivity += daySnapshots.filter(s => s.isOnline).length;
      }
    });

    return {
      date: day,
      activity: totalActivity,
      playersActive,
      intensity: Math.min(totalActivity / Math.max(players.length, 1), 1)
    };
  });

  const maxActivity = Math.max(...activityData.map(d => d.activity), 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-bold text-gray-800">Activity Heatmap (Last 30 Days)</h2>
      </div>

      <div className="space-y-4">
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
              <div
                key={intensity}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: intensity === 0 
                    ? '#f3f4f6' 
                    : `rgba(34, 197, 94, ${0.2 + intensity * 0.8})`
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-1">
          {activityData.map((day, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-sm border border-gray-200 flex items-center justify-center text-xs cursor-pointer hover:border-gray-400 transition-colors"
              style={{
                backgroundColor: day.activity === 0 
                  ? '#f3f4f6' 
                  : `rgba(34, 197, 94, ${0.2 + (day.activity / maxActivity) * 0.8})`
              }}
              title={`${day.date.toLocaleDateString()}: ${day.activity} activities, ${day.playersActive} players active`}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Total Activities</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {activityData.reduce((acc, day) => acc + day.activity, 0)}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Active Days</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {activityData.filter(day => day.activity > 0).length}
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Avg Daily Activity</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {(activityData.reduce((acc, day) => acc + day.activity, 0) / 30).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};