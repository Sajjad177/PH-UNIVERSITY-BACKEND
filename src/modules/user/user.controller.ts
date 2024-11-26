import { Request, Response } from 'express';
import studentValidationZodSchema from '../students/students.zod.validation';
import { UserService } from './user.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student: studentData } = req.body;

    //TODO : data validation using zod :
    // const parsedData = studentValidationZodSchema.parse(studentData);

    //TODO : data validation using joi :
    // const { error, value } = studentValidationSchema.validate(studentData);

    // const result = await StudentService.createStudentToDB(value);

    // if (!result || ('success' in result && result.success === false)) {
    //   return res.status(400).json(result);
    // }

    // will call service function to create student :
    // const result = await StudentService.createStudentToDB(studentData);

    // pase the data zod :
    const result = await UserService.createStudentToDB(password, studentData);

    // if (error) {
    //   return res.status(400).json({
    //     success: false,
    //     message: error ? error.message : 'Validation error',
    //     error: error,
    //   });
    // }

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
      error: error,
    });
  }
};

export const UserController = {
  createStudent,
};
