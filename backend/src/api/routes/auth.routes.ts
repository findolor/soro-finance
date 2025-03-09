import { Router } from "express";
import { connect, getNonce } from "../controllers/auth.controller";
import { type RequestHandler } from "express";
import {
  strictRateLimiter,
  standardRateLimiter,
} from "../middlewares/rate-limit.middleware";

const router = Router();

// Public routes with rate limiting
router.get("/nonce", strictRateLimiter, getNonce as RequestHandler);
router.post("/connect", standardRateLimiter, connect as RequestHandler);

export default router;
