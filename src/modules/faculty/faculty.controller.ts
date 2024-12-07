import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { facultyServices } from './faculty.services';

const createFaculty = catchAsync(async (req, res) => {
  const { faculty: facultyData } = req.body;
  const result = await facultyServices.createFacultyIntoDB(facultyData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

export const facultyController = {
  createFaculty,
};
