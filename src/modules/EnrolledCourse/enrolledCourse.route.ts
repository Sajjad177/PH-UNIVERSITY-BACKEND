import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { enrolledCourseValidation } from './enrolledCourse.validation';
import { enrolledCourseController } from './enrolledCourse.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { TUserRole } from '../user/user.interface';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.STUDENT as TUserRole),
  validateRequest(
    enrolledCourseValidation.createEnrolledCourseValidationSchema,
  ),
  enrolledCourseController.createEnrolledCourse,
);

export const enrolledCourseRoute = router;
