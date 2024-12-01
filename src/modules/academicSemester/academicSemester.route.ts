import { Router } from 'express';
import { academicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemesterValidation } from './academicSemesterValidation';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  academicSemesterController.createAcademicSemester,
);

router.get('/', academicSemesterController.getAllAcademicSemester);

router.get(
  '/:semesterId',
  academicSemesterController.getSingleAcademicSemester,
);

//! update academic semester there some problem for update:
router.patch(
  '/update/:semesterId',
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  academicSemesterController.updateAcademicSemester,
);

export const academicSemesterRoutes = router;
