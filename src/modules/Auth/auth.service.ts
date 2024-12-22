import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

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
  const accessToken = createToken(
    JwtPayload,
    config.jwt_access_expires_in as string,
    config.jwt_access_secret as string,
  );

  // create refresh token :
  const refreshToken = createToken(
    JwtPayload,
    config.jwt_refresh_expires_in as string,
    config.jwt_refresh_secret as string,
  );

  return {
    accessToken,
    refreshToken,
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

const refreshTokenInDB = async (token: string) => {
  // checking refresh token is valid or not:
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);

  // iat : token issued at time :
  const { userId, iat } = decoded as JwtPayload;

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

  // create token and send to user :
  const JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  // create access token :
  const accessToken = createToken(
    JwtPayload,
    config.jwt_access_expires_in as string,
    config.jwt_access_secret as string,
  );

  return { accessToken };
};

const forgetPasswordInDB = async (userId: string) => {
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

  // create token and send to user :
  const JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  // create access token :
  const resetToken = createToken(
    JwtPayload,
    config.jwt_access_expires_in as string,
    '10m',
  );

  // send to email user with reset link :
  const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;

  // dynamic send email and reset link :
  sendEmail(user.email, `<a href="${resetUILink}">Reset Password</a>`);
};

export const AuthService = {
  loginUserInDB,
  changePasswordInDB,
  refreshTokenInDB,
  forgetPasswordInDB,
};
