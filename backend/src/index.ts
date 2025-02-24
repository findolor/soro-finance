import app from './app';
import environment from './config/environment';
import logger from './utils/logger';

const startServer = async () => {
  try {
    const port = environment.port;
    
    app.listen(port, () => {
      logger.info({
        message: 'Server started successfully',
        data: {
          port,
          environment: environment.nodeEnv,
        }
      });
    });
  } catch (error) {
    logger.error({
      message: 'Failed to start server',
      data: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    process.exit(1);
  }
};

startServer(); 