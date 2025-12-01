import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = config.database.uri;
    const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    
    logger.info('Connecting to MongoDB...');
    logger.debug(`MongoDB URI: ${maskedUri}`);
    
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error: unknown) {
    logger.error('MongoDB connection failed', error);
    
    if (process.env.NODE_ENV === 'development') {
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logger.info('MongoDB is not running or connection string is incorrect.');
      logger.info('\n📋 To fix this:');
      logger.info('\nOption 1: Start Local MongoDB');
      logger.info('  • Windows: MongoDB should start automatically as a service');
      logger.info('  • Mac: brew services start mongodb-community');
      logger.info('  • Linux: sudo systemctl start mongod');
      logger.info('\nOption 2: Use MongoDB Atlas (Cloud - Free)');
      logger.info('  • Sign up at: https://www.mongodb.com/cloud/atlas');
      logger.info('  • Create a free cluster');
      logger.info('  • Get connection string and update MONGODB_URI in .env');
      const maskedUri = config.database.uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
      logger.info(`\nCurrent connection string: ${maskedUri}`);
      logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
    process.exit(1);
  }
};

