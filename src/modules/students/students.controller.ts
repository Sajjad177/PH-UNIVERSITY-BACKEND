import { NextFunction, Request, Response } from 'express';
import { StudentService } from './students.service';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();

    res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await StudentService.getSingleStudentFromDB(id);

    res.status(200).json({
      success: true,
      message: 'Student get successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await StudentService.deleteStudentFromDB(id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error); 
  }
};

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
