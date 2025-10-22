import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface PollingPlayer {
  id: number;
  bmId: string;
  currentName: string;
  serverId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  snapshots: PlayerSnapshot[];
  nameHistory: NameHistory[];
}

export interface PlayerSnapshot {
  id: number;
  playerId: number;
  timestamp: string;
  isOnline: boolean;
  sessionStart?: string;
  sessionEnd?: string;
  durationSec?: number;
  kills?: number;
  deaths?: number;
  resources?: string;
  firstTime: boolean;
  private: boolean;
}

export interface NameHistory {
  id: number;
  playerId: number;
  name: string;
  changedAt: string;
}

export interface PollingStats {
  id: number;
  timestamp: string;
  playersCount: number;
  successCount: number;
  errorCount: number;
  duration: number;
  errors?: string;
}

const API_BASE = 'http://localhost:3001/api';

export const usePollingData = () => {
  const [players, setPlayers] = useState<PollingPlayer[]>([]);
  const [stats, setStats] = useState<PollingStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/players`);
      setPlayers(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch players');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlayerHistory = useCallback(async (playerId: number, hours = 24) => {
    try {
      const response = await axios.get(`${API_BASE}/players/${playerId}/snapshots?hours=${hours}`);
      return response.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch player history');
    }
  }, []);

  const addPlayer = useCallback(async (name: string) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/players`, { name });
      await fetchPlayers(); // Refresh the list
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add player';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchPlayers]);

  const fetchPollingStats = useCallback(async (hours = 24) => {
    try {
      const response = await axios.get(`${API_BASE}/polling/stats?hours=${hours}`);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch polling stats:', err);
    }
  }, []);

  const triggerPoll = useCallback(async () => {
    try {
      await axios.post(`${API_BASE}/polling/trigger`);
      // Refresh data after polling
      setTimeout(() => {
        fetchPlayers();
        fetchPollingStats();
      }, 2000);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to trigger polling');
    }
  }, [fetchPlayers, fetchPollingStats]);

  useEffect(() => {
    fetchPlayers();
    fetchPollingStats();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      fetchPlayers();
      fetchPollingStats();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [fetchPlayers, fetchPollingStats]);

  return {
    players,
    stats,
    loading,
    error,
    fetchPlayers,
    fetchPlayerHistory,
    addPlayer,
    triggerPoll,
    fetchPollingStats
  };
};