import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getMyProfileStats(req: Request, res: Response) {
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

    const [ownedNFTs, createdNFTs, listedNFTs, volume, followers] =
      await Promise.all([
        prisma.nFT.count({
          where: { ownerId: auth.userId },
        }),

        prisma.nFT.count({
          where: { creatorId: auth.userId },
        }),

        prisma.listing.count({
          where: {
            sellerId: auth.userId,
            status: "ACTIVE",
          },
        }),

        prisma.sale.aggregate({
          where: {
            OR: [{ buyerId: auth.userId }, { sellerId: auth.userId }],
          },
          _sum: { price: true },
        }),

        prisma.follow.count({
          where: { followingId: auth.userId },
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          ownedNFTs,
          createdNFTs,
          listedNFTs,
          volumeTraded: volume._sum.price?.toString() ?? "0",
          followers,
        },
      },
    });
  } catch (error) {
    console.error("Get profile stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile statistics",
    });
  }
}

export async function getMyCreatorAnalytics(req: Request, res: Response) {
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

    // Include today and the previous 29 calendar days.
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - 29);

    const sales = await prisma.sale.findMany({
      where: {
        nft: {
          creatorId: auth.userId,
        },
        currency: "SOL",
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        price: true,
        buyerId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const volume = sales.reduce((total, sale) => total + Number(sale.price), 0);

    const uniqueBuyers = new Set(sales.map((sale) => sale.buyerId)).size;

    const dailyVolumes = new Map<string, number>();

    for (let day = 0; day < 30; day++) {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + day);

      const key = date.toISOString().slice(0, 10);
      dailyVolumes.set(key, 0);
    }

    for (const sale of sales) {
      const key = sale.createdAt.toISOString().slice(0, 10);

      dailyVolumes.set(key, (dailyVolumes.get(key) ?? 0) + Number(sale.price));
    }

    const chart = Array.from(dailyVolumes, ([date, dailyVolume]) => ({
      date,
      volume: Number(dailyVolume.toFixed(9)),
    }));

    res.status(200).json({
      success: true,
      data: {
        period: "30d",
        volume: Number(volume.toFixed(9)),
        currency: "SOL",
        sales: sales.length,
        uniqueBuyers,
        chart,
      },
    });
  } catch (error) {
    console.error("Get creator analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch creator analytics",
    });
  }
}

export async function getMyTopCollections(req: Request, res: Response) {
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

    const collections = await prisma.collection.findMany({
      where: { creatorId: auth.userId },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        verified: true,
        _count: {
          select: { nfts: true },
        },
        nfts: {
          select: {
            sales: {
              where: { currency: "SOL" },
              select: { price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    const data = collections
      .map((collection) => {
        const volume = collection.nfts.reduce(
          (total, nft) =>
            total +
            nft.sales.reduce(
              (nftTotal, sale) => nftTotal + Number(sale.price),
              0,
            ),
          0,
        );

        return {
          id: collection.id,
          name: collection.name,
          slug: collection.slug,
          image: collection.image,
          verified: collection.verified,
          itemCount: collection._count.nfts,
          volume: Number(volume.toFixed(9)),
        };
      })
      .sort((a, b) => b.itemCount - a.itemCount);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get top collections error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top collections",
    });
  }
}
