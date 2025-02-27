import { Router } from "express";
import { connect, getNonce } from "../controllers/auth.controller";
import { type RequestHandler } from "express";

const router = Router();

// Public routes
router.get("/nonce", getNonce as RequestHandler);
router.post("/connect", connect as RequestHandler);

export default router;
