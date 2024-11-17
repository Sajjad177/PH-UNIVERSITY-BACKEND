import { Router } from 'express';
import { StudentController } from './students.controller';

const router = Router();

router.post('/create-student', StudentController.createStudent);
router.get('/get-students', StudentController.getAllStudents);
router.get('/get-student/:id', StudentController.getSingleStudent);

export const StudentRoutes = router;
