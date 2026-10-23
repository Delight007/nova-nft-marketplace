// import type { Request, Response } from "express";
// import { prisma } from "../lib/prisma.js";
// import { verifySessionToken } from "../services/session.service.js";

// export async function getCurrentUser(req: Request, res: Response) {
//   const token = req.cookies?.nova_session;

//   if (typeof token !== "string" || !token) {
//     res.status(401).json({
//       success: false,
//       message: "Not authenticated",
//     });
//     return;
//   }

//   try {
//     const session = verifySessionToken(token);

//     const user = await prisma.user.findUnique({
//       where: { id: session.userId },
//       select: {
//         id: true,
//         wallet: true,
//         username: true,
//         avatar: true,
//         createdAt: true,
//       },
//     });

//     if (!user || user.wallet !== session.wallet) {
//       res.status(401).json({
//         success: false,
//         message: "Session is no longer valid",
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       data: { user },
//     });
//   } catch {
//     res.status(401).json({
//       success: false,
//       message: "Session is invalid or expired",
//     });
//   }
// }

// export async function logout(req: Request, res: Response) {
//   res.clearCookie("nova_session", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//   });

//   res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// }

import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const auth = req.auth;

    if (!auth) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        wallet: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user || user.wallet !== auth.wallet) {
      res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("nova_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
