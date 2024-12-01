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

export const academicSemesterRoutes = router;