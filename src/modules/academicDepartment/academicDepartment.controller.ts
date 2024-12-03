import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentService } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const { ...academicDepartmentData } = req.body;
  const result = await AcademicDepartmentService.createAcademicDepartment(
    academicDepartmentData,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Academic department created successfully',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentService.getAllAcademicDepartments();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Get All Academic Departments successfully',
    data: result,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentService.getSingleAcademicDepartment(departmentId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Get Single Academic Department successfully',
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result = await AcademicDepartmentService.updateAcademicDepartment(
    departmentId,
    req.body,
  );
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Update Academic Department successfully',
    data: result,
  });
});

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
