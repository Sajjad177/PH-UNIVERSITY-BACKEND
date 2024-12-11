import { StatusCodes } from 'http-status-codes';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import AppError from '../../error/AppError';
import QueryBuilder from '../builder/Querybuilder';
import { semesterRegistrationStatusTransition } from './semesterRegistration.constant';

const createSemesterRegistrationInDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload.academicSemester;

  // check there if there any register semester that is already UPCOMING | ONGOING
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: semesterRegistrationStatusTransition.UPCOMING },
        { status: semesterRegistrationStatusTransition.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      `There is already a semester registration that is ${isThereAnyUpcomingOrOngoingSemester.status}`,
      StatusCodes.BAD_REQUEST,
    );
  }

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

const updateSemesterRegistrationInDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the requested semester is exist :
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExist) {
    throw new AppError(
      'Semester Registration not found',
      StatusCodes.NOT_FOUND,
    );
  }

  // if there requested semester is ENDED then we can't update the semester registration
  const currentSemesterStatus = isSemesterRegistrationExist.status;
  const requestedSemesterStatus = payload?.status;

  if (currentSemesterStatus === semesterRegistrationStatusTransition.ENDED) {
    throw new AppError(
      ` This semester registration is already ${currentSemesterStatus}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // we can update the semester registration status from UPCOMING -> ONGOING -> ENDED
  if (
    currentSemesterStatus === semesterRegistrationStatusTransition.UPCOMING &&
    requestedSemesterStatus === semesterRegistrationStatusTransition.ENDED
  ) {
    throw new AppError(
      ` You can't change directly the semester registration status from ${currentSemesterStatus} to ${requestedSemesterStatus}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  if (
    currentSemesterStatus === semesterRegistrationStatusTransition.ONGOING &&
    requestedSemesterStatus === semesterRegistrationStatusTransition.UPCOMING
  ) {
    throw new AppError(
      ` You can't change directly the semester registration status from ${currentSemesterStatus} to ${requestedSemesterStatus}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const SemesterRegistrationService = {
  createSemesterRegistrationInDB,
  getAllSemesterRegistrationInDB,
  getSingleSemesterRegistrationInDB,
  updateSemesterRegistrationInDB,
};
