import { DatabaseService } from './database';
import { BattleMetricsClient, BMPlayer, BMSession } from './battlemetricsClient';
import { config } from './config';
import { logger } from './logger';

export class PollingService {
  private db: DatabaseService;
  private bmClient: BattleMetricsClient;

  constructor() {
    this.db = new DatabaseService();
    this.bmClient = new BattleMetricsClient();
  }

  async initialize() {
    await this.db.connect();
    logger.info('Polling service initialized');
  }

  async shutdown() {
    await this.db.disconnect();
    logger.info('Polling service shutdown');
  }

  async pollAllPlayers(): Promise<void> {
    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    try {
      logger.info('Starting polling cycle');
      
      const players = await this.db.getActivePlayers();
      logger.info(`Found ${players.length} active players to poll`);

      // Get server data first to get current online players
      const serverData = await this.bmClient.retryRequest(() => 
        this.bmClient.getServerInfo(config.battlemetrics.serverId)
      );

      const onlinePlayers = this.extractPlayersFromServerData(serverData);
      const sessions = this.extractSessionsFromServerData(serverData);

      // Process each tracked player
      for (const player of players) {
        try {
          await this.pollSinglePlayer(player, onlinePlayers, sessions);
          successCount++;
        } catch (error) {
          errorCount++;
          const errorMsg = `Failed to poll player ${player.currentName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          logger.error(errorMsg, error);
        }
      }

      const duration = Date.now() - startTime;
      
      // Log polling cycle
      await this.db.logPollingCycle({
        playersCount: players.length,
        successCount,
        errorCount,
        duration,
        errors: errors.length > 0 ? errors : undefined
      });

      logger.info(`Polling cycle completed`, {
        duration: `${duration}ms`,
        success: successCount,
        errors: errorCount,
        total: players.length
      });

    } catch (error) {
      logger.error('Polling cycle failed', error);
      throw error;
    }
  }

  private extractPlayersFromServerData(serverData: any): Map<string, BMPlayer> {
    const players = new Map<string, BMPlayer>();
    
    if (serverData.included) {
      serverData.included
        .filter((item: any) => item.type === 'player')
        .forEach((player: BMPlayer) => {
          players.set(player.id, player);
        });
    }
    
    return players;
  }

  private extractSessionsFromServerData(serverData: any): Map<string, BMSession[]> {
    const sessions = new Map<string, BMSession[]>();
    
    if (serverData.included) {
      serverData.included
        .filter((item: any) => item.type === 'session')
        .forEach((session: BMSession) => {
          const playerId = session.relationships.player.data.id;
          if (!sessions.has(playerId)) {
            sessions.set(playerId, []);
          }
          sessions.get(playerId)!.push(session);
        });
    }
    
    return sessions;
  }

  private async pollSinglePlayer(
    player: any,
    onlinePlayers: Map<string, BMPlayer>,
    sessions: Map<string, BMSession[]>
  ): Promise<void> {
    const bmPlayer = onlinePlayers.get(player.bmId);
    const playerSessions = sessions.get(player.bmId) || [];
    
    // Check if player name changed
    if (bmPlayer && bmPlayer.attributes.name !== player.currentName) {
      await this.db.updatePlayerName(player.id, bmPlayer.attributes.name);
      logger.info(`Updated name for player ${player.bmId}: ${player.currentName} -> ${bmPlayer.attributes.name}`);
    }

    // Determine online status and session info
    const isOnline = !!bmPlayer;
    let sessionStart: Date | undefined;
    let sessionEnd: Date | undefined;
    let durationSec: number | undefined;
    let firstTime = false;

    if (isOnline && playerSessions.length > 0) {
      // Find current active session
      const activeSession = playerSessions.find(s => s.attributes.stop === null);
      if (activeSession) {
        sessionStart = new Date(activeSession.attributes.start);
        firstTime = activeSession.attributes.firstTime;
        durationSec = Math.floor((Date.now() - sessionStart.getTime()) / 1000);
      }
    } else if (!isOnline && playerSessions.length > 0) {
      // Find most recent completed session
      const recentSession = playerSessions
        .filter(s => s.attributes.stop !== null)
        .sort((a, b) => new Date(b.attributes.stop!).getTime() - new Date(a.attributes.stop!).getTime())[0];
      
      if (recentSession) {
        sessionStart = new Date(recentSession.attributes.start);
        sessionEnd = new Date(recentSession.attributes.stop!);
        durationSec = Math.floor((sessionEnd.getTime() - sessionStart.getTime()) / 1000);
      }
    }

    // Create snapshot
    await this.db.createSnapshot({
      playerId: player.id,
      isOnline,
      sessionStart,
      sessionEnd,
      durationSec,
      firstTime,
      private: bmPlayer?.attributes.private || false
    });

    logger.debug(`Created snapshot for player ${player.currentName}`, {
      isOnline,
      sessionStart: sessionStart?.toISOString(),
      sessionEnd: sessionEnd?.toISOString(),
      durationSec
    });
  }

  async addPlayerByName(name: string): Promise<void> {
    try {
      logger.info(`Adding player by name: ${name}`);
      
      const searchResults = await this.bmClient.retryRequest(() =>
        this.bmClient.searchPlayerByName(name)
      );

      if (searchResults.length === 0) {
        throw new Error(`Player "${name}" not found`);
      }

      const player = searchResults[0];
      
      // Check if player already exists
      const existingPlayers = await this.db.getActivePlayers();
      const exists = existingPlayers.some(p => p.bmId === player.id);
      
      if (exists) {
        throw new Error(`Player "${name}" is already being tracked`);
      }

      await this.db.addPlayer(player.id, player.attributes.name, config.battlemetrics.serverId);
      logger.info(`Successfully added player: ${player.attributes.name} (${player.id})`);
      
    } catch (error) {
      logger.error(`Failed to add player ${name}`, error);
      throw error;
    }
  }

  async getPlayerHistory(playerId: number, hours = 24) {
    const from = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.db.getPlayerSnapshots(playerId, from);
  }

  async getPollingStats(hours = 24) {
    return this.db.getPollingStats(hours);
  }
}