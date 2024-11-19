import { Request, Response } from 'express';
import { StudentService } from './students.service';
import studentValidationZodSchema from './students.zod.validation';
// import Joi from 'joi';
import studentValidationSchema from './students.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    //TODO : data validation using zod :
    // const parsedData = studentValidationZodSchema.parse(studentData);

    //TODO : data validation using joi :
    const { error, value } = studentValidationSchema.validate(studentData);

    const result = await StudentService.createStudentToDB(value);

    if (!result || 'success' in result && result.success === false) {
      return res.status(400).json(result);
    }


    // will call service function to create student :
    // const result = await StudentService.createStudentToDB(studentData);

    // pase the data zod :
    // const result = await StudentService.createStudentToDB(parsedData);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error ? error.message : 'Validation error',
        error: error,
      });
    }

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

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();

    res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
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

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await StudentService.getSingleStudentFromDB(id);

    res.status(200).json({
      success: true,
      message: 'Student get successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
