import { academicSemesterNameCode } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // checking semester code and name is valid or not:
  if (academicSemesterNameCode[payload.name] !== payload.code) {
    throw new Error('Semester code is invalid');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

export const academicSemesterService = {
  createAcademicSemesterIntoDB,
};
