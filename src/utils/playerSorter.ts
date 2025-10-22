import type { Player } from '../types/battlemetrics';

export const sortPlayersBySessionStart = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => {
    if (!a.sessionStart) return 1;
    if (!b.sessionStart) return -1;
    return new Date(a.sessionStart).getTime() - new Date(b.sessionStart).getTime();
  });
};