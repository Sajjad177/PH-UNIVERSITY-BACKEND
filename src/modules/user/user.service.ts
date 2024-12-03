import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../error/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/students.interface';
import { Student } from '../students/students.schema';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentToDB = async (password: string, payload: TStudent) => {
  try {
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

    // id :
    userData.id = await generateStudentId(academicSemester);

    // create a user :
    const newUser = await User.create(userData);

    // create a student :
    if (Object.keys(newUser).length) {
      payload.id = newUser.id;
      payload.user = newUser._id;

      const newStudent = await Student.create(payload);
      return newStudent;
    }
  } catch (error) {
    console.log(error);
  }
};

export const UserService = {
  createStudentToDB,
};
