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
import QueryBuilder from '../builder/Querybuilder';
import { Student } from '../students/students.schema';

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

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  // checking if the offeredCourse is exist :
  const isOfferedCourseExist = await OfferedCourse.findById(id);

  if (!isOfferedCourseExist) {
    throw new AppError('Offered Course not found', StatusCodes.NOT_FOUND);
  }

  const isFacultyExist = await Faculty.findById(faculty);

  if (!isFacultyExist) {
    throw new AppError('Faculty not found', StatusCodes.NOT_FOUND);
  }

  const semesterRegistration = isOfferedCourseExist.semesterRegistration;

  // wen semesterRegistration is UPCOMING then we can update the offeredCourse :
  const isSemesterRegistrationUpcoming =
    await SemesterRegistration.findById(semesterRegistration);

  if (isSemesterRegistrationUpcoming?.status !== 'UPCOMING') {
    throw new AppError(
      `You can not update this offered course as ${isSemesterRegistrationUpcoming?.status} `,
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

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

//! Module 21-9 and 21-10------------------------------------------
const getMyOfferedCourseFromDB = async (userId: string) => {
  const student = await Student.findOne({ id: userId });
  if (!student) {
    throw new AppError('User is not found', StatusCodes.NOT_FOUND);
  }

  // find current ongoing semester :
  const currentOnGoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );

  if (!currentOnGoingRegistrationSemester) {
    throw new AppError(
      'There is no ongoing semester Registration',
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await OfferedCourse.aggregate([
    {
      $match: {
        semesterRegistration: currentOnGoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course', // remove array
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        // add value in aggration
        let: {
          currentOnGoingRegistrationSemester:
            currentOnGoingRegistrationSemester?._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  // 1st condition semesterRegistration match
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOnGoingRegistrationSemester',
                    ],
                  },
                  // 2nd condition student with current student match
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  // 3rd condition with isEnrolled= true
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    // checking with mongodb aggration if course is exist in enrolled course then we are remove this from offered Course.
    {
      $addFields: {
        // in compere in array
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              // aggration map :
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    //isAlreadyEnrolled: true removing. We are match only false value because false value is not enrolled. So those course offered me for enrolling.
    {
      $match: {
        isAlreadyEnrolled: false,
      },
    },
  ]);

  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  // stape 1 : check if the offeredCourse is exist :
  const isOfferedCourseExist = await OfferedCourse.findById(id);

  if (!isOfferedCourseExist) {
    throw new AppError('Offered Course not found', StatusCodes.NOT_FOUND);
  }

  const semesterRegistration = isOfferedCourseExist.semesterRegistration;

  // stape 2 : check if the semesterRegistration is UPCOMING :
  const isSemesterRegistrationUpcoming =
    await SemesterRegistration.findById(semesterRegistration).select('status');

  if (isSemesterRegistrationUpcoming?.status !== 'UPCOMING') {
    throw new AppError(
      `You can not delete this offered course as ${isSemesterRegistrationUpcoming?.status} `,
      StatusCodes.BAD_REQUEST,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};

export const OfferedCourseService = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getMyOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
};
