import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

// user interface for user model 
export interface TUser {
  id: string;
  email: string;
  password: string;
  passwordChangeAt?: Date;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  isDeleted: boolean;
  status: 'in-progress' | 'blocked';
}

// static methods : function dafaination : for id checking method
export interface UserModel extends Model<TUser> {
  // reusable static methods :
  isUserExistsByCustomID(id: string): Promise<TUser>;
  isUserDeletedChecking(isDeleted: boolean): Promise<TUser>;
  isUserStatusChecking(status: 'blocked'): Promise<TUser>;
  isPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  // checking jwt issued time is before password change time :[if any one hacked the jwt token then he can't access the user data]
  isJwtIssuedBeforePasswordChange(
    passwordChangeTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}

// type of user role
export type TUserRole = keyof typeof USER_ROLE;
