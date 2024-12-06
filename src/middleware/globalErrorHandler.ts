import { ErrorRequestHandler } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../modules/interface/globalInterface';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // setting default status code and message
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong';

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  // handling zod error ->
  const handleZodError = (error: ZodError) => {
    const errorSource = error.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue?.message,
      };
    });

    const statusCode = 400;

    return {
      statusCode,
      message: 'Validation Error',
      errorSource,
    };
  };

  // checking it's zod error ->
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }

  // ultimate return
  res.status(statusCode).json({
    success: false,
    message: message,
    errorSource,
    stack: config.NODE_ENV === 'development' ? error.stack : null,
  });
};

export default globalErrorHandler;

//! error handling pattern --------------------------------
/*
1. success
2. message
3. error source [
  - path 
  - message
  ]
  4. stack

*/
