import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getSolUsdPrice } from "../services/price.service.js";

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

export async function getMarketplaceActivity(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const collection =
      typeof req.query.collection === "string" &&
      req.query.collection !== "All Collections"
        ? req.query.collection
        : undefined;

    const walletAddress =
      typeof req.query.walletAddress === "string"
        ? req.query.walletAddress.trim()
        : "";

    const requestedTypes =
      typeof req.query.types === "string"
        ? req.query.types.split(",").filter(Boolean)
        : [];

    const dateRange =
      typeof req.query.dateRange === "string"
        ? req.query.dateRange
        : "Last 7 days";

    const dateDays: Record<string, number> = {
      "Last 24 hours": 1,
      "Last 7 days": 7,
      "Last 30 days": 30,
      "Last 90 days": 90,
    };

    const dateFilter = dateDays[dateRange]
      ? {
          gte: new Date(Date.now() - dateDays[dateRange] * 24 * 60 * 60 * 1000),
        }
      : undefined;

    const typeMap: Record<string, string> = {
      Sale: "SALE",
      Listing: "LISTED",
      Delisting: "DELISTED",
      Mint: "MINTED",
    };

    const selectedTypes = requestedTypes.length
      ? requestedTypes.map((type) => typeMap[type]).filter(Boolean)
      : Object.values(typeMap);

    const activityTypes = selectedTypes.filter((type) => type !== "SALE");

    const includeSales = selectedTypes.includes("SALE");

    const activityWhere: any = {
      type: { in: activityTypes },
      ...(dateFilter ? { createdAt: dateFilter } : {}),
      ...(collection ? { nft: { collection: { name: collection } } } : {}),
      ...(walletAddress
        ? {
            user: {
              wallet: {
                contains: walletAddress,
                mode: "insensitive",
              },
            },
          }
        : {}),
    };

    const saleWhere: any = {
      ...(dateFilter ? { createdAt: dateFilter } : {}),
      ...(collection ? { nft: { collection: { name: collection } } } : {}),
      ...(walletAddress
        ? {
            OR: [
              {
                buyer: {
                  wallet: {
                    contains: walletAddress,
                    mode: "insensitive",
                  },
                },
              },
              {
                seller: {
                  wallet: {
                    contains: walletAddress,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [activities, sales, collections] = await Promise.all([
      activityTypes.length
        ? prisma.activity.findMany({
            where: activityWhere,
            include: {
              nft: {
                include: {
                  collection: true,
                },
              },
              user: true,
            },
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),

      includeSales
        ? prisma.sale.findMany({
            where: saleWhere,
            include: {
              nft: {
                include: {
                  collection: true,
                },
              },
              buyer: true,
              seller: true,
            },
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),

      prisma.collection.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    const shortWallet = (wallet: string) =>
      `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;

    const activityEvents = activities
      .filter((activity) => {
        // Sale records are canonical. Avoid duplicate SALE activity rows.
        return activity.type !== "SALE";
      })
      .map((activity) => {
        const collection = activity.nft.collection;

        const eventType =
          activity.type === "MINTED"
            ? "Mint"
            : activity.type === "LISTED"
              ? "Listing"
              : "Delisting";

        return {
          id: activity.id,
          type: eventType,
          nft: {
            id: activity.nft.id,
            name: activity.nft.name,
            itemNumber: activity.nft.mintAddress
              ? `Item #${activity.nft.mintAddress.slice(0, 6)}`
              : `Item #${activity.nft.id.slice(0, 6)}`,
            image: activity.nft.image,
          },
          collection: {
            name: collection?.name ?? "Uncategorized",
            image: collection?.image ?? activity.nft.image,
            verified: collection?.verified ?? false,
          },
          from: activity.user
            ? {
                address: shortWallet(activity.user.wallet),
                label:
                  eventType === "Mint"
                    ? "Creator"
                    : eventType === "Listing"
                      ? "Seller"
                      : "Owner",
              }
            : undefined,
          price:
            activity.price !== null
              ? { sol: Number(activity.price) }
              : undefined,
          status:
            eventType === "Mint"
              ? "Minted"
              : eventType === "Listing"
                ? "Active"
                : "Delisted",
          time: activity.createdAt.toISOString(),
          transactionSignature: activity.transactionSignature,
          createdAt: activity.createdAt.toISOString(),
        };
      });

    const saleEvents = sales.map((sale) => {
      const collection = sale.nft.collection;

      return {
        id: sale.id,
        type: "Sale",
        nft: {
          id: sale.nft.id,
          name: sale.nft.name,
          itemNumber: sale.nft.mintAddress
            ? `Item #${sale.nft.mintAddress.slice(0, 6)}`
            : `Item #${sale.nft.id.slice(0, 6)}`,
          image: sale.nft.image,
        },
        collection: {
          name: collection?.name ?? "Uncategorized",
          image: collection?.image ?? sale.nft.image,
          verified: collection?.verified ?? false,
        },
        from: {
          address: shortWallet(sale.buyer.wallet),
          label: "Buyer",
        },
        to: {
          address: shortWallet(sale.seller.wallet),
          label: "Seller",
        },
        price: {
          sol: Number(sale.price),
        },
        status: "Completed",
        time: sale.createdAt.toISOString(),
        transactionSignature: sale.transactionSignature,
        createdAt: sale.createdAt.toISOString(),
      };
    });

    const allEvents = [...activityEvents, ...saleEvents].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = allEvents.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedEvents = allEvents.slice((page - 1) * limit, page * limit);

    const summary = {
      Sale: {
        count: saleEvents.length,
        volume: saleEvents.reduce(
          (total, event) => total + (event.price?.sol ?? 0),
          0,
        ),
      },
      Listing: {
        count: activityEvents.filter((event) => event.type === "Listing")
          .length,
        volume: 0,
      },
      Delisting: {
        count: activityEvents.filter((event) => event.type === "Delisting")
          .length,
        volume: 0,
      },
      Mint: {
        count: activityEvents.filter((event) => event.type === "Mint").length,
        volume: 0,
      },
    };

    res.status(200).json({
      success: true,
      data: {
        activities: paginatedEvents,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        summary,
        collections,
      },
    });
  } catch (error) {
    console.error("Get marketplace activity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch marketplace activity",
    });
  }
}

export async function getRecentCollectionVolume(_req: Request, res: Response) {
  try {
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    const currentPeriodStart = new Date(now.getTime() - thirtyDays);
    const previousPeriodStart = new Date(now.getTime() - thirtyDays * 2);

    // Fetch SOL sales from the current and previous 30-day periods.
    const sales = await prisma.sale.findMany({
      where: {
        currency: "SOL",
        createdAt: {
          gte: previousPeriodStart,
        },
      },
      include: {
        nft: {
          include: {
            collection: true,
          },
        },
      },
    });

    type CollectionVolume = {
      id: string;
      name: string;
      image: string | null;
      verified: boolean;
      volume: number;
      salesCount: number;
      previousVolume: number;
    };

    const grouped = new Map<string, CollectionVolume>();

    for (const sale of sales) {
      const collection = sale.nft.collection;
      const id = collection?.id ?? "uncategorized";

      if (!grouped.has(id)) {
        grouped.set(id, {
          id,
          name: collection?.name ?? "Uncategorized",
          image: collection?.image ?? sale.nft.image,
          verified: collection?.verified ?? false,
          volume: 0,
          salesCount: 0,
          previousVolume: 0,
        });
      }

      const entry = grouped.get(id)!;
      const price = Number(sale.price);

      if (sale.createdAt >= currentPeriodStart) {
        entry.volume += price;
        entry.salesCount += 1;
      } else {
        entry.previousVolume += price;
      }
    }

    const data = Array.from(grouped.values())
      .filter((collection) => collection.salesCount > 0)
      .map((collection) => ({
        id: collection.id,
        name: collection.name,
        image: collection.image,
        verified: collection.verified,
        volume: collection.volume,
        salesCount: collection.salesCount,
        changePercent:
          collection.previousVolume > 0
            ? ((collection.volume - collection.previousVolume) /
                collection.previousVolume) *
              100
            : null,
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get recent collection volume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent collection volume",
    });
  }
}

export async function getSolPrice(_req: Request, res: Response) {
  try {
    const price = await getSolUsdPrice();

    res.status(200).json({
      success: true,
      data: price,
    });
  } catch (error) {
    console.error("Get SOL price error:", error);

    res.status(502).json({
      success: false,
      message: "Failed to fetch SOL/USD price",
    });
  }
}
