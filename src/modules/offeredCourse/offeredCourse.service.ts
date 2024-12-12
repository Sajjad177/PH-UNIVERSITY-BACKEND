import { StatusCodes } from 'http-status-codes';
import { SemesterRegistration } from './../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import AppError from '../../error/AppError';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  // check if the semesterRegistration is exist :
  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExist) {
    throw new AppError(
      'Semester Registration not found',
      StatusCodes.NOT_FOUND,
    );
  }

  // get the academicSemester from the semesterRegistration :
  const academicSemester = isSemesterRegistrationExist.academicSemester;



  // check if the academicFaculty is exist :
  const isAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExist) {
    throw new AppError('Academic Faculty not found', StatusCodes.NOT_FOUND);
  }

  // check if the academicDepartment is exist :
  const isAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExist) {
    throw new AppError('Academic Department not found', StatusCodes.NOT_FOUND);
  }

  // check if the course is exist :
  const isCourseExist = await Course.findById(course);

  if (!isCourseExist) {
    throw new AppError('Course not found', StatusCodes.NOT_FOUND);
  }

  // check if the faculty is exist :
  const isFacultyExist = await Faculty.findById(faculty);

  if (!isFacultyExist) {
    throw new AppError('Faculty not found', StatusCodes.NOT_FOUND);
  }

  const result = await OfferedCourse.create({
    ...payload,
    academicSemester,
  });
  return result;
};

export const OfferedCourseService = {
  createOfferedCourseIntoDB,
};
