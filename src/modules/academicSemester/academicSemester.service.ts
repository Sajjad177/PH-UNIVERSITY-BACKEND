import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { academicSemesterNameCode } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // checking semester code and name is valid or not:
  if (academicSemesterNameCode[payload.name] !== payload.code) {
    throw new AppError('Semester code is invalid', StatusCodes.BAD_REQUEST);
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleAcademicSemesterFromDB = async (semesterId: string) => {
  const result = await AcademicSemester.findById(semesterId);
  return result;
};

const updateAcademicSemesterIntoDB = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>,
) => {
  // checking semester code and name is valid or not:
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCode[payload.name] !== payload.code
  ) {
    throw new AppError('Semester code is invalid', StatusCodes.BAD_REQUEST);
  }
  const result = await AcademicSemester.findOneAndUpdate(
    { _id: semesterId },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const academicSemesterService = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
