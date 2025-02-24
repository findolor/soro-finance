import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../config/database';
import { tokenService } from '../../services/token.service';
import { AppError } from '../middlewares/error.middleware';
import { type AuthRequest } from '../middlewares/auth.middleware';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      throw new AppError('Public key is required', 400);
    }

    // Find or create user by public key
    const user = await prisma.user.upsert({
      where: { publicKey },
      update: {
        lastLoginAt: new Date()
      },
      create: {
        publicKey,
        role: 'USER'
      }
    });

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken();
    const refreshTokenExpiresAt = tokenService.getRefreshTokenExpiration();

    // Update user with refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        refreshTokenExpiresAt
      }
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        publicKey: user.publicKey,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      throw new AppError('Not authenticated', 401);
    }

    // Clear refresh token
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        refreshToken: null,
        refreshTokenExpiresAt: null
      }
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}; 