import React, { useState } from 'react';
import { X, Search, Server } from 'lucide-react';
import { searchServers } from '../../services/battlemetrics';
import type { ServerSearchResult } from '../../types/battlemetrics';

interface ChangeServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (serverId: string) => void;
}

export const ChangeServerModal: React.FC<ChangeServerModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ServerSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const data = await searchServers(query.trim());
      setResults(data);
      if (data.length === 0) setSearchError('No servers found');
    } catch {
      setSearchError('Search failed. Check your API token.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Change Server</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Search by name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Server name..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !query.trim()}
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {searchError && (
            <p className="text-sm text-red-700 bg-red-100 p-2 rounded">{searchError}</p>
          )}

          {results.length > 0 && (
            <div className="border rounded-lg divide-y">
              {results.map(server => (
                <button
                  key={server.id}
                  onClick={() => onSelect(server.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-medium text-sm">{server.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 shrink-0 ml-2">
                    <span>{server.players}/{server.maxPlayers}</span>
                    <span className={`w-2 h-2 rounded-full ${server.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Add by ID */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Or enter server ID directly</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualId}
                onChange={e => setManualId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && manualId.trim() && onSelect(manualId.trim())}
                placeholder="Server ID (e.g. 20634683)"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => manualId.trim() && onSelect(manualId.trim())}
                disabled={!manualId.trim()}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
              >
                Add by ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
