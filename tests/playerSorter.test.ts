import assert from 'node:assert/strict';
import test from 'node:test';

import { sortPlayersBySessionStart } from '../src/utils/playerSorter';
import type { Player } from '../src/types/battlemetrics';

const createPlayer = (overrides: Partial<Player>): Player => ({
  id: 'id',
  battlemetricsId: 'bm-id',
  name: 'Player',
  status: 'online',
  identifiers: [],
  sessions: [],
  ...overrides,
});

test('sorts players by earliest sessionStart first', () => {
  const players: Player[] = [
    createPlayer({ id: '1', name: 'Late', sessionStart: '2024-09-02T12:00:00.000Z' }),
    createPlayer({ id: '2', name: 'Early', sessionStart: '2024-09-02T10:00:00.000Z' }),
    createPlayer({ id: '3', name: 'Middle', sessionStart: '2024-09-02T11:00:00.000Z' }),
  ];

  const sorted = sortPlayersBySessionStart(players);
  assert.deepEqual(sorted.map((player) => player.name), ['Early', 'Middle', 'Late']);
});

test('players missing sessionStart are sorted to the end', () => {
  const players: Player[] = [
    createPlayer({ id: '1', name: 'With start', sessionStart: '2024-09-02T12:00:00.000Z' }),
    createPlayer({ id: '2', name: 'No start', sessionStart: undefined }),
  ];

  const sorted = sortPlayersBySessionStart(players);
  assert.strictEqual(sorted.at(-1)?.name, 'No start');
});

test('players without sessionStart retain their relative order', () => {
  const players: Player[] = [
    createPlayer({ id: '1', name: 'First missing', sessionStart: undefined }),
    createPlayer({ id: '2', name: 'Second missing', sessionStart: undefined }),
    createPlayer({ id: '3', name: 'Has start', sessionStart: '2024-09-02T12:00:00.000Z' }),
  ];

  const sorted = sortPlayersBySessionStart(players);
  const missingPlayers = sorted.filter((player) => !player.sessionStart);
  assert.deepEqual(
    missingPlayers.map((player) => player.name),
    ['First missing', 'Second missing'],
  );
});

test('does not mutate the original players array', () => {
  const players: Player[] = [
    createPlayer({ id: '1', name: 'A', sessionStart: '2024-09-02T12:00:00.000Z' }),
    createPlayer({ id: '2', name: 'B', sessionStart: '2024-09-02T11:00:00.000Z' }),
  ];

  const originalOrder = players.map((player) => player.id);
  sortPlayersBySessionStart(players);
  assert.deepEqual(players.map((player) => player.id), originalOrder);
});
