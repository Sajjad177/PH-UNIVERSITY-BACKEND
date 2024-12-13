import { Router } from 'express';
import { StudentRoutes } from '../modules/students/students.route';
import { UserRoutes } from '../modules/user/user.router';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { CourseRoutes } from '../modules/course/course.route';
import { SemesterRegistrationRouter } from '../modules/semesterRegistration/semesterRegistration.router';
import { OfferedCourseRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { AdminRoutes } from '../modules/Admin/admin.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registrations',
    route: SemesterRegistrationRouter,
  },
  {
    path: '/offered-courses',
    route: OfferedCourseRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
