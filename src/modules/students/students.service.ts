import { TStudent } from './students.interface';
import { Student } from './students.schema';

const createStudentToDB = async (student: TStudent) => {
  try {
    //TODO : create a custom static method check if student already exists----------:
    if (await Student.isUserExists(student.id)) {
      return {
        success: false,
        message: 'Student already exists',
      };
    }

    // create a student :
    const result = await Student.create(student); // build in static method

    //TODO1 : create with instance method ------------:
    // const student2 = new Student(student);

    // TODO2: create a custom instance method-----------:
    // if (await student2.isUserExists(student.id)) {
    //   return {
    //     success: false,
    //     message: 'Student already exists',
    //   };
    // }

    // const result2 = await student2.save(); // build in instance method

    return result;
  } catch (error) {
    console.log(error);
  }
};

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
  createStudentToDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
