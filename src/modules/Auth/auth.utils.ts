import jwt, { JwtPayload } from 'jsonwebtoken';

// create token for access and refresh token :
export const createToken = (
  JwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(JwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
