import React from 'react';
import { X, Globe, Users, Map, Clock, Calendar, Settings } from 'lucide-react';
import type { ServerInfo } from '../../types/battlemetrics';
import { ServerRates } from './ServerRates';

interface ServerModalProps {
  server: ServerInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const ServerModal: React.FC<ServerModalProps> = ({ server, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Server Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={Globe} label="Location" value={server.location.country} />
            <InfoCard icon={Users} label="Players" value={`${server.players}/${server.maxPlayers}`} />
            <InfoCard icon={Map} label="Map Size" value={`${server.details.worldSize}x${server.details.worldSize}`} />
            <InfoCard icon={Clock} label="Uptime" value={`${Math.floor(server.details.uptime / 3600)}h`} />
            <InfoCard icon={Calendar} label="Next Wipe" value={new Date(server.details.nextWipe).toLocaleDateString()} />
            <InfoCard icon={Settings} label="Game Mode" value={server.details.gameMode} />
          </div>

          {/* Server Rates */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Server Rates</h3>
            <ServerRates rates={server.details.rates} />
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {server.details.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{
  icon: React.FC<any>;
  label: string;
  value: string | number;
}> = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center gap-2 text-gray-600 mb-1">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </div>
    <div className="text-lg font-medium">{value}</div>
  </div>
);