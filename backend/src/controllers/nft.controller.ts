import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getNFTById(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "NFT id is required",
      });
      return;
    }

    const nft = await prisma.nFT.findFirst({
      where: {
        OR: [{ id }, { mintAddress: id }],
      },
      select: {
        id: true,
        mintAddress: true,
        name: true,
        description: true,
        image: true,
        metadataUri: true,
        attributes: true,
        createdAt: true,
        updatedAt: true,

        owner: {
          select: {
            id: true,
            wallet: true,
            username: true,
            avatar: true,
          },
        },

        creator: {
          select: {
            id: true,
            wallet: true,
            username: true,
            avatar: true,
          },
        },

        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            banner: true,
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
          select: {
            id: true,
            price: true,
            currency: true,
            status: true,
            listedAt: true,

            seller: {
              select: {
                wallet: true,
                username: true,
                avatar: true,
              },
            },
          },
        },

        sales: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            price: true,
            currency: true,
            createdAt: true,

            buyer: {
              select: {
                wallet: true,
                username: true,
                avatar: true,
              },
            },

            seller: {
              select: {
                wallet: true,
                username: true,
                avatar: true,
              },
            },
          },
        },

        activities: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            type: true,
            price: true,
            currency: true,
            transactionSignature: true,
            createdAt: true,

            user: {
              select: {
                wallet: true,
                username: true,
                avatar: true,
              },
            },
          },
        },

        offers: {
          where: {
            status: "PENDING",
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            expiresAt: true,
            createdAt: true,

            maker: {
              select: {
                wallet: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!nft) {
      res.status(404).json({
        success: false,
        message: "NFT not found",
      });
      return;
    }

    const activeListing = nft.listings[0] ?? null;

    const data = {
      id: nft.id,
      mintAddress: nft.mintAddress,
      name: nft.name,
      description: nft.description,
      image: nft.image,
      metadataUri: nft.metadataUri,
      attributes: nft.attributes,
      createdAt: nft.createdAt,
      updatedAt: nft.updatedAt,

      owner: nft.owner,
      creator: nft.creator,

      collection: nft.collection,

      listing: activeListing
        ? {
            id: activeListing.id,
            price: Number(activeListing.price),
            currency: activeListing.currency,
            status: activeListing.status,
            listedAt: activeListing.listedAt,
            seller: activeListing.seller,
          }
        : null,

      sales: nft.sales.map((sale) => ({
        id: sale.id,
        price: Number(sale.price),
        currency: sale.currency,
        createdAt: sale.createdAt,
        buyer: sale.buyer,
        seller: sale.seller,
      })),

      activities: nft.activities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        price: activity.price ? Number(activity.price) : null,
        currency: activity.currency,
        transactionSignature: activity.transactionSignature,
        createdAt: activity.createdAt,
        user: activity.user,
      })),

      offers: nft.offers.map((offer) => ({
        id: offer.id,
        amount: Number(offer.amount),
        currency: offer.currency,
        status: offer.status,
        expiresAt: offer.expiresAt,
        createdAt: offer.createdAt,
        maker: offer.maker,
      })),
    };

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get NFT details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch NFT details",
    });
  }
}

export async function createNFT(req: Request, res: Response) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { name, description, image, attributes } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "NFT name is required",
      });
      return;
    }

    if (typeof image !== "string" || !image.trim()) {
      res.status(400).json({
        success: false,
        message: "NFT artwork URL is required",
      });
      return;
    }

    let imageUrl: URL;

    try {
      imageUrl = new URL(image);
    } catch {
      res.status(400).json({
        success: false,
        message: "Invalid NFT artwork URL",
      });
      return;
    }

    if (imageUrl.protocol !== "https:") {
      res.status(400).json({
        success: false,
        message: "Artwork URL must use HTTPS",
      });
      return;
    }

    const nft = await prisma.nFT.create({
      data: {
        name: name.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        image: imageUrl.toString(),
        attributes:
          attributes === undefined
            ? Prisma.JsonNull
            : (attributes as Prisma.InputJsonValue),
        creatorId: userId,
        ownerId: userId,
      },
      select: {
        id: true,
        mintAddress: true,
        name: true,
        description: true,
        image: true,
        attributes: true,
        creatorId: true,
        ownerId: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "NFT saved successfully",
      nft,
    });
  } catch (error) {
    console.error("Create NFT error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create NFT",
    });
  }
}
