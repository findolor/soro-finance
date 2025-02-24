import app from './app';
import environment from './config/environment';
import logger from './utils/logger';

const startServer = async () => {
  try {
    const port = environment.port;
    
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
      logger.info(`Environment: ${environment.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 