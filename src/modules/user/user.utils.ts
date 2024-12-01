import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

// generate student id [year + semester code + 4 digit number ]
export const generateStudentId = (payload: TAcademicSemester) => {
  // first time student id :
  const currentId = (0).toString();

  // increment id :
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};
