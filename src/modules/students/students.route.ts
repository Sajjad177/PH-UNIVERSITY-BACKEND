import { RequestHandler, Router } from 'express';
import { StudentController } from './students.controller';
import validateRequest from '../../middleware/validateRequest';
import { StudentValidationZodSchema } from './students.zod.validation';

const router = Router();

router.get('/', StudentController.getAllStudents as RequestHandler);

router.get('/:studentId', StudentController.getSingleStudent as RequestHandler);

router.delete(
  '/:generatedId',
  StudentController.deleteStudent as RequestHandler,
);

router.patch(
  '/:studentId',
  validateRequest(StudentValidationZodSchema.updateStudentValidationZodSchema),
  StudentController.updateStudent as RequestHandler,
);

export const StudentRoutes = router;
