import { Request, Response } from 'express';
import { StudentService } from './students.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    // will call service function to create student :
    const result = await StudentService.createStudentToDB(studentData);

    // send response :
    res.status(200).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const StudentController = {
  createStudent,
};
