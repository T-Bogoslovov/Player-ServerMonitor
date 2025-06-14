import dotenv from 'dotenv';

dotenv.config();

export const config = {
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db'
  },
  battlemetrics: {
    apiToken: process.env.BM_API_TOKEN || '',
    serverId: process.env.BM_SERVER_ID || '20634683',
    baseUrl: 'https://api.battlemetrics.com'
  },
  polling: {
    intervalMinutes: parseInt(process.env.POLL_INTERVAL_MINUTES || '5'),
    maxRetries: 3,
    retryDelayMs: 1000
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

export const validateConfig = () => {
  if (!config.battlemetrics.apiToken) {
    throw new Error('BM_API_TOKEN environment variable is required');
  }
  
  if (!config.battlemetrics.serverId) {
    throw new Error('BM_SERVER_ID environment variable is required');
  }
};