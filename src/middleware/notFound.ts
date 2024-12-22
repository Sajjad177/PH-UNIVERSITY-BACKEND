import { NextFunction, Request, Response } from 'express'; 
import { StatusCodes } from 'http-status-codes';


// this is use for when we are not found the route then this middleware is used to send the response to the client :
const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    error: '',
  });

};


export default notFound;

