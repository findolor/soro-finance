import { type User } from '@prisma/client';
import { randomBytes } from 'crypto';
import jwt, { type SignOptions, type JwtPayload } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
  id: string;
}

class TokenService {
  private readonly jwtSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    const accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY;
    const refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY;

    if (!jwtSecret || !accessTokenExpiry || !refreshTokenExpiry) {
      throw new Error('JWT configuration is missing');
    }

    this.jwtSecret = jwtSecret;
    this.accessTokenExpiry = accessTokenExpiry;
    this.refreshTokenExpiry = refreshTokenExpiry;
  }

  /**
   * Generate access token for a user
   */
  generateAccessToken(user: User): string {
    const payload = {
      id: user.id,
    };

    const options: SignOptions = {
      expiresIn: this.accessTokenExpiry as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(payload, this.jwtSecret, options);
  }

  /**
   * Generate refresh token using cryptographically secure random bytes
   * Returns a 256-bit (32 bytes) token encoded in base64url
   */
  generateRefreshToken(): string {
    // Generate 32 bytes (256 bits) of random data
    const buffer = randomBytes(32);
    // Convert to base64url format (URL-safe with no padding)
    return buffer.toString('base64url');
  }

  /**
   * Calculate refresh token expiration date
   */
  getRefreshTokenExpiration(): Date {
    return new Date(Date.now() + this.parseExpiry(this.refreshTokenExpiry) * 1000);
  }

  /**
   * Verify access token and return payload
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as TokenPayload;
      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Parse expiry string (e.g., "7d", "30d") to seconds
   */
  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([dhms])$/);
    if (!match) {
      throw new Error('Invalid expiry format');
    }

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 'd':
        return numValue * 24 * 60 * 60;
      case 'h':
        return numValue * 60 * 60;
      case 'm':
        return numValue * 60;
      case 's':
        return numValue;
      default:
        throw new Error('Invalid time unit');
    }
  }
}

// Export singleton instance
export const tokenService = new TokenService(); 