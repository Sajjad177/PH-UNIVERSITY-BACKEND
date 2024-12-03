import { Student } from './students.schema';

//* academic department rafer the academic faculty so we need to populate the academic faculty with the academic department. so we need to use populate method two times.

const getAllStudentsFromDB = async () => {
  try {
    const result = await Student.find()
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

const getSingleStudentFromDB = async (id: string) => {
  try {
    const result = await Student.findOne({ id })
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
