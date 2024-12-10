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

// put use if have any data then update and if not have any data then create a new one
router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidation.FacultiesWithCourseValidationSchema),
  CourseController.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidation.FacultiesWithCourseValidationSchema),
  CourseController.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
