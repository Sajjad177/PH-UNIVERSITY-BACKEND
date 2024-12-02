import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

// validateRequest middleware use for validation request data
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validation request check
      await schema.parseAsync({
        body: req.body,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
