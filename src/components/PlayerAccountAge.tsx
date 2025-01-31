import React from 'react';
import { History } from 'lucide-react';
import { getAccountAge } from '../utils/dateUtils';

interface PlayerAccountAgeProps {
  createdAt?: string;
}

export const PlayerAccountAge: React.FC<PlayerAccountAgeProps> = ({ createdAt }) => {
  if (!createdAt) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <History className="w-4 h-4" />
      <span>Account age: {getAccountAge(createdAt)}</span>
    </div>
  );
};