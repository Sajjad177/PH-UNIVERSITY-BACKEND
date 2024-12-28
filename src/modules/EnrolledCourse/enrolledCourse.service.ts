import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../students/students.schema';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';

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

  // console.log('isOfferCourse -> ', isOfferedCourseExist);

  if (!isOfferedCourseExist) {
    throw new AppError('Offered course not found', StatusCodes.NOT_FOUND);
  }

  //TODO : step-2 -> if max capacity is 0 then course is full
  if (isOfferedCourseExist?.maxCapacity <= 0) {
    throw new AppError('Course capacity is full', StatusCodes.CONFLICT);
  }

  // TODO : step-3 ->
  const student = await Student.findOne({ id: userId }, { _id: 1 });

  // console.log('student -> ', student);

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

  const course = await Course.findById(isOfferedCourseExist.course);

  const currentCredit = course?.credits;

  // check total credits maxCredit in semesterRegistrations
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExist.semesterRegistration,
  ).select('maxCredit');

  if (!semesterRegistration) {
    throw new AppError(
      'Semester registration not found',
      StatusCodes.NOT_FOUND,
    );
  }

  const maxCredit = semesterRegistration?.maxCredit;

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExist?.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses', // database collection name
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEntolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEntolledCredits: 1,
      },
    },
  ]);

  // we check enrolled credits + new enrolled course credit > [bigger then] maxCredits then show error.
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0]?.totalEntolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      'You have exceeded maximum of credits',
      StatusCodes.BAD_REQUEST,
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

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      'Semester Registration not found',
      StatusCodes.NOT_FOUND,
    );
  }

  const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExist) {
    throw new AppError('Offered course not found', StatusCodes.NOT_FOUND);
  }

  const isStudentExist = await Student.findById(student);
  if (!isStudentExist) {
    throw new AppError('Student not found', StatusCodes.NOT_FOUND);
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new AppError('Faculty not found !', StatusCodes.NOT_FOUND);
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError('You are forbidden', StatusCodes.FORBIDDEN);
  }

  // Dynaimc update marks
  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  // if finalTerm then calculate grade points
  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);

    const result = calculateGradeAndPoints(totalMarks);
    
    // update in DB
    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const enrolledCourseSevice = {
  createEnrollCourseInDB,
  updateEnrolledCourseMarksIntoDB,
};
