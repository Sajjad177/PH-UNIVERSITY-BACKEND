import { StatusCodes } from 'http-status-codes';
import AppError from '../error/AppError';
import catchAsync from '../utils/catchAsync';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

//TODO: auth authentication middleware :
const auth = (...requiredRoles: TUserRole[]) => {
  // console.log('auth middleware', requiredRoles);
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
    // iat : token issued at time :
    const { role, userId, iat } = decoded as JwtPayload;

    // checking if ther user exist or not :
    const user = await User.isUserExistsByCustomID(userId);

    if (!user) {
      throw new AppError('User is not found', StatusCodes.NOT_FOUND);
    }

    // checking user is deleted or not :
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError('User is deleted', StatusCodes.BAD_REQUEST);
    }

    // checking user is blocked or not :
    if (user?.status === 'blocked') {
      throw new AppError('User is blocked', StatusCodes.BAD_REQUEST);
    }

    // comparing jwt issued time and password change time and throw error if token is invalid :
    if (
      user.passwordChangeAt &&
      User.isJwtIssuedBeforePasswordChange(user.passwordChangeAt, iat as number)
    ) {
      throw new AppError('Token is invalid', StatusCodes.UNAUTHORIZED);
    }

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
