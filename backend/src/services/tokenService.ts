import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../types/errors';

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (payload: TokenPayload): string => {
  try {
    const tokenPayload: { userId: string; email: string } = { 
      userId: payload.userId, 
      email: payload.email 
    };
    // expiresIn can be a string like '7d' or a number in seconds
    // Type assertion needed because config.jwt.expiresIn is string, but jwt expects StringValue | number
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(tokenPayload, config.jwt.secret, options);
  } catch (error) {
    throw new AppError('Failed to generate token', 500, 'TOKEN_GENERATION_ERROR');
  }
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    
    // Ensure required fields are present
    if (!decoded.userId || !decoded.email) {
      throw new AppError('Invalid token payload', 401, 'INVALID_TOKEN');
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401, 'TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }
    throw new AppError('Token verification failed', 401, 'TOKEN_VERIFICATION_ERROR');
  }
};

