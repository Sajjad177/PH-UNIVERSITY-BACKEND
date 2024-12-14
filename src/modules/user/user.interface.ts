import { Model } from 'mongoose';

export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  isDeleted: boolean;
  status: 'in-progress' | 'blocked';
}

// static methods : function dafaination :
export interface UserModel extends Model<TUser> {  
  // reusable static methods :
  isUserExistsByCustomID(id: string): Promise<TUser>;
}
