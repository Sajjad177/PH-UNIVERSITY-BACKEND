import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

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

const changePasswordInDB = async (
  payload: {
    oldPassword: string;
    newPassword: string;
  },
  userData: JwtPayload,
) => {
  // checking if ther user exist or not :

  const user = await User.isUserExistsByCustomID(userData?.userId);

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
  if (!(await User.isPasswordMatch(payload.oldPassword, user.password))) {
    throw new AppError('Password is not match', StatusCodes.BAD_REQUEST);
  }

  // hash password new password :
  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: hashedNewPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  );
  return null;
};

export const AuthService = {
  loginUserInDB,
  changePasswordInDB,
};
