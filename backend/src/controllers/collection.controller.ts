// import type { Request, Response } from "express";
// import { prisma } from "../lib/prisma.js";

// export async function getCollections(_req: Request, res: Response) {
//   try {
//     const collections = await prisma.collection.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       select: {
//         id: true,
//         name: true,
//         slug: true,
//         image: true,
//         banner: true,
//         verified: true,
//         createdAt: true,

//         creator: {
//           select: {
//             username: true,
//             wallet: true,
//             avatar: true,
//           },
//         },

//         _count: {
//           select: {
//             nfts: true,
//             listings: true,
//           },
//         },

//         nfts: {
//           select: {
//             listings: {
//               where: {
//                 status: "ACTIVE",
//               },
//               select: {
//                 price: true,
//               },
//             },
//             sales: {
//               select: {
//                 price: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     const data = collections.map((collection) => {
//       const activeListings = collection.nfts.flatMap((nft) => nft.listings);

//       const sales = collection.nfts.flatMap((nft) => nft.sales);

//       const floorPrice =
//         activeListings.length > 0
//           ? Math.min(...activeListings.map((listing) => Number(listing.price)))
//           : 0;

//       const totalVolume = sales.reduce(
//         (total, sale) => total + Number(sale.price),
//         0,
//       );

//       const isNew =
//         Date.now() - collection.createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;

//       const creator =
//         collection.creator.username ??
//         `${collection.creator.wallet.slice(0, 4)}...${collection.creator.wallet.slice(-4)}`;

//       return {
//         id: collection.id,
//         name: collection.name,
//         slug: collection.slug,
//         creator,
//         creatorAvatar: collection.creator.avatar,
//         banner: collection.banner ?? collection.image,
//         items: collection._count.nfts,
//         floorPrice,
//         volume: totalVolume,
//         verified: collection.verified,
//         isNew,
//         activeTrading: activeListings.length > 0,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.error("Get collections error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch collections",
//     });
//   }
// }

import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getCollections(_req: Request, res: Response) {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        banner: true,
        verified: true,
        createdAt: true,

        creator: {
          select: {
            username: true,
            wallet: true,
            avatar: true,
          },
        },

        _count: {
          select: {
            nfts: true,
          },
        },

        nfts: {
          select: {
            listings: {
              where: {
                status: "ACTIVE",
              },
              select: {
                price: true,
              },
            },

            sales: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

    const data = collections.map((collection) => {
      const activeListings = collection.nfts.flatMap((nft) => nft.listings);

      const sales = collection.nfts.flatMap((nft) => nft.sales);

      const floorPrice =
        activeListings.length > 0
          ? Math.min(...activeListings.map((listing) => Number(listing.price)))
          : 0;

      const totalVolume = sales.reduce(
        (total, sale) => total + Number(sale.price),
        0,
      );

      const isNew =
        Date.now() - collection.createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;

      const creator =
        collection.creator.username ??
        `${collection.creator.wallet.slice(0, 4)}...${collection.creator.wallet.slice(-4)}`;

      return {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        creator,
        creatorAvatar: collection.creator.avatar,
        banner: collection.banner ?? collection.image,
        items: collection._count.nfts,
        floorPrice,
        volume: totalVolume,
        verified: collection.verified,
        isNew,
        activeTrading: activeListings.length > 0,
      };
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get collections error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
    });
  }
}

export async function getCollectionBySlug(req: Request, res: Response) {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!slug) {
      res.status(400).json({
        success: false,
        message: "Collection slug is required",
      });
      return;
    }
    const collection = await prisma.collection.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        banner: true,
        website: true,
        twitter: true,
        discord: true,
        verified: true,
        createdAt: true,

        creator: {
          select: {
            username: true,
            wallet: true,
            avatar: true,
          },
        },

        nfts: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            mintAddress: true,
            name: true,
            description: true,
            image: true,
            metadataUri: true,
            attributes: true,
            createdAt: true,

            owner: {
              select: {
                wallet: true,
              },
            },

            listings: {
              where: { status: "ACTIVE" },
              orderBy: { listedAt: "desc" },
              select: {
                id: true,
                price: true,
                currency: true,
                listedAt: true,
                seller: {
                  select: {
                    wallet: true,
                    username: true,
                  },
                },
              },
            },

            sales: {
              select: {
                price: true,
                currency: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!collection) {
      res.status(404).json({
        success: false,
        message: "Collection not found",
      });
      return;
    }

    const nfts = collection.nfts;

    const activeListings = nfts.flatMap((nft) => nft.listings);

    const floorListing = activeListings.reduce<
      (typeof activeListings)[number] | null
    >((lowest, listing) => {
      if (!lowest || Number(listing.price) < Number(lowest.price)) {
        return listing;
      }

      return lowest;
    }, null);

    const now = Date.now();
    const last24Hours = now - 24 * 60 * 60 * 1000;
    const previous24Hours = now - 48 * 60 * 60 * 1000;

    const sales = nfts.flatMap((nft) => nft.sales);

    const volume24h = sales
      .filter((sale) => sale.createdAt.getTime() >= last24Hours)
      .reduce((total, sale) => total + Number(sale.price), 0);

    const previousVolume24h = sales
      .filter(
        (sale) =>
          sale.createdAt.getTime() >= previous24Hours &&
          sale.createdAt.getTime() < last24Hours,
      )
      .reduce((total, sale) => total + Number(sale.price), 0);

    const volumeChange =
      previousVolume24h > 0
        ? ((volume24h - previousVolume24h) / previousVolume24h) * 100
        : null;

    const uniqueOwners = new Set(nfts.map((nft) => nft.owner.wallet));

    const creator =
      collection.creator.username ??
      `${collection.creator.wallet.slice(0, 4)}...${collection.creator.wallet.slice(-4)}`;

    const data = {
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.image,
      banner: collection.banner ?? collection.image,
      website: collection.website,
      twitter: collection.twitter,
      discord: collection.discord,
      verified: collection.verified,
      createdAt: collection.createdAt,

      creator,
      creatorWallet: collection.creator.wallet,
      creatorAvatar: collection.creator.avatar,

      stats: {
        items: nfts.length,
        owners: uniqueOwners.size,
        ownerPercentage:
          nfts.length > 0 ? (uniqueOwners.size / nfts.length) * 100 : 0,
        floorPrice: floorListing ? Number(floorListing.price) : null,
        floorCurrency: floorListing?.currency ?? "SOL",
        volume24h,
        volumeChange,
      },

      nfts: nfts.map((nft) => {
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

          ownerWallet: nft.owner.wallet,

          listing: activeListing
            ? {
                id: activeListing.id,
                price: Number(activeListing.price),
                currency: activeListing.currency,
                seller:
                  activeListing.seller.username ??
                  `${activeListing.seller.wallet.slice(0, 4)}...${activeListing.seller.wallet.slice(-4)}`,
                listedAt: activeListing.listedAt,
              }
            : null,
        };
      }),
    };

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get collection details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch collection details",
    });
  }
}
