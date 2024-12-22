import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};


export default catchAsync;


//This is a good practice to handle async error. and it is a good way to handle async error.
