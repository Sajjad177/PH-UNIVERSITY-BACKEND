import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

// find last student id :
const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

// generate student id [year + semester code + 4 digit number ]
export const generateStudentId = async (payload: TAcademicSemester) => {
  // By default id : 0000
  let currentId = (0).toString();

  // check last student id :
  const lastStudentId = await findLastStudentId();
  // 2030010001 = 2030 [01] code need to check
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  // 2030010001 = [2030] 01 year need to check
  const lastStudentYear = lastStudentId?.substring(0, 4);

  const currentSemesterCode = payload.code.toString();
  const currentYear = payload.year.toString();

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    // increment id :
    currentId = lastStudentId.substring(6); // 0001
  }

  // increment id :
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

// TODO : ----------- For Faculty --------------------->

export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

// generate faculty id :
export const generateFacultyId = async () => {
  let currentId = (0).toString();

  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId;
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `F-${incrementId}`;

  return incrementId;
};

// TODO : ----------- For admin --------------------->
// find last admin id :
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

// generate admin id :
export const generateAdminId = async () => {
  // By default id : 0000
  let currentId = (0).toString();

  // check last admin id :
  const lastAdminId = await findLastAdminId();

  // check last admin id :
  if (lastAdminId) {
    currentId = lastAdminId;
  }

  // increment id :
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  // A-0001 is the last admin id :
  incrementId = `A-${incrementId}`;

  return incrementId;
};
