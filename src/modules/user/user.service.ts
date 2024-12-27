import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../error/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/students.interface';
import { Student } from '../students/students.schema';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentToDB = async (
  password: string,
  payload: TStudent,
  file: any,
) => {
  // create user object and save it in user collection :
  const userData: Partial<TUser> = {};
  // password  is given by user or not :
  userData.password = password || (config.default_password as string);

  // role and email :
  userData.role = 'student';
  userData.email = payload.email;

  // find academic semester info :
  const academicSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!academicSemester) {
    throw new AppError('Academic semester not found', StatusCodes.NOT_FOUND);
  }

  // find academicDepartment :
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError('Academic Department not found', StatusCodes.NOT_FOUND);
  }

  // add academic faculty :
  payload.academicFaculty = academicDepartment?.academicFaculty;

  // created isolated environment :
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // set generated id :
    userData.id = await generateStudentId(academicSemester);

    //TODO: <- --------- send image to cloudinary --------- ->

    if (file) {
      // add custom image name :
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);

      // set in data ->
      payload.profileImage = secure_url as string;
    }

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
    throw new AppError(error as string, StatusCodes.BAD_REQUEST);
  }
};

const createFacultyToDB = async (
  password: string,
  payload: TFaculty,
  file: any,
) => {
  // create user object and aslo save it in user collection :
  const userData: Partial<TUser> = {};

  // check password is given or not :
  userData.password = password || (config.default_password as string);

  // set role and email :
  userData.role = 'faculty';
  userData.email = payload.email;

  // find academic department info :
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError('Academic department not found', StatusCodes.NOT_FOUND);
  }

  payload.academicFaculty = academicDepartment?.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // set generated id :
    userData.id = await generateFacultyId();

    //TODO: <- --------- send image to cloudinary --------- ->
    if (file) {
      // add custom image name :
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);

      payload.profileImg = secure_url as string;
    }

    // create a user : (transaction -1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError('Failed to create user', StatusCodes.BAD_REQUEST);
    }

    // set id and user id :
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference id

    // create a faculty : (transaction -2)
    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError('Failed to create faculty', StatusCodes.BAD_REQUEST);
    }

    // commit transaction if everything is good :
    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(error as string, StatusCodes.BAD_REQUEST);
  }
};

const createAdminIntoDB = async (
  password: string,
  payload: TAdmin,
  file: any,
) => {
  // create user object and also save it in user collection :
  const userData: Partial<TUser> = {};

  // check password is given or not :
  userData.password = password || (config.default_password as string);

  // set role and email :
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // set generated id :
    userData.id = await generateAdminId();

    //TODO: <- --------- send image to cloudinary --------- ->

    if (file) {
      // add custom image name :
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);

      payload.profileImg = secure_url as string;
    }

    // create a user : (transaction -1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError('Failed to create user', StatusCodes.BAD_REQUEST);
    }

    // set id and user id :
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference id

    // create a admin : (transaction -2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError('Failed to create admin', StatusCodes.BAD_REQUEST);
    }

    // commit transaction if everything is good :
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(error as string, StatusCodes.BAD_REQUEST);
  }
};

const getMeFromDB = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatusInDB = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserService = {
  createStudentToDB,
  createFacultyToDB,
  createAdminIntoDB,
  getMeFromDB,
  changeStatusInDB,
};
