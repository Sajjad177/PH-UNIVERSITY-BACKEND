import mongoose from 'mongoose';
import QueryBuilder from '../builder/Querybuilder';
import { FacultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate('user').populate('academicDepartment'),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (facultyId: string) => {
  const result = await Faculty.findById(facultyId);
  return result;
};

const updateFacultyIntoDB = async (
  facultyId: string,
  payload: Partial<TFaculty>,
) => {
  const { name, ...remainingData } = payload;

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingData,
  };

  // dynamically handling nested object :
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(
    facultyId,
    modifiedUpdateData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

const deleteFacultyFromDB = async (facultyId: string) => {
  console.log({ facultyId });
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedFaculty = await Faculty.findByIdAndUpdate(
      facultyId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedFaculty) {
      throw new AppError('Failed to delete faculty', StatusCodes.BAD_REQUEST);
    }

    const userId = deletedFaculty.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError('Failed to delete user', StatusCodes.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      'Failed to delete faculty and associated data',
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const facultyServices = {
  // createFacultyIntoDB,
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
