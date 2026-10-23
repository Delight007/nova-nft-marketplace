import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { updateProfileSchema } from "../validatiors/user.validator.js";

export async function getMyProfile(req: Request, res: Response) {
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
        bio: true,
        website: true,
        twitter: true,
        discord: true,
        createdAt: true,
        updatedAt: true,
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
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
}

export async function updateMyProfile(req: Request, res: Response) {
  try {
    const auth = req.auth;

    if (!auth) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const parsed = updateProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid profile data",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        wallet: true,
      },
    });

    if (!existingUser || existingUser.wallet !== auth.wallet) {
      res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
      return;
    }

    const input = parsed.data;

    const user = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        ...(input.username !== undefined && {
          username: input.username,
        }),
        ...(input.avatar !== undefined && {
          avatar: input.avatar,
        }),
        ...(input.bio !== undefined && {
          bio: input.bio,
        }),
        ...(input.website !== undefined && {
          website: input.website,
        }),
        ...(input.twitter !== undefined && {
          twitter: input.twitter,
        }),
        ...(input.discord !== undefined && {
          discord: input.discord,
        }),
      },
      select: {
        id: true,
        wallet: true,
        username: true,
        avatar: true,
        bio: true,
        website: true,
        twitter: true,
        discord: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "Username is already taken",
        field: "username",
      });
      return;
    }

    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}
