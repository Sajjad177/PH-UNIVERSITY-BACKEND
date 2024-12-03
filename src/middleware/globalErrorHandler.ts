import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Something went wrong';

  res.status(statusCode).json({ 
    success: false,
    message: message,
    error: error,
  });
};

export default globalErrorHandler;
