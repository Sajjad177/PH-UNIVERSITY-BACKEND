import { StatusCodes } from 'http-status-codes';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import AppError from '../../error/AppError';
import QueryBuilder from '../builder/Querybuilder';

const createSemesterRegistrationInDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload.academicSemester;

  // Step 1: check if the semester registration is exist
  if (academicSemester) {
    const isAcademicSemesterExist =
      await AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExist) {
      throw new AppError('Academic Semester not found', StatusCodes.NOT_FOUND);
    }
  }

  // Step 2: check if the semester is already registration
  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExist) {
    throw new AppError(
      'Semester Registration already exist',
      StatusCodes.CONFLICT,
    );
  }

  // Step 3: create semester registration
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationInDB = async (
  payload: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    payload,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationInDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

export const SemesterRegistrationService = {
  createSemesterRegistrationInDB,
  getAllSemesterRegistrationInDB,
  getSingleSemesterRegistrationInDB,
};
