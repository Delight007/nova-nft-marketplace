import type { Request, Response } from "express";

export const healthCheck = (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Nova NFT Marketplace API is running",
    timestamp: new Date().toISOString(),
  });
};
