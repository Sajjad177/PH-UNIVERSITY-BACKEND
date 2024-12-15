import { Router } from 'express';
import { UserController } from './user.controller';
import { StudentValidationZodSchema } from '../students/students.zod.validation';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from '../Admin/admin.validation';
import { facultyValidations } from '../faculty/faculty.validation';

const router = Router();

router.post(
  '/create-user',
  validateRequest(StudentValidationZodSchema.createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);

export const UserRoutes = router;
