import { Router } from 'express';
import { StudentController } from './students.controller';

const router = Router();

router.post('/create-student', StudentController.createStudent);

export const StudentRoutes = router;
