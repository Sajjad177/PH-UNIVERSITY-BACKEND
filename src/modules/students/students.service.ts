import mongoose from 'mongoose';
import { Student } from './students.schema';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import { TStudent } from './students.interface';

//* In academicDepartment refrence the academicFaculty so we need to populate the academic faculty with the academic department. so we need to use populate method two times.

const getAllStudentsFromDB = async (query: any) => {
  // copy from query :
  const queryObj = { ...query };

  // for search term :
  // {email : { $regex : query.searchTerm, $options : "i"}}
  // {presentAddress : { $regex : query.searchTerm, $options : "i"}}
  // {name.firstName : { $regex : query.searchTerm, $options : "i"}}

  // in this field cannot do hard code Because there is so many field so we use dynamic field.

  const studentSearchableFields = ['email', 'name.firstName', 'dateOfBirth'];

  let searchTerm = '';
  // dynamic search term :
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  // filter query condition :
  const excludeFields = ['searchTerm', 'sort', 'limit'];
  // deleting excludeFields items from copy queryObj :
  excludeFields.forEach((field) => delete queryObj[field]);

  // search query :
  const searchQuery = Student.find({
    $or: studentSearchableFields?.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filter query :
  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // for ascending 1 and descending -1
  // Ascending means smallest to largest, 0 to 9, and/or A to Z
  // Descending means largest to smallest, 9 to 0, and/or Z to A.

  // sorting :
  let sort = '-createdAt';

  if (query?.sort) {
    sort = query?.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  // limiting :
  let limit = 1;
  if (query?.limit) {
    limit = query?.limit 
  }

  const limitQuery = await sortQuery.limit(limit);

  return limitQuery;
};

const getSingleStudentFromDB = async (studentId: string) => {
  try {
    const result = await Student.findOne({ id: studentId })
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteStudentFromDB = async (generatedId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction(); // start transaction
    // in schema we set default value of isDeleted to false so we update it to true to delete the student data :
    // other way isDeleted is true then we donot show that data in find query

    // delete student : (transaction -1)
    const deletedStudent = await Student.findOneAndUpdate(
      { id: generatedId },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError('Failed to delete student', StatusCodes.BAD_REQUEST);
    }
    // delete user : (transaction -2)
    const deletedUser = await User.findOneAndUpdate(
      { id: generatedId },
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

  const result = await Student.findOneAndUpdate(
    { id: studentId },
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
