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
        banner: true,
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
        ...(input.banner !== undefined && {
          banner: input.banner,
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
        banner: true,
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

export async function getMyCollectedNFTs(req: Request, res: Response) {
  try {
    const auth = req.auth;

    if (!auth) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Confirm that the authenticated session still belongs to this user.
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { wallet: true },
    });

    if (!user || user.wallet !== auth.wallet) {
      res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
      return;
    }

    // Fetch NFTs currently owned by the authenticated user.
    const nfts = await prisma.nFT.findMany({
      where: {
        ownerId: auth.userId,
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            verified: true,
          },
        },
        listings: {
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            listedAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            price: true,
            currency: true,
            listedAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const collectedNFTs = nfts.map((nft) => {
      const activeListing = nft.listings[0];

      return {
        id: nft.id,
        mintAddress: nft.mintAddress,
        name: nft.name,
        description: nft.description,
        image: nft.image,
        metadataUri: nft.metadataUri,
        attributes: nft.attributes,
        createdAt: nft.createdAt,
        collection: nft.collection,
        listing: activeListing
          ? {
              id: activeListing.id,
              price: activeListing.price.toString(),
              currency: activeListing.currency,
              listedAt: activeListing.listedAt,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        nfts: collectedNFTs,
        total: collectedNFTs.length,
      },
    });
  } catch (error) {
    console.error("Get collected NFTs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch collected NFTs",
    });
  }
}

export async function getMyCreatedNFTs(req: Request, res: Response) {
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
      select: { wallet: true },
    });

    if (!user || user.wallet !== auth.wallet) {
      res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
      return;
    }

    const nfts = await prisma.nFT.findMany({
      where: {
        creatorId: auth.userId,
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            verified: true,
          },
        },
        listings: {
          where: { status: "ACTIVE" },
          orderBy: { listedAt: "desc" },
          take: 1,
          select: {
            id: true,
            price: true,
            currency: true,
            listedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const createdNFTs = nfts.map((nft) => {
      const activeListing = nft.listings[0];

      return {
        id: nft.id,
        mintAddress: nft.mintAddress,
        name: nft.name,
        description: nft.description,
        image: nft.image,
        metadataUri: nft.metadataUri,
        attributes: nft.attributes,
        createdAt: nft.createdAt,
        collection: nft.collection,
        listing: activeListing
          ? {
              id: activeListing.id,
              price: activeListing.price.toString(),
              currency: activeListing.currency,
              listedAt: activeListing.listedAt,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        nfts: createdNFTs,
        total: createdNFTs.length,
      },
    });
  } catch (error) {
    console.error("Get created NFTs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch created NFTs",
    });
  }
}

export async function getMyListedNFTs(req: Request, res: Response) {
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
      select: { wallet: true },
    });

    if (!user || user.wallet !== auth.wallet) {
      res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
      return;
    }

    const nfts = await prisma.nFT.findMany({
      where: {
        ownerId: auth.userId,
        listings: {
          some: {
            status: "ACTIVE",
          },
        },
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            verified: true,
          },
        },
        listings: {
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            listedAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            price: true,
            currency: true,
            listedAt: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const listedNFTs = nfts.map((nft) => {
      const activeListing = nft.listings[0];

      return {
        id: nft.id,
        mintAddress: nft.mintAddress,
        name: nft.name,
        description: nft.description,
        image: nft.image,
        metadataUri: nft.metadataUri,
        attributes: nft.attributes,
        createdAt: nft.createdAt,
        collection: nft.collection,
        listing: activeListing
          ? {
              id: activeListing.id,
              price: activeListing.price.toString(),
              currency: activeListing.currency,
              listedAt: activeListing.listedAt,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        nfts: listedNFTs,
        total: listedNFTs.length,
      },
    });
  } catch (error) {
    console.error("Get listed NFTs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch listed NFTs",
    });
  }
}

export async function getMyActivity(req: Request, res: Response) {
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
      select: { wallet: true },
    });

    if (!user || user.wallet !== auth.wallet) {
      res.status(401).json({
        success: false,
        message: "Session is no longer valid",
      });
      return;
    }

    const activities = await prisma.activity.findMany({
      where: {
        userId: auth.userId,
      },
      include: {
        nft: {
          select: {
            id: true,
            mintAddress: true,
            name: true,
            image: true,
            collection: {
              select: {
                id: true,
                name: true,
                slug: true,
                verified: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const formattedActivities = activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      price: activity.price?.toString() ?? null,
      currency: activity.currency,
      transactionSignature: activity.transactionSignature,
      createdAt: activity.createdAt,
      nft: activity.nft,
    }));

    res.status(200).json({
      success: true,
      data: {
        activities: formattedActivities,
        total: formattedActivities.length,
      },
    });
  } catch (error) {
    console.error("Get profile activity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile activity",
    });
  }
}
