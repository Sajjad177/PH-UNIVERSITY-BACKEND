import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { facultyServices } from './faculty.services';

// we are crating create faculty in user controller and we are not creating create faculty in faculty controller. We handle student, admin, faculty in user controller.
const getAllFaculties = catchAsync(async (req, res) => {
  const result = await facultyServices.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ' Get all Faculties successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.getSingleFacultyFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ' Get single Faculty successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const {  id } = req.params;
  const { faculty: facultyData } = req.body;
  const result = await facultyServices.updateFacultyIntoDB(
    id,
    facultyData,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: ' Update Faculty successfully',
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.deleteFacultyFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Delete Faculty successfully',
    data: result,
  });
});

export const facultyController = {
  
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
