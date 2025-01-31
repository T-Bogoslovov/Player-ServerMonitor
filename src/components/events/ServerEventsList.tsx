import React from 'react';
import { History } from 'lucide-react';
import { ServerEventItem } from './ServerEventItem';
import type { ServerEvent } from '../../types/battlemetrics';

interface ServerEventsListProps {
  events: ServerEvent[];
}

export const ServerEventsList: React.FC<ServerEventsListProps> = ({ events }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <History className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold text-gray-800">Server Events</h2>
      </div>
      
      <div className="h-48 overflow-y-auto space-y-2">
        {events.map(event => (
          <ServerEventItem key={event.id} event={event} />
        ))}
        {events.length === 0 && (
          <p className="text-center text-gray-500">No events recorded yet</p>
        )}
      </div>
    </div>
  );
};