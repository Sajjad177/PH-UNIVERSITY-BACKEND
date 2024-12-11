import { Router } from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import validateRequest from '../../middleware/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

const router = Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistration);

router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration,
);

export const SemesterRegistrationRouter = router;
