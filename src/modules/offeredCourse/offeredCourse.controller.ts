import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseService } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const { ...offeredCourseData } = req.body;
  const result =
    await OfferedCourseService.createOfferedCourseIntoDB(offeredCourseData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Course created successfully',
    data: result,
  });
});



const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { ...offeredCourseData } = req.body;
  const result = await OfferedCourseService.updateOfferedCourseIntoDB(
    id,
    offeredCourseData,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Offered Course updated successfully',
    data: result,
  });
});



const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseService.getSingleOfferedCourseFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Offered Course get successfully',
    data: result,
  });
});





export const OfferedCourseController = {
  createOfferedCourse,
  updateOfferedCourse,
  getSingleOfferedCourse,
};
