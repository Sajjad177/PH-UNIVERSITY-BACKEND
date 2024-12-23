import { RequestHandler, Router } from 'express';
import { StudentController } from './students.controller';
import validateRequest from '../../middleware/validateRequest';
import { StudentValidationZodSchema } from './students.zod.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { TUserRole } from '../user/user.interface';

const router = Router();

router.get('/', StudentController.getAllStudents);

// there admin and faculty can get any student data :
router.get(
  '/:id',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.FACULTY as TUserRole),
  StudentController.getSingleStudent,
);

router.delete('/:id', StudentController.deleteStudent);

router.patch(
  '/:id',
  validateRequest(StudentValidationZodSchema.updateStudentValidationZodSchema),
  StudentController.updateStudent,
);



export const StudentRoutes = router;
