import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middleware/auth';
import { TUserRole } from '../user/user.interface';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// login and refresh token route naver use auth middleware because they are not protected route.

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.post(
  '/change-password',
  auth(
    //every user can change password
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
    USER_ROLE.superAdmin as TUserRole,
  ),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

export const AuthRoutes = router;
