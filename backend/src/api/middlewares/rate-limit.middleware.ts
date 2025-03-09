import rateLimit from "express-rate-limit";

// Strict rate limiter for sensitive endpoints like nonce
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    error: "Too many requests from this IP, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Standard rate limiter for other authenticated endpoints
export const standardRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    error: "Too many requests from this IP, please try again after a minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
