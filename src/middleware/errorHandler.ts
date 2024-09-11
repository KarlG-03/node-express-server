import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const NODE_ENV = process.env.NODE_ENV || 'development';

  if (NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (NODE_ENV === 'production') {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
}
