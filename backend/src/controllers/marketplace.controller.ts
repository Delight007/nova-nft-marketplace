import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getMarketplaceStats(_req: Request, res: Response) {
  try {
    const [totalCollections, totalNFTs, totalCreators] = await Promise.all([
      prisma.collection.count(),
      prisma.nFT.count(),
      prisma.user.count({
        where: {
          OR: [{ createdNFTs: { some: {} } }, { collections: { some: {} } }],
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCollections,
        totalNFTs,
        totalCreators,
      },
    });
  } catch (error) {
    console.error("Get marketplace stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch marketplace statistics",
    });
  }
}

export async function getFeaturedCollections(_req: Request, res: Response) {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        banner: true,
        verified: true,
        creator: {
          select: {
            username: true,
            wallet: true,
          },
        },
        _count: {
          select: {
            nfts: true,
          },
        },
      },
    });

    const data = collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      creator:
        collection.creator.username ??
        `${collection.creator.wallet.slice(0, 4)}...${collection.creator.wallet.slice(-4)}`,
      banner: collection.banner ?? collection.image,
      subtitle:
        collection.description ??
        `${collection._count.nfts.toLocaleString()} NFTs in this collection`,
      items: collection._count.nfts,
      verified: collection.verified,
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get featured collections error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch featured collections",
    });
  }
}
