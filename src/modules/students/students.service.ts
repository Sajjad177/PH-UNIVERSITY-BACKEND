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

export const StudentService = {
  createStudentToDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
};
