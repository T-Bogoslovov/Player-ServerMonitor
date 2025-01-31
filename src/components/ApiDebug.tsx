import React from 'react';
import { Terminal } from 'lucide-react';
import type { ServerResponse } from '../types/battlemetrics';

interface ApiDebugProps {
  apiResponse: ServerResponse | null;
  error: string | null;
}

export const ApiDebug: React.FC<ApiDebugProps> = ({ apiResponse, error }) => {
  const debugInfo = apiResponse?.meta.debug;
  
  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-5 h-5" />
        <h2 className="text-lg font-semibold">API Debug</h2>
      </div>
      
      {error ? (
        <div className="text-red-400 whitespace-pre-wrap font-mono text-sm">
          Error: {error}
        </div>
      ) : debugInfo ? (
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-2">
            <h3 className="text-sm font-semibold text-gray-400 mb-1">Request URL:</h3>
            <code className="text-green-400 text-sm break-all">{debugInfo.requestUrl}</code>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-1">Raw Response:</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96 text-blue-300">
              {JSON.stringify(debugInfo.rawResponse, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-gray-400">No API response data available</div>
      )}
    </div>
  );
};