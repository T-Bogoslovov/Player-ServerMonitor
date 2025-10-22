import type { Player } from '../types/battlemetrics';

export const sortPlayersBySessionStart = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => {
    const aTime = a.sessionStart ? new Date(a.sessionStart).getTime() : null;
    const bTime = b.sessionStart ? new Date(b.sessionStart).getTime() : null;

    if (aTime === null && bTime === null) return 0;
    if (aTime === null) return 1;
    if (bTime === null) return -1;

    return aTime - bTime;
  });
};
