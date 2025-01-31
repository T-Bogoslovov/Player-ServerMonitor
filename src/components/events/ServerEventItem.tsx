import React from 'react';
import { UserPlus, UserMinus, Activity } from 'lucide-react';
import type { ServerEvent } from '../../types/battlemetrics';

interface ServerEventItemProps {
  event: ServerEvent;
}

export const ServerEventItem: React.FC<ServerEventItemProps> = ({ event }) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'addPlayer':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'removePlayer':
        return <UserMinus className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  const getEventText = () => {
    switch (event.type) {
      case 'addPlayer':
        return 'joined';
      case 'removePlayer':
        return 'left';
      default:
        return event.type;
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
      {getEventIcon()}
      <span className="font-medium text-gray-700">{event.name}</span>
      <span className="text-gray-500">{getEventText()}</span>
      <span className="text-gray-400 text-sm ml-auto">
        {new Date(event.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
};