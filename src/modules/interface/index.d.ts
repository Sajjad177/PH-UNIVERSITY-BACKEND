import { JwtPayload } from 'jsonwebtoken';

// adding user to request object :
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

// adding user to request object