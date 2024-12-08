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

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await facultyServices.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ' Get all Faculties successfully',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await facultyServices.getSingleFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ' Get single Faculty successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const { faculty: facultyData } = req.body;
  const result = await facultyServices.updateFacultyIntoDB(
    facultyId,
    facultyData,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ' Update Faculty successfully',
    data: result,
  });
});

export const facultyController = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
};
