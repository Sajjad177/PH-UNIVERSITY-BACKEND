import { Router } from 'express';
import { UserController } from './user.controller';
import { StudentValidationZodSchema } from '../students/students.zod.validation';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from '../Admin/admin.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { TUserRole } from './user.interface';

const router = Router();

router.post(
  '/create-user',
  auth(USER_ROLE.admin as TUserRole),   // authorization : role checking :
  validateRequest(StudentValidationZodSchema.createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin as TUserRole), 
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.ADMIN as TUserRole),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);

export const UserRoutes = router;
