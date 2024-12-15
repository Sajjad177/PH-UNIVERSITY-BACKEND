import { Router } from 'express';
import { facultyController } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidations } from './faculty.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { TUserRole } from '../user/user.interface';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.FACULTY as TUserRole),
  facultyController.getAllFaculties,
);

router.get('/:facultyId', facultyController.getSingleFaculty);

router.patch(
  '/:facultyId',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  facultyController.updateFaculty,
);

router.delete('/:facultyId', facultyController.deleteFaculty);

export const FacultyRoutes = router;
