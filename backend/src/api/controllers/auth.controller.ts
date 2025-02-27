import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../../config/database";
import { tokenService } from "../../services/token.service";
import { AppError } from "../middlewares/error.middleware";
import { type AuthRequest } from "../middlewares/auth.middleware";
import { Keypair } from "@stellar/stellar-sdk";

export const getNonce = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = req.query.address as string;
    if (!address) {
      throw new AppError("Address is required", 400);
    }

    // Check if address is valid
    Keypair.fromPublicKey(address);

    const buffer = Buffer.alloc(15);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    const nonce = buffer.toString("hex");

    const user = await prisma.user.findUnique({ where: { address } });

    if (user === null) {
      await prisma.user.create({ data: { address, nonce } });
    } else {
      await prisma.user.update({ where: { address }, data: { nonce } });
    }

    res.json({ nonce });
  } catch (error) {
    next(error);
  }
};

export const connect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = req.body.address as string;
    if (!address) {
      throw new AppError("Address is required", 400);
    }

    const signature = req.body.signature as string;
    if (!signature) {
      throw new AppError("Signature is required", 400);
    }

    const user = await prisma.user.findUnique({ where: { address } });
    if (user === null) {
      throw new AppError("User not found!", 404);
    }

    const isValid = Keypair.fromPublicKey(address).verify(
      Buffer.from(JSON.stringify({ nonce: user.nonce })),
      Buffer.from(signature, "base64")
    );
    if (!isValid) {
      throw new AppError("Invalid signature!", 400);
    }

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken();
    const refreshTokenExpiresAt = tokenService.getRefreshTokenExpiration();

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, refreshTokenExpiresAt },
    });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { address } = req.body;
//     if (!address) {
//       throw new AppError("Address is required", 400);
//     }

//     // Check if address is valid
//     Keypair.fromPublicKey(address);

//     // Find or create user by public key
//     const user = await prisma.user.upsert({
//       where: { address },
//       update: {
//         lastLoginAt: new Date(),
//       },
//       create: {
//         address,
//         role: "USER",
//       },
//     });

//     // Generate tokens
//     const accessToken = tokenService.generateAccessToken(user);
//     const refreshToken = tokenService.generateRefreshToken();
//     const refreshTokenExpiresAt = tokenService.getRefreshTokenExpiration();

//     // Update user with refresh token
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         refreshToken,
//         refreshTokenExpiresAt,
//       },
//     });

//     res.json({
//       accessToken,
//       refreshToken,
//       user: {
//         id: user.id,
//         publicKey: user.publicKey,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const logout = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if (!req.user?.id) {
//       throw new AppError("Not authenticated", 401);
//     }

//     // Clear refresh token
//     await prisma.user.update({
//       where: { id: req.user.id },
//       data: {
//         refreshToken: null,
//         refreshTokenExpiresAt: null,
//       },
//     });

//     res.json({ message: "Logged out successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
