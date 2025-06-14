#!/usr/bin/env node

import { Command } from 'commander';
import { PollingService } from './pollingService';
import { PollingScheduler } from './scheduler';
import { validateConfig } from './config';
import { logger } from './logger';

const program = new Command();

program
  .name('player-polling')
  .description('Player Polling Service CLI')
  .version('1.0.0');

program
  .command('start')
  .description('Start the polling scheduler')
  .action(async () => {
    try {
      validateConfig();
      const scheduler = new PollingScheduler();
      await scheduler.start();
    } catch (error) {
      logger.error('Failed to start scheduler', error);
      process.exit(1);
    }
  });

program
  .command('poll')
  .description('Run a single polling cycle')
  .action(async () => {
    try {
      validateConfig();
      const scheduler = new PollingScheduler();
      await scheduler.runOnce();
      logger.info('Polling cycle completed');
      process.exit(0);
    } catch (error) {
      logger.error('Polling cycle failed', error);
      process.exit(1);
    }
  });

program
  .command('add-player')
  .description('Add a player to track')
  .argument('<name>', 'Player name to add')
  .action(async (name: string) => {
    try {
      validateConfig();
      const service = new PollingService();
      await service.initialize();
      await service.addPlayerByName(name);
      await service.shutdown();
      logger.info(`Player ${name} added successfully`);
      process.exit(0);
    } catch (error) {
      logger.error(`Failed to add player ${name}`, error);
      process.exit(1);
    }
  });

program
  .command('stats')
  .description('Show polling statistics')
  .option('-h, --hours <hours>', 'Hours to look back', '24')
  .action(async (options) => {
    try {
      validateConfig();
      const service = new PollingService();
      await service.initialize();
      const stats = await service.getPollingStats(parseInt(options.hours));
      await service.shutdown();
      
      console.table(stats.map(s => ({
        timestamp: s.timestamp.toISOString(),
        players: s.playersCount,
        success: s.successCount,
        errors: s.errorCount,
        duration: `${s.duration}ms`
      })));
      
      process.exit(0);
    } catch (error) {
      logger.error('Failed to get stats', error);
      process.exit(1);
    }
  });

program.parse();