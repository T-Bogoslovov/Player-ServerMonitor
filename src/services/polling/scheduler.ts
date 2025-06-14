import cron from 'node-cron';
import { PollingService } from './pollingService';
import { config } from './config';
import { logger } from './logger';

export class PollingScheduler {
  private pollingService: PollingService;
  private cronJob: cron.ScheduledTask | null = null;
  private isRunning = false;

  constructor() {
    this.pollingService = new PollingService();
  }

  async start(): Promise<void> {
    try {
      await this.pollingService.initialize();
      
      // Create cron schedule (every N minutes)
      const schedule = `*/${config.polling.intervalMinutes} * * * *`;
      
      logger.info(`Starting polling scheduler with interval: ${config.polling.intervalMinutes} minutes`);
      
      this.cronJob = cron.schedule(schedule, async () => {
        if (this.isRunning) {
          logger.warn('Previous polling cycle still running, skipping this cycle');
          return;
        }
        
        this.isRunning = true;
        try {
          await this.pollingService.pollAllPlayers();
        } catch (error) {
          logger.error('Polling cycle failed', error);
        } finally {
          this.isRunning = false;
        }
      }, {
        scheduled: false // Don't start immediately
      });

      // Start the cron job
      this.cronJob.start();
      
      // Run initial poll
      logger.info('Running initial polling cycle...');
      await this.pollingService.pollAllPlayers();
      
      logger.info('Polling scheduler started successfully');
      
    } catch (error) {
      logger.error('Failed to start polling scheduler', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    logger.info('Stopping polling scheduler...');
    
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    
    // Wait for current polling cycle to complete
    while (this.isRunning) {
      logger.info('Waiting for current polling cycle to complete...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await this.pollingService.shutdown();
    logger.info('Polling scheduler stopped');
  }

  async runOnce(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Polling cycle already running');
    }
    
    this.isRunning = true;
    try {
      await this.pollingService.initialize();
      await this.pollingService.pollAllPlayers();
    } finally {
      this.isRunning = false;
      await this.pollingService.shutdown();
    }
  }

  getStatus() {
    return {
      isScheduled: !!this.cronJob,
      isRunning: this.isRunning,
      intervalMinutes: config.polling.intervalMinutes
    };
  }
}