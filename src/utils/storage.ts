import { logger } from './logger';

const STORAGE_PREFIX = 'battlemetrics_';

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      logger.error(`Failed to load ${key} from storage`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${key}`,
        JSON.stringify(value)
      );
    } catch (error) {
      logger.error(`Failed to save ${key} to storage`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      logger.error(`Failed to remove ${key} from storage`, error);
    }
  }
};