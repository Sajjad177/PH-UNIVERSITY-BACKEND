import { Router } from 'express';
import { StudentRoutes } from '../modules/students/students.route';
import { UserRoutes } from '../modules/user/user.router';

const router = Router();

const moduleRoutes = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
