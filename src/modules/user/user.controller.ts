import { RequestHandler } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student: studentData } = req.body;

    const result = await UserService.createStudentToDB(password, studentData);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserController = {
  createStudent,
};
