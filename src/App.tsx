import React, { useState } from 'react';
import { Users, Database, Activity } from 'lucide-react';
import { PlayerList } from './components/PlayerList';
import { AddPlayerForm } from './components/AddPlayerForm';
import { ApiDebug } from './components/ApiDebug';
import { ServerHeroCard } from './components/server/ServerHeroCard';
import { OnlinePlayersList } from './components/server/OnlinePlayersList';
import { ServerEventsList } from './components/events/ServerEventsList';
import { PollingDashboard } from './components/polling/PollingDashboard';
import { usePlayerMonitor } from './hooks/usePlayerMonitor';

type TabType = 'live' | 'polling';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('live');
  
  const { 
    server,
    players,
    serverPlayers,
    events,
    loading, 
    error, 
    addPlayer, 
    removePlayer,
    refreshPlayer,
    clearPlayerSession,
    refreshingPlayers,
    lastApiResponse
  } = usePlayerMonitor();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header with Tabs */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                Player Monitor
              </h1>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('live')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'live'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Activity className="w-5 h-5" />
                Live Monitor
              </button>
              <button
                onClick={() => setActiveTab('polling')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'polling'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Database className="w-5 h-5" />
                Historical Data
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'live' ? (
            <>
              {/* Server Hero Card */}
              {server && <ServerHeroCard server={server} />}

              {/* Following Players */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Following Players</h2>
                <AddPlayerForm onAddPlayer={addPlayer} />

                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="mt-6">
                  {loading && players.length === 0 ? (
                    <div className="text-center text-gray-500">Loading...</div>
                  ) : (
                    <PlayerList 
                      players={players}
                      onRemovePlayer={removePlayer}
                      onRefreshPlayer={refreshPlayer}
                      onClearSession={clearPlayerSession}
                      refreshingPlayers={refreshingPlayers}
                    />
                  )}
                </div>
              </div>

              {/* Online Players */}
              <OnlinePlayersList 
                players={players}
                serverPlayers={serverPlayers}
              />
            </>
          ) : (
            <div className="text-center py-4 text-gray-600">
              Switch to the Historical Data tab to view polling dashboard
            </div>
          )}
        </div>

        {/* Conditional Content Based on Tab */}
        {activeTab === 'live' ? (
          <>
            {/* Server Events */}
            <ServerEventsList events={events} />

            {/* API Debug */}
            <ApiDebug 
              apiResponse={lastApiResponse}
              error={error}
            />
          </>
        ) : (
          /* Polling Dashboard */
          <PollingDashboard />
        )}
      </main>
    </div>
  );
};

export default App;