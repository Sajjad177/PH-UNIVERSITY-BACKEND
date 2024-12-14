import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUserInDB = async (payload: TLoginUser) => {
  // checking if ther user exist or not :

  const isUserExist = await User.isUserExistsByCustomID(payload.id);
  if (!isUserExist) {
    throw new AppError('User is not found', StatusCodes.NOT_FOUND);
  }

  // checking user is deleted or not :
  const isDeleted = isUserExist?.isDeleted;

  if (isDeleted) {
    throw new AppError('User is deleted', StatusCodes.BAD_REQUEST);
  }

  // checking user is blocked or not :
  if (isUserExist?.status === 'blocked') {
    throw new AppError('User is blocked', StatusCodes.BAD_REQUEST);
  }

  // checking password match or not :
  if (!(await User.isPasswordMatch(payload.password, isUserExist.password))) {
    throw new AppError('Password is not match', StatusCodes.BAD_REQUEST);
  }

  // send access token  and refresh token :

  return {};
};

export const AuthService = {
  loginUserInDB,
};
