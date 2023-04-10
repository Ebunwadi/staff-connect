import { JwtToken } from './user.types';
import * as jwt from 'jsonwebtoken';

export const generateJWT = ({ isAdmin, email, id }: JwtToken) => {
  return jwt.sign(
    {
      email,
      id,
      isAdmin,
    },
    process.env.JSON_TOKEN_KEY,
    {
      expiresIn: '3d',
    },
  );
};
