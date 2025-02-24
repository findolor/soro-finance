import { type Request, type Response, type NextFunction } from 'express';
import { tokenService } from '../../services/token.service';
import { prisma } from '../../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = tokenService.verifyAccessToken(token);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = { id: user.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Find user with this refresh token
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
        refreshTokenExpiresAt: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Attach user to request for the next middleware
    (req as AuthRequest).user = { id: user.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}; 