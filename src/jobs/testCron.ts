import cron from 'node-cron';
import logger from '../utils/logger';

// Create a cron job that runs every 5 seconds
// The pattern '*/5 * * * * *' means: at every 5th second
export const startTestCron = () => {
    cron.schedule('*/5 * * * * *', () => {
        logger.info('Test cron job running - logging every 5 seconds');
    });
    
    logger.info('Test cron job has been initialized');
}; 