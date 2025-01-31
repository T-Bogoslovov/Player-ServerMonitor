import React from 'react';
import { ArrowUp } from 'lucide-react';

interface ServerRatesProps {
  rates: {
    gather: number;
    craft: number;
    component: number;
    scrap: number;
  };
}

export const ServerRates: React.FC<ServerRatesProps> = ({ rates }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(rates).map(([key, value]) => (
        <div key={key} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className={`w-5 h-5 ${getColorForRate(value)}`} />
            <span className="capitalize">{key}</span>
          </div>
          <div className="text-2xl font-bold">{value}x</div>
        </div>
      ))}
    </div>
  );
};

const getColorForRate = (rate: number): string => {
  if (rate <= 1) return 'text-gray-500';
  if (rate <= 2) return 'text-blue-500';
  if (rate <= 5) return 'text-green-500';
  return 'text-purple-500';
};