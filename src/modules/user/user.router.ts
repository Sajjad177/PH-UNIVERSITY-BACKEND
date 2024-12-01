import { Router } from 'express';
import { UserController } from './user.controller';
import { StudentValidationZodSchema } from '../students/students.zod.validation';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.post(
  '/create-user',
  validateRequest(StudentValidationZodSchema.createStudentValidationSchema),
  UserController.createStudent,
);

export const UserRoutes = router;
