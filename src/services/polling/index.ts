#!/usr/bin/env node

import { PollingScheduler } from './scheduler';
import { config, validateConfig } from './config';
import { logger } from './logger';

async function main() {
  try {
    // Validate configuration
    validateConfig();
    
    logger.info('Starting Player Polling Service', {
      serverId: config.battlemetrics.serverId,
      pollInterval: `${config.polling.intervalMinutes} minutes`
    });

    const scheduler = new PollingScheduler();
    
    // Handle graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      try {
        await scheduler.stop();
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
      process.exit(1);
    });

    // Start the scheduler
    await scheduler.start();
    
    logger.info('Player Polling Service is running. Press Ctrl+C to stop.');
    
    // Keep the process alive
    process.stdin.resume();
    
  } catch (error) {
    logger.error('Failed to start Player Polling Service', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}