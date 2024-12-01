import { RequestHandler, Router } from 'express';
import { StudentController } from './students.controller';

const router = Router();





router.get('/get-students', StudentController.getAllStudents as RequestHandler);
router.get(
  '/get-student/:id',
  StudentController.getSingleStudent as RequestHandler,
);
router.delete('/:id', StudentController.deleteStudent as RequestHandler);

export const StudentRoutes = router;
