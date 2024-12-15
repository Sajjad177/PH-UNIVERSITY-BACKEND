import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

// validateRequest middleware use for validation request data
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // validation request check
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies, // for refresh token
    });
    next();
  });
};

export default validateRequest;
