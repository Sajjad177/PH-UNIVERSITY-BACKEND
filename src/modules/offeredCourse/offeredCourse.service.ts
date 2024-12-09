import { StatusCodes } from 'http-status-codes';
import { SemesterRegistration } from './../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import AppError from '../../error/AppError';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
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

  // checking in academicDepartment academicFaculty is same with academicFaculty that we provide in payload :
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty: academicFaculty,
    _id: academicDepartment,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      `Academic Department ${isAcademicDepartmentExist.name} does not belong to the provided academic faculty ${isAcademicFacultyExist.name}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // check if the same offeredCourse same section in same semester is already exist :
  const isOfferedCourseExistInSameSemester = await OfferedCourse.findOne({
    course,
    section,
    semesterRegistration,
  });

  if (isOfferedCourseExistInSameSemester) {
    throw new AppError(
      `Offered Course with same section with same course already exist`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // get the schedule:
  const assignedSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days }, // checking if the days is in the days array
  }).select('days startTime endTime');

  // checking if the schedule is already exist :
  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  // checking if the schedule is already exist :
  if (hasTimeConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      `Faculty is not available at this time choose another time or day`,
      StatusCodes.BAD_REQUEST,
    );
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
