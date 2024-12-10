import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import QueryBuilder from '../builder/Querybuilder';
import { courseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import mongoose from 'mongoose';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, any>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  // preRequisiteCourses separate for other data
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  // when 1 to many write opration then use transaction :

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // step-1 : basic course info updated : transaction-1
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(
        'Failed to update basic course info',
        StatusCodes.BAD_REQUEST,
      );
    }

    // step-2 : update preRequisiteCourses beacuse user can update preRequisiteCourses 1 to many :

    // checking there is any preRequisiteCourses to update :
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields : isDeleted = true
      //! DELETING PRE REQUISITE COURSES ----------  :
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course); // get only courseId

      // remove courseId from preRequisiteCourses array : transaction-2
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          // $pull : remove the courseId from preRequisiteCourses array :
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(
          'Failed to delete preRequisiteCourses',
          StatusCodes.BAD_REQUEST,
        );
      }

      //! ADDING NEW PRE REQUISITE COURSES ----------  :
      // filter out the added fields : isDeleted = false
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      console.log(newPreRequisites);

      // add new preRequisites : transaction-3
      const addNewPreRequisitesCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!addNewPreRequisitesCourse) {
        throw new AppError(
          'Failed to add new preRequisiteCourses',
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();

    // populate preRequisiteCourses :
    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const CourseService = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
};
