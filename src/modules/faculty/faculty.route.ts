import { Router } from "express";
import { facultyController } from "./faculty.controller";
import validateRequest from "../../middleware/validateRequest";
import { facultyValidations } from "./faculty.validation";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  facultyController.createFaculty,
);

router.get('/', auth(), facultyController.getAllFaculties);

router.get('/:facultyId', facultyController.getSingleFaculty);

router.patch(
  '/:facultyId',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  facultyController.updateFaculty,
);

router.delete('/:facultyId', facultyController.deleteFaculty);

export const FacultyRoutes = router;
