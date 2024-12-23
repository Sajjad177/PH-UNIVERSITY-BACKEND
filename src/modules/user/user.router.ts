import { Router } from 'express';
import { UserController } from './user.controller';
import { StudentValidationZodSchema } from '../students/students.zod.validation';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from '../Admin/admin.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { TUserRole } from './user.interface';
import { UserValidationZodSchema } from './user.validation';

const router = Router();

router.post(
  '/create-user',
  auth(USER_ROLE.ADMIN as TUserRole), // authorization : role checking :
  validateRequest(StudentValidationZodSchema.createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.ADMIN as TUserRole),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.ADMIN as TUserRole),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);
// there only one student can be created by the student itself so no one can check other student data.
router.get(
  '/me',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
  ),
  UserController.getMe,
);

// handle user status :
router.post(
  '/change-status/:id',
  auth(USER_ROLE.ADMIN as TUserRole),
  validateRequest(UserValidationZodSchema.changeStatusValidationSchema),
  UserController.changeStatus,
);

export const UserRoutes = router;
