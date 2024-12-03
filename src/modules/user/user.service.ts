import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../error/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/students.interface';
import { Student } from '../students/students.schema';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

const createStudentToDB = async (password: string, payload: TStudent) => {
  // create user object :
  const userData: Partial<TUser> = {};
  // password  is given by user or not :
  userData.password = password || (config.default_password as string);

  // role :
  userData.role = 'student';

  // find academic semester info :
  const academicSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!academicSemester) {
    throw new AppError('Academic semester not found', StatusCodes.NOT_FOUND);
  }

  // created isolated environment :
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // set generated id :
    userData.id = await generateStudentId(academicSemester);

    // create a user : (transaction -1)
    const newUser = await User.create([userData], { session });

    // check user is created or not :
    if (!newUser.length) {
      throw new AppError('Failed to create user', StatusCodes.BAD_REQUEST);
    }
    // set student id and user id :
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create a student : (transaction -2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError('Failed to create student', StatusCodes.BAD_REQUEST);
    }

    // commit transaction if everything is good :
    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    // rollback transaction if something went wrong :
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Failed to create student', StatusCodes.BAD_REQUEST);
  }
};

export const UserService = {
  createStudentToDB,
};
