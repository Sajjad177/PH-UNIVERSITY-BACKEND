import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUserInDB = async (payload: TLoginUser) => {
  // checking if ther user exist or not :

  const user = await User.isUserExistsByCustomID(payload.id);

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

  // checking password match or not :
  if (!(await User.isPasswordMatch(payload.password, user.password))) {
    throw new AppError('Password is not match', StatusCodes.BAD_REQUEST);
  }

  // create token and send to user :
  const JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  // create access token :
  const accessToken = jwt.sign(JwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
    // when user login first time he login by default password and user need to change password :
    needToChangePassword: user?.needsPasswordChange,
  };
};

export const AuthService = {
  loginUserInDB,
};
