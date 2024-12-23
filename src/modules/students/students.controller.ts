import { StudentService } from './students.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';

// catchAsync we use to handle async error. and handling try catch block.
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudentsFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Students fetched successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.getSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student get successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  // we delete student by generatedId :
  const { id } = req.params;
  const result = await StudentService.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentService.updateStudentIntoDB(id, student);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});



export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
