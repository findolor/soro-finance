import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../../utils/logger';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    logger.warn({
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      requestId: req.requestId
    });

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    return;
  }

  // Log unexpected errors
  logger.error({
    message: 'Unexpected error',
    data: {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      requestId: req.requestId
    }
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;

  res.status(500).json({
    status: 'error',
    message
  });
}; 