import { TStudent } from './students.interface';
import { Student } from './students.schema';



const getAllStudentsFromDB = async () => {
  try {
    const result = await Student.find();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudentFromDB = async (id: string) => {
  try {
    const result = await Student.findOne({ id });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteStudentFromDB = async (id: string) => {
  try {
    // in schema we set default value of isDeleted to false so we update it to true to delete the student data :
    // other way isDeleted is true then we donot show that data in find query
    const result = await Student.updateOne({ id }, { isDeleted: true });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const StudentService = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
