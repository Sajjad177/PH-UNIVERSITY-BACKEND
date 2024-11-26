export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  isDeleted: boolean;
  status: 'in-progress' | 'blocked';
};
