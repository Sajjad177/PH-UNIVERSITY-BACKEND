import express from 'express';
import { OfferedCourseController } from './offeredCourse.controller';
import validateRequest from '../../middleware/validateRequest';
import { OfferedCourseValidation } from './offeredCourse.Validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { TUserRole } from '../user/user.interface';

const router = express.Router();

router.post(
  '/create-offered-course',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
  ),
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse,
);

router.get(
  '/',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
  ),
  OfferedCourseController.getAllOfferedCourse,
);

router.get(
  '/my-offered-course',
  auth(USER_ROLE.STUDENT as TUserRole),
  OfferedCourseController.getMyOfferedCourse,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
  ),
  OfferedCourseController.getSingleOfferedCourse,
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.superAdmin as TUserRole),
  validateRequest(OfferedCourseValidation.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.superAdmin as TUserRole),
  OfferedCourseController.deleteOfferedCourse,
);

export const OfferedCourseRoutes = router;
