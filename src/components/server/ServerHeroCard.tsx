import React, { useState } from 'react';
import { Users, Clock, Map, Calendar } from 'lucide-react';
import { ServerModal } from './ServerModal';
import type { ServerInfo } from '../../types/battlemetrics';

interface ServerHeroCardProps {
  server: ServerInfo;
}

export const ServerHeroCard: React.FC<ServerHeroCardProps> = ({ server }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-lg shadow-lg p-6 mb-8 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Server Image */}
          <div className="w-full md:w-1/3">
            <img 
              src={server.details.headerImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2940"} 
              alt={server.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          {/* Server Info */}
          <div className="w-full md:w-2/3 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{server.name}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>{server.players}/{server.maxPlayers}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-green-500" />
                <span>{server.details.map}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span>{Math.floor(server.details.uptime / 3600)}h uptime</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <span>Next Wipe: {new Date(server.details.nextWipe).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {server.details.modded && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Modded
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm ${
                server.status === 'online' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {server.status}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <ServerModal 
        server={server}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};