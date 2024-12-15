import { Router } from 'express';
import { CourseController } from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidation } from './course.validation';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/create-course',
  auth('ADMIN'),
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get('/', CourseController.getAllCourses);
router.get('/:id', auth('ADMIN', 'FACULTY', 'STUDENT'), CourseController.getSingleCourse);
router.delete('/:id', auth('ADMIN'), CourseController.deleteCourse);
router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(CourseValidation.updateCourseValidationSchema),
  CourseController.updateCourse,
);

// put use if have any data then update and if not have any data then create a new one
router.put(
  '/:courseId/assign-faculties',
  auth('ADMIN'),
  validateRequest(CourseValidation.FacultiesWithCourseValidationSchema),
  CourseController.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth('ADMIN'),
  validateRequest(CourseValidation.FacultiesWithCourseValidationSchema),
  CourseController.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
