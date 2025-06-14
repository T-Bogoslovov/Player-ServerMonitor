import express from 'express';
import cors from 'cors';
import { DatabaseService } from './database';
import { PollingService } from './pollingService';
import { logger } from './logger';

const app = express();
const db = new DatabaseService();
const pollingService = new PollingService();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Middleware for error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('API Error', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all tracked players
app.get('/api/players', async (req, res) => {
  try {
    const players = await db.getActivePlayers();
    res.json(players);
  } catch (error) {
    logger.error('Failed to get players', error);
    res.status(500).json({ error: 'Failed to get players' });
  }
});

// Get player snapshots
app.get('/api/players/:id/snapshots', async (req, res) => {
  try {
    const playerId = parseInt(req.params.id);
    const hours = parseInt(req.query.hours as string) || 24;
    
    const snapshots = await pollingService.getPlayerHistory(playerId, hours);
    res.json(snapshots);
  } catch (error) {
    logger.error('Failed to get player snapshots', error);
    res.status(500).json({ error: 'Failed to get player snapshots' });
  }
});

// Add player by name
app.post('/api/players', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Player name is required' });
    }
    
    await pollingService.addPlayerByName(name.trim());
    res.json({ success: true, message: `Player ${name} added successfully` });
  } catch (error) {
    logger.error('Failed to add player', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to add player' });
  }
});

// Get polling statistics
app.get('/api/polling/stats', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const stats = await pollingService.getPollingStats(hours);
    res.json(stats);
  } catch (error) {
    logger.error('Failed to get polling stats', error);
    res.status(500).json({ error: 'Failed to get polling stats' });
  }
});

// Trigger manual poll
app.post('/api/polling/trigger', async (req, res) => {
  try {
    await pollingService.pollAllPlayers();
    res.json({ success: true, message: 'Polling cycle triggered successfully' });
  } catch (error) {
    logger.error('Failed to trigger polling', error);
    res.status(500).json({ error: 'Failed to trigger polling cycle' });
  }
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

export const startApiServer = async () => {
  await db.connect();
  await pollingService.initialize();
  
  const server = app.listen(PORT, HOST, () => {
    logger.info(`API server running on http://${HOST}:${PORT}`);
  });
  
  return server;
};