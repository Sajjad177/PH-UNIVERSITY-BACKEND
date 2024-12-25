import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../students/students.schema';
import mongoose from 'mongoose';

const createEnrollCourseInDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /*
    step-1. check the offered course is exist or not
    step-2. checking maxcapacity in offered course
    step-3.  get the student id from Student collection
    step-4. check if the student is already enrolled in the course
    step-5. create a new enrolled course
    */
  const { offeredCourse } = payload;
  //TODO : stap-1 ->
  const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExist) {
    throw new AppError('Offered course not found', StatusCodes.NOT_FOUND);
  }

  //TODO : step-2 -> if max capacity is 0 then course is full
  if (isOfferedCourseExist?.maxCapacity <= 0) {
    throw new AppError('Course capacity is full', StatusCodes.CONFLICT);
  }

  // TODO : step-3 ->
  const student = await Student.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new AppError('Student not found', StatusCodes.NOT_FOUND);
  }

  //TODO : step-4 ->
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExist?.semesterRegistration,
    offeredCourse,
    student: student?._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      'Student already enrolled in this course',
      StatusCodes.CONFLICT,
    );
  }
  // transection using ---------------
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // TODO : step-5 ->
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExist.semesterRegistration,
          academicSemester: isOfferedCourseExist.academicSemester,
          academicFaculty: isOfferedCourseExist.academicFaculty,
          academicDepartment: isOfferedCourseExist.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExist.course,
          student: student._id,
          faculty: isOfferedCourseExist.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        'Failed to enroll this course',
        StatusCodes.BAD_REQUEST,
      );
    }
    // Minese in maxCapacity
    const maxCapacity = isOfferedCourseExist.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(error as string, StatusCodes.BAD_REQUEST);
  }
};

export const enrolledCourseSevice = {
  createEnrollCourseInDB,
};
