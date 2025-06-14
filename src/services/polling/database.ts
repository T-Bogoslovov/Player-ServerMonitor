import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  async connect() {
    try {
      await this.prisma.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
    logger.info('Database disconnected');
  }

  // Player management
  async getActivePlayers() {
    return this.prisma.player.findMany({
      where: { isActive: true },
      include: {
        snapshots: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        }
      }
    });
  }

  async addPlayer(bmId: string, name: string, serverId?: string) {
    return this.prisma.player.create({
      data: {
        bmId,
        currentName: name,
        serverId
      }
    });
  }

  async updatePlayerName(playerId: number, newName: string) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId }
    });

    if (!player) return null;

    // Only update if name actually changed
    if (player.currentName !== newName) {
      // Add to name history
      await this.prisma.nameHistory.create({
        data: {
          playerId,
          name: newName
        }
      });

      // Update current name
      return this.prisma.player.update({
        where: { id: playerId },
        data: { currentName: newName }
      });
    }

    return player;
  }

  async createSnapshot(data: {
    playerId: number;
    isOnline: boolean;
    sessionStart?: Date;
    sessionEnd?: Date;
    durationSec?: number;
    kills?: number;
    deaths?: number;
    resources?: any;
    firstTime?: boolean;
    private?: boolean;
  }) {
    return this.prisma.playerSnapshot.create({
      data: {
        ...data,
        resources: data.resources ? JSON.stringify(data.resources) : null
      }
    });
  }

  async getPlayerSnapshots(playerId: number, from?: Date, to?: Date) {
    return this.prisma.playerSnapshot.findMany({
      where: {
        playerId,
        timestamp: {
          gte: from,
          lte: to
        }
      },
      orderBy: { timestamp: 'desc' }
    });
  }

  async logPollingCycle(data: {
    playersCount: number;
    successCount: number;
    errorCount: number;
    duration: number;
    errors?: string[];
  }) {
    return this.prisma.pollingLog.create({
      data: {
        ...data,
        errors: data.errors ? JSON.stringify(data.errors) : null
      }
    });
  }

  async getPollingStats(hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.prisma.pollingLog.findMany({
      where: {
        timestamp: { gte: since }
      },
      orderBy: { timestamp: 'desc' }
    });
  }

  get client() {
    return this.prisma;
  }
}