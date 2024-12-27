import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from './user.controller';
import { StudentValidationZodSchema } from '../students/students.zod.validation';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidations } from '../Admin/admin.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import { TUserRole } from './user.interface';
import { UserValidationZodSchema } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router.post(
  '/create-student',
  auth(USER_ROLE.ADMIN as TUserRole, USER_ROLE.superAdmin as TUserRole),
  upload.single('file'), // parse / upload the file
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data); // parse the data from the body
    next();
  },
  validateRequest(StudentValidationZodSchema.createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.ADMIN as TUserRole),
  upload.single('file'), // parse / upload the file
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data); // parse the data from the body
    next();
  },
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.ADMIN as TUserRole),
  upload.single('file'), // parse / upload the file
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data); // parse the data from the body
    next();
  },
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);
// there only one student can be created by the student itself so no one can check other student data.
router.get(
  '/me',
  auth(
    USER_ROLE.ADMIN as TUserRole,
    USER_ROLE.STUDENT as TUserRole,
    USER_ROLE.FACULTY as TUserRole,
  ),
  UserController.getMe,
);

// handle user status :
router.post(
  '/change-status/:id',
  auth(USER_ROLE.ADMIN as TUserRole),
  validateRequest(UserValidationZodSchema.changeStatusValidationSchema),
  UserController.changeStatus,
);

export const UserRoutes = router;
