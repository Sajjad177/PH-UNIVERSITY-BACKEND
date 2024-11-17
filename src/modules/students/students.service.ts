import { Student } from './students.interface';
import { StudentModel } from './students.schema';

const createStudentToDB = async (student: Student) => {
  try {
    // create a student :
    const result = await StudentModel.create(student);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getAllStudentsFromDB = async () => {
  try {
    const result = await StudentModel.find();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudentFromDB = async (id: string) => {
  try {
    const result = await StudentModel.findOne({ id });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const StudentService = {
  createStudentToDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
};
