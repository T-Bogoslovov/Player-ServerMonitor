import React from 'react';
import { Info } from 'lucide-react';
import type { Player } from '../types/battlemetrics';

interface PlayerIdentifiersProps {
  identifiers?: Player['identifiers'];
}

export const PlayerIdentifiers: React.FC<PlayerIdentifiersProps> = ({ identifiers }) => {
  if (!identifiers?.length) return null;

  return (
    <div className="mt-2 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <Info className="w-4 h-4" />
        <span>Identifiers:</span>
      </div>
      <ul className="ml-5 list-disc">
        {identifiers.map((id, index) => (
          <li key={index}>
            {id.type}: {id.identifier}
          </li>
        ))}
      </ul>
    </div>
  );
};