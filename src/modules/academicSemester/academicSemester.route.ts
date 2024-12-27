import { Router } from 'express';
import { academicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemesterValidation } from './academicSemesterValidation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { TUserRole } from '../user/user.interface';

const router = Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.superAdmin as TUserRole),
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  academicSemesterController.createAcademicSemester,
);

router.get(
  '/',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
  ),
  academicSemesterController.getAllAcademicSemester,
);

router.get(
  '/:semesterId',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.superAdmin as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
  ),
  academicSemesterController.getSingleAcademicSemester,
);

//! update academic semester there some problem for update:
router.patch(
  '/:semesterId',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.superAdmin as TUserRole),
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  academicSemesterController.updateAcademicSemester,
);

export const academicSemesterRoutes = router;
