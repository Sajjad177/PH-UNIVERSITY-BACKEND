export const USER_ROLE = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
  superAdmin: 'super-admin',
} as const; // readonly array can't be changed after declaration

export const userStatus = ['in-progress', 'blocked'];
