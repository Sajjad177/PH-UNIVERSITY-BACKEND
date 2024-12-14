// import { StatusCodes } from 'http-status-codes';
// import AppError from '../../error/AppError';
// import { User } from '../user/user.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
// import bcrypt from 'bcrypt';

const loginUserInDB = async (payload: TLoginUser) => {
  // checking if ther user exist or not :
  if (!(await User.isUserExistsByCustomID(payload.id))) {
    throw new AppError('User is not found', StatusCodes.NOT_FOUND);
  }

  // // checking user is deleted or not :
  // const isUserDeleted = isUserExist?.isDeleted;

  // if (isUserDeleted) {
  //   throw new AppError('User is deleted', StatusCodes.BAD_REQUEST);
  // }

  // // checking user is blocked or not :
  // const isUserStatus = isUserExist?.status;

  // if (isUserStatus === 'blocked') {
  //   throw new AppError('User is blocked', StatusCodes.BAD_REQUEST);
  // }

  // // checking password match or not :
  // const isPasswordMatch = await bcrypt.compare(
  //   payload.password,
  //   isUserExist.password,
  // );

  // if (!isPasswordMatch) {
  //   throw new AppError('Password is not match', StatusCodes.BAD_REQUEST);
  // }

  // send access token  and refresh token :

  return {};
};

export const AuthService = {
  loginUserInDB,
};
