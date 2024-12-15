import jwt from 'jsonwebtoken';

// create token for access and refresh token :
export const createToken = (
  JwtPayload: { userId: string; role: string },
  expiresIn: string,
  secret: string,
) => {
  return jwt.sign(JwtPayload, secret, {
    expiresIn,
  });
};
