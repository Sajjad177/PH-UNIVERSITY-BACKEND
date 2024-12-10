import { Router } from 'express';
import { CourseController } from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidation } from './course.validation';

const router = Router();

router.post(
  '/create-course',
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getSingleCourse);
router.delete('/:id', CourseController.deleteCourse);
router.patch(
  '/:id',
  validateRequest(CourseValidation.updateCourseValidationSchema),
  CourseController.updateCourse,
);

export const CourseRoutes = router;
