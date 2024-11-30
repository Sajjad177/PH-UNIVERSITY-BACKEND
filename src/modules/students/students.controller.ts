import { RequestHandler } from 'express';
import { StudentService } from './students.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const getAllStudents: RequestHandler = async (req, res, next) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Students fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleStudent: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await StudentService.getSingleStudentFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Student get successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await StudentService.deleteStudentFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
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
