import { Router } from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import validateRequest from '../../middleware/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { TUserRole } from '../user/user.interface';

const router = Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.superAdmin as TUserRole),
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);

router.get(
  '/',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
  ),
  SemesterRegistrationController.getAllSemesterRegistration,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
  ),
  SemesterRegistrationController.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.superAdmin as TUserRole),
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);

export const SemesterRegistrationRouter = router;
