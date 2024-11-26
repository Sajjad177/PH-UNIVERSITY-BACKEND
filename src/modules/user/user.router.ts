import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.post('/create-user', UserController.createStudent);

export const UserRoutes = router;
