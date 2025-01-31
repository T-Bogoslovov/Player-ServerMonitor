import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';

interface PlayerCreationTimeProps {
  createdAt?: string;
}

export const PlayerCreationTime: React.FC<PlayerCreationTimeProps> = ({ createdAt }) => {
  if (!createdAt) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Calendar className="w-4 h-4" />
      <span>Created: {formatDate(createdAt)}</span>
    </div>
  );
};