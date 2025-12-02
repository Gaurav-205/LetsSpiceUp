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
    // We validate the format in config (matches /^\d+[smhd]$/), so it's safe
    // jsonwebtoken accepts string patterns like '7d', '1h', etc. which match StringValue type
    const expiresIn = config.jwt.expiresIn;
    // Use type assertion for the options object to work with exactOptionalPropertyTypes
    // This is safe because we validate the format in config/index.ts
    const options = {
      expiresIn: expiresIn,
    } as SignOptions;
    return jwt.sign(tokenPayload, config.jwt.secret, options);
  } catch (error) {
    throw new AppError('Failed to generate token', 500, true, 'TOKEN_GENERATION_ERROR');
  }
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    
    // Ensure required fields are present
    if (!decoded.userId || !decoded.email) {
      throw new AppError('Invalid token payload', 401, true, 'INVALID_TOKEN');
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401, true, 'TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401, true, 'INVALID_TOKEN');
    }
    throw new AppError('Token verification failed', 401, true, 'TOKEN_VERIFICATION_ERROR');
  }
};

