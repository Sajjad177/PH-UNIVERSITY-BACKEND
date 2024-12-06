import express from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import validateRequest from '../../middleware/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.Validation';

const router = express.Router();

router.post(
  '/create-department',
  // validateRequest(AcademicDepartmentValidation.createAcademicDepartmentSchema),
  AcademicDepartmentController.createAcademicDepartment,
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartments);

router.get(
  '/:departmentId',
  AcademicDepartmentController.getSingleAcademicDepartment,
);

router.patch(
  '/:departmentId',
  validateRequest(AcademicDepartmentValidation.updateAcademicDepartmentSchema),
  AcademicDepartmentController.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
