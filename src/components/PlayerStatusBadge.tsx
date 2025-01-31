import React from 'react';
import { CircleDot } from 'lucide-react';

interface PlayerStatusBadgeProps {
  status: 'online' | 'offline';
}

export const PlayerStatusBadge: React.FC<PlayerStatusBadgeProps> = ({ status }) => {
  const colors = {
    online: 'text-green-500',
    offline: 'text-red-500'
  };

  return (
    <div className="flex items-center gap-1">
      <CircleDot className={`w-4 h-4 ${colors[status]}`} />
      <span className={`text-sm font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};