import mongoose from 'mongoose';
import { Student } from './students.schema';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import { TStudent } from './students.interface';
import QueryBuilder from '../builder/Querybuilder';
import { studentSearchableFields } from './students.constant';

//* In academicDepartment refrence the academicFaculty so we need to populate the academic faculty with the academic department. so we need to use populate method two times.

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  //TODO : build query :
  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};

const getSingleStudentFromDB = async (studentId: string) => {
  const result = await Student.findById({ id: studentId })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // start transaction
    // in schema we set default value of isDeleted to false so we update it to true to delete the student data :
    // other way isDeleted is true then we donot show that data in find query

    // delete student : (transaction -1)
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError('Failed to delete student', StatusCodes.BAD_REQUEST);
    }

    // get user id from deletedStudent
    const userId = deletedStudent.user;

    // delete user : (transaction -2)
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError('Failed to delete user', StatusCodes.BAD_REQUEST);
    }
    // commit transaction : (transaction -3)
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    // abort transaction if any error occurs : (transaction -4)
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Failed to delete student', StatusCodes.BAD_REQUEST);
  }
};

const updateStudentIntoDB = async (
  studentId: string,
  payload: Partial<TStudent>,
) => {
  // there some data we want to update
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  /*  -------- Nono premitive data type update --------
    Data in database style is like this -> 
    guardian : {
      "key" : "value"
      fatherOccupation : 'teacher'
    }

    what we want to do it ->    
    guardian.fatherOccupation = 'teacher'
    name.firstName = 'John'
    name.middleName = 'Doe'
    name.lastName = 'Smith'

    we can update premitive data also like this -> 
    contactNo : '1234567890'
  */

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  // dynamically handling nested object :
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  // dynamically handling nested object :
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdateData[`guardian.${key}`] = value;
    }
  }

  // dynamically handling nested object :
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdateData[`localGuardian.${key}`] = value;
    }
  }

  // console.log(modifiedUpdateData);

  const result = await Student.findByIdAndUpdate(
    studentId,
    modifiedUpdateData,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const StudentService = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
