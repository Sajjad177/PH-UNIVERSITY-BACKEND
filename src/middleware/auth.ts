import { StatusCodes } from 'http-status-codes';
import AppError from '../error/AppError';
import catchAsync from '../utils/catchAsync';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TUserRole } from '../modules/user/user.interface';

//TODO: auth authentication middleware :
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking token is sent form client side or not :
    if (!token) {
      throw new AppError(
        'Unauthorized failed you are not allowed',
        StatusCodes.UNAUTHORIZED,
      );
    }

    // checking token is valid or not:
    const decoded = jwt.verify(token, config.jwt_access_secret as string);

    // checking decoded is valid or not:
    if (!decoded) {
      throw new AppError(
        'You are not authorized for access',
        StatusCodes.UNAUTHORIZED,
      );
    }

    const { role } = decoded as JwtPayload;

    //TODO : authorization : role checking :
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError('You are not authorized', StatusCodes.UNAUTHORIZED);
    }

    // adding decoded to express request object and decler a file in interface folder index.d.ts :
    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
