import { Router } from 'express';
import { CourseController } from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidation } from './course.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { TUserRole } from '../user/user.interface';

const router = Router();

router.post(
  '/create-course',
  auth(USER_ROLE.superAdmin as TUserRole, USER_ROLE.ADMIN as TUserRole),
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get(
  '/',
  auth(
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
  ),
  CourseController.getAllCourses,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
  ),
  CourseController.getSingleCourse,
);
router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin as TUserRole, USER_ROLE.ADMIN as TUserRole),
  CourseController.deleteCourse,
);
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin as TUserRole, USER_ROLE.ADMIN as TUserRole),
  validateRequest(CourseValidation.updateCourseValidationSchema),
  CourseController.updateCourse,
);

// put use if have any data then update and if not have any data then create a new one
router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.superAdmin as TUserRole, USER_ROLE.ADMIN as TUserRole),
  validateRequest(CourseValidation.FacultiesWithCourseValidationSchema),
  CourseController.assignFacultiesWithCourse,
);

router.get(
  '/:courseId/get-faculties',
  auth(
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
  ),
  CourseController.getAssignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.superAdmin as TUserRole, USER_ROLE.ADMIN as TUserRole),
  validateRequest(CourseValidation.FacultiesWithCourseValidationSchema),
  CourseController.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
