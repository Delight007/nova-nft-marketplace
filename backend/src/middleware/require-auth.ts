import type { NextFunction, Request, Response } from "express";
import {
  verifySessionToken,
  type SessionPayload,
} from "../services/session.service.js";
declare global {
  namespace Express {
    interface Request {
      auth?: SessionPayload;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.nova_session;

  if (typeof token !== "string" || !token) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  try {
    req.auth = verifySessionToken(token);
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Session is invalid or expired",
    });
  }
}
