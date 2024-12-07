import { Router } from "express";
import { facultyController } from "./faculty.controller";
import validateRequest from "../../middleware/validateRequest";
import { facultyValidations } from "./faculty.validation";

const router = Router();

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  facultyController.createFaculty,
);

export const FacultyRoutes = router;
