import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import { createHash } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import {
  verifyBuyNFTTransaction,
  verifyCancelListingTransaction,
  verifyListingTransaction,
} from "../services/listing.service.js";
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
            nfts: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { image: true },
            },
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
            transactionSignature: true,
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

      collection: nft.collection
        ? {
            id: nft.collection.id,
            name: nft.collection.name,
            slug: nft.collection.slug,
            image: nft.collection.image,
            banner: nft.collection.banner,
            previewImage: nft.collection.nfts[0]?.image ?? null,
            verified: nft.collection.verified,
          }
        : null,

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
        transactionSignature: sale.transactionSignature,
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

    const { name, description, image, collection, attributes } = req.body;

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

    if (
      collection !== undefined &&
      (typeof collection !== "string" ||
        !collection.trim() ||
        collection.trim().length > 50)
    ) {
      res.status(400).json({
        success: false,
        message: "Collection name must be between 1 and 50 characters",
      });
      return;
    }

    const collectionName =
      typeof collection === "string" ? collection.trim() : null;

    const nft = await prisma.$transaction(async (transaction) => {
      let collectionId: string | null = null;

      if (collectionName) {
        const existingCollection = await transaction.collection.findFirst({
          where: {
            creatorId: userId,
            name: {
              equals: collectionName,
              mode: "insensitive",
            },
          },
          select: { id: true },
        });

        if (existingCollection) {
          collectionId = existingCollection.id;
        } else {
          const slugBase =
            collectionName
              .toLowerCase()
              .normalize("NFKD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
              .slice(0, 60) || "collection";
          const slugSuffix = createHash("sha256")
            .update(`${userId}:${collectionName.toLowerCase()}`)
            .digest("hex")
            .slice(0, 12);
          const newCollection = await transaction.collection.create({
            data: {
              name: collectionName,
              slug: `${slugBase}-${slugSuffix}`,
              creatorId: userId,
            },
            select: { id: true },
          });
          collectionId = newCollection.id;
        }
      }

      return transaction.nFT.create({
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
          collectionId,
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

export async function updateNFTMint(req: Request, res: Response) {
  try {
    const userId = req.auth?.userId;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        success: false,
        message: "NFT id is required",
      });
      return;
    }

    const { mintAddress, metadataUri } = req.body;

    if (
      typeof mintAddress !== "string" ||
      !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mintAddress)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid Solana mint address",
      });
      return;
    }

    if (typeof metadataUri !== "string") {
      res.status(400).json({
        success: false,
        message: "Metadata URI is required",
      });
      return;
    }

    let parsedMetadataUri: URL;

    try {
      parsedMetadataUri = new URL(metadataUri);
    } catch {
      res.status(400).json({
        success: false,
        message: "Invalid metadata URI",
      });
      return;
    }

    if (parsedMetadataUri.protocol !== "https:") {
      res.status(400).json({
        success: false,
        message: "Metadata URI must use HTTPS",
      });
      return;
    }

    const existingNFT = await prisma.nFT.findFirst({
      where: {
        id,
        creatorId: userId,
      },
      select: {
        id: true,
        mintAddress: true,
      },
    });

    if (!existingNFT) {
      res.status(404).json({
        success: false,
        message: "NFT not found or you are not its creator",
      });
      return;
    }

    if (existingNFT.mintAddress) {
      res.status(409).json({
        success: false,
        message: "This NFT has already been minted",
      });
      return;
    }

    const updated = await prisma.$transaction(async (transaction) => {
      const updateResult = await transaction.nFT.updateMany({
        where: {
          id,
          creatorId: userId,
          mintAddress: null,
        },
        data: {
          mintAddress,
          metadataUri: parsedMetadataUri.toString(),
        },
      });

      if (updateResult.count === 0) {
        return false;
      }

      await transaction.activity.create({
        data: {
          type: "MINTED",
          nftId: id,
          userId,
        },
      });

      return true;
    });

    if (!updated) {
      res.status(409).json({
        success: false,
        message: "NFT was already minted or has changed",
      });
      return;
    }

    const nft = await prisma.nFT.findUnique({
      where: { id },
      select: {
        id: true,
        mintAddress: true,
        metadataUri: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "NFT mint details saved successfully",
      nft,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "This mint address is already associated with another NFT",
      });
      return;
    }

    console.error("Update NFT mint error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update NFT mint details",
    });
  }
}

export async function listNFT(req: Request, res: Response) {
  let verifiedListing: Awaited<
    ReturnType<typeof verifyListingTransaction>
  > | null = null;

  try {
    const userId = req.auth?.userId;
    const wallet = req.auth?.wallet;

    if (!userId || !wallet) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "NFT id is required",
      });
      return;
    }

    const { transactionSignature } = req.body ?? {};

    if (
      typeof transactionSignature !== "string" ||
      !transactionSignature.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Transaction signature is required",
      });
      return;
    }

    const nft = await prisma.nFT.findUnique({
      where: { id },
      select: {
        id: true,
        mintAddress: true,
        ownerId: true,
      },
    });

    if (!nft) {
      res.status(404).json({
        success: false,
        message: "NFT not found",
      });
      return;
    }

    if (nft.ownerId !== userId) {
      res.status(403).json({
        success: false,
        message: "You do not own this NFT",
      });
      return;
    }

    if (!nft.mintAddress) {
      res.status(400).json({
        success: false,
        message: "NFT has not been minted yet",
      });
      return;
    }

    const verifiedListing = await verifyListingTransaction({
      transactionSignature: transactionSignature.trim(),
      sellerWallet: wallet,
      mintAddress: nft.mintAddress,
    });

    // Check whether this exact transaction has already been saved.
    // This makes retrying the same request safe.
    const existingTransaction = await prisma.listing.findUnique({
      where: {
        transactionSignature: verifiedListing.transactionSignature,
      },
    });

    if (existingTransaction) {
      if (
        existingTransaction.nftId !== nft.id ||
        existingTransaction.sellerId !== userId
      ) {
        res.status(409).json({
          success: false,
          message:
            "This transaction has already been recorded for another listing",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Listing transaction already recorded",
        data: {
          id: existingTransaction.id,
          nftId: existingTransaction.nftId,
          price: Number(existingTransaction.price),
          currency: existingTransaction.currency,
          status: existingTransaction.status,
          transactionSignature: existingTransaction.transactionSignature,
          listedAt: existingTransaction.listedAt,
          listingAddress: verifiedListing.listingAddress,
        },
      });
      return;
    }

    // A different active listing for this NFT must still be rejected.
    const existingListing = await prisma.listing.findFirst({
      where: {
        nftId: nft.id,
        status: "ACTIVE",
      },
    });

    if (existingListing) {
      // Another request may have saved this same transaction
      // after our initial duplicate-transaction check.
      if (
        existingListing.transactionSignature ===
        verifiedListing.transactionSignature
      ) {
        res.status(200).json({
          success: true,
          message: "Listing transaction already recorded",
          data: {
            id: existingListing.id,
            nftId: existingListing.nftId,
            price: Number(existingListing.price),
            currency: existingListing.currency,
            status: existingListing.status,
            transactionSignature: existingListing.transactionSignature,
            listedAt: existingListing.listedAt,
            listingAddress: verifiedListing.listingAddress,
          },
        });
        return;
      }

      res.status(409).json({
        success: false,
        message: "NFT already has an active listing",
      });
      return;
    }

    const listing = await prisma.$transaction(async (tx) => {
      const createdListing = await tx.listing.create({
        data: {
          nftId: nft.id,
          sellerId: userId,
          price: verifiedListing.priceSol,
          currency: "SOL",
          status: "ACTIVE",
          transactionSignature: verifiedListing.transactionSignature,
        },
      });

      await tx.activity.create({
        data: {
          type: "LISTED",
          nftId: nft.id,
          userId,
          price: verifiedListing.priceSol,
          currency: "SOL",
          transactionSignature: verifiedListing.transactionSignature,
        },
      });

      return createdListing;
    });

    res.status(201).json({
      success: true,
      message: "NFT listed successfully",
      data: {
        id: listing.id,
        nftId: listing.nftId,
        price: Number(listing.price),
        currency: listing.currency,
        status: listing.status,
        transactionSignature: listing.transactionSignature,
        listedAt: listing.listedAt,
        listingAddress: verifiedListing.listingAddress,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const verified = verifiedListing as Awaited<
        ReturnType<typeof verifyListingTransaction>
      > | null;

      const existingListing = verified
        ? await prisma.listing.findUnique({
            where: {
              transactionSignature: verified.transactionSignature,
            },
          })
        : null;

      const requestedNftId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (
        existingListing &&
        verified &&
        existingListing.nftId === requestedNftId &&
        existingListing.sellerId === req.auth?.userId
      ) {
        res.status(200).json({
          success: true,
          message: "Listing transaction already recorded",
          data: {
            id: existingListing.id,
            nftId: existingListing.nftId,
            price: Number(existingListing.price),
            currency: existingListing.currency,
            status: existingListing.status,
            transactionSignature: existingListing.transactionSignature,
            listedAt: existingListing.listedAt,
            listingAddress: verified.listingAddress,
          },
        });
        return;
      }

      res.status(409).json({
        success: false,
        message: "This listing transaction has already been recorded",
      });
      return;
    }
    console.error("List NFT error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to list NFT";

    res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function cancelNFTListing(req: Request, res: Response) {
  try {
    const userId = req.auth?.userId;
    const wallet = req.auth?.wallet;

    if (!userId || !wallet) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "NFT id is required",
      });
      return;
    }

    const { transactionSignature } = req.body ?? {};

    if (
      typeof transactionSignature !== "string" ||
      !transactionSignature.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Cancellation transaction signature is required",
      });
      return;
    }

    const signature = transactionSignature.trim();

    const nft = await prisma.nFT.findUnique({
      where: { id },
      select: {
        id: true,
        mintAddress: true,
        ownerId: true,
      },
    });

    if (!nft) {
      res.status(404).json({
        success: false,
        message: "NFT not found",
      });
      return;
    }

    if (nft.ownerId !== userId) {
      res.status(403).json({
        success: false,
        message: "You do not own this NFT",
      });
      return;
    }

    if (!nft.mintAddress) {
      res.status(400).json({
        success: false,
        message: "NFT has not been minted yet",
      });
      return;
    }

    // Verify the actual on-chain cancellation transaction.
    const verified = await verifyCancelListingTransaction({
      transactionSignature: signature,
      sellerWallet: wallet,
      mintAddress: nft.mintAddress,
    });

    // Make retries safe if the previous request was already saved.
    const existingActivity = await prisma.activity.findUnique({
      where: {
        transactionSignature: signature,
      },
    });

    if (existingActivity) {
      if (
        existingActivity.nftId !== nft.id ||
        existingActivity.userId !== userId ||
        existingActivity.type !== "DELISTED"
      ) {
        res.status(409).json({
          success: false,
          message: "This transaction has already been recorded",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Cancellation already recorded",
        data: {
          nftId: nft.id,
          status: "CANCELLED",
          transactionSignature: signature,
          listingAddress: verified.listingAddress,
        },
      });
      return;
    }

    const activeListing = await prisma.listing.findFirst({
      where: {
        nftId: nft.id,
        sellerId: userId,
        status: "ACTIVE",
      },
    });

    if (!activeListing) {
      await prisma.activity.create({
        data: {
          type: "DELISTED",
          nftId: nft.id,
          userId,
          transactionSignature: signature,
        },
      });

      res.status(200).json({
        success: true,
        message: "On-chain cancellation recorded successfully",
        data: {
          nftId: nft.id,
          status: "CANCELLED",
          transactionSignature: signature,
          listingAddress: verified.listingAddress,
        },
      });

      return;
    }

    const cancelledListing = await prisma.$transaction(async (tx) => {
      // Only cancel a listing that is still active.
      const updateResult = await tx.listing.updateMany({
        where: {
          id: activeListing.id,
          nftId: nft.id,
          sellerId: userId,
          status: "ACTIVE",
        },
        data: {
          status: "CANCELLED",
        },
      });

      if (updateResult.count === 0) {
        throw new Error("Listing is no longer active");
      }

      const updatedListing = await tx.listing.findUniqueOrThrow({
        where: {
          id: activeListing.id,
        },
      });

      await tx.activity.create({
        data: {
          type: "DELISTED",
          nftId: nft.id,
          userId,
          price: activeListing.price,
          currency: activeListing.currency,
          transactionSignature: signature,
        },
      });

      return updatedListing;
    });

    res.status(200).json({
      success: true,
      message: "NFT listing cancelled successfully",
      data: {
        id: cancelledListing.id,
        nftId: cancelledListing.nftId,
        price: Number(cancelledListing.price),
        currency: cancelledListing.currency,
        status: cancelledListing.status,
        transactionSignature: signature,
        listingAddress: verified.listingAddress,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const signature = req.body?.transactionSignature;

      const existingActivity =
        typeof signature === "string"
          ? await prisma.activity.findUnique({
              where: { transactionSignature: signature.trim() },
            })
          : null;

      const requestedNftId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (
        existingActivity &&
        existingActivity.nftId === requestedNftId &&
        existingActivity.userId === req.auth?.userId &&
        existingActivity.type === "DELISTED"
      ) {
        res.status(200).json({
          success: true,
          message: "Cancellation already recorded",
          data: {
            nftId: existingActivity.nftId,
            status: "CANCELLED",
            transactionSignature: existingActivity.transactionSignature,
          },
        });
        return;
      }

      res.status(409).json({
        success: false,
        message: "This cancellation transaction has already been recorded",
      });
      return;
    }

    console.error("Cancel NFT listing error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to cancel NFT listing";

    res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function buyNFT(req: Request, res: Response) {
  try {
    const userId = req.auth?.userId;
    const wallet = req.auth?.wallet;

    if (!userId || !wallet) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "NFT id is required",
      });
      return;
    }

    const { transactionSignature } = req.body ?? {};

    if (
      typeof transactionSignature !== "string" ||
      !transactionSignature.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Purchase transaction signature is required",
      });
      return;
    }

    const signature = transactionSignature.trim();

    const nft = await prisma.nFT.findUnique({
      where: { id },
      select: {
        id: true,
        mintAddress: true,
        ownerId: true,
        listings: {
          where: { status: "ACTIVE" },
          orderBy: { listedAt: "desc" },
          take: 1,
          select: {
            id: true,
            sellerId: true,
            price: true,
            currency: true,
            status: true,
            seller: {
              select: {
                wallet: true,
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

    if (!nft.mintAddress) {
      res.status(400).json({
        success: false,
        message: "NFT has not been minted",
      });
      return;
    }

    // Make retries safe if the purchase was already recorded.
    const existingSale = await prisma.sale.findUnique({
      where: { transactionSignature: signature },
    });

    if (existingSale) {
      if (existingSale.nftId !== nft.id || existingSale.buyerId !== userId) {
        res.status(409).json({
          success: false,
          message: "This transaction has already been recorded",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Purchase already recorded",
        data: {
          id: existingSale.id,
          nftId: existingSale.nftId,
          buyerId: existingSale.buyerId,
          sellerId: existingSale.sellerId,
          price: Number(existingSale.price),
          currency: existingSale.currency,
          transactionSignature: existingSale.transactionSignature,
          createdAt: existingSale.createdAt,
        },
      });
      return;
    }

    const activeListing = nft.listings[0];

    if (!activeListing) {
      res.status(409).json({
        success: false,
        message: "This NFT is no longer listed for sale",
      });
      return;
    }

    if (nft.ownerId !== activeListing.sellerId) {
      res.status(409).json({
        success: false,
        message: "NFT ownership does not match its active listing",
      });
      return;
    }

    // Verify the actual on-chain purchase transaction.
    const verified = await verifyBuyNFTTransaction({
      transactionSignature: signature,
      buyerWallet: wallet,
      sellerWallet: activeListing.seller.wallet,
      mintAddress: nft.mintAddress,
    });

    // Update ownership and record the sale atomically.
    const sale = await prisma.$transaction(async (tx) => {
      const listingUpdate = await tx.listing.updateMany({
        where: {
          id: activeListing.id,
          nftId: nft.id,
          sellerId: activeListing.sellerId,
          status: "ACTIVE",
        },
        data: {
          status: "SOLD",
          soldAt: new Date(),
        },
      });

      if (listingUpdate.count === 0) {
        throw new Error("Listing is no longer active");
      }

      const ownershipUpdate = await tx.nFT.updateMany({
        where: {
          id: nft.id,
          ownerId: activeListing.sellerId,
        },
        data: {
          ownerId: userId,
        },
      });

      if (ownershipUpdate.count === 0) {
        throw new Error("NFT ownership has changed");
      }

      const createdSale = await tx.sale.create({
        data: {
          nftId: nft.id,
          buyerId: userId,
          sellerId: activeListing.sellerId,
          price: activeListing.price,
          currency: activeListing.currency,
          transactionSignature: verified.transactionSignature,
        },
      });

      await tx.activity.create({
        data: {
          type: "SALE",
          nftId: nft.id,
          userId,
          price: activeListing.price,
          currency: activeListing.currency,
          transactionSignature: verified.transactionSignature,
        },
      });

      return createdSale;
    });

    res.status(200).json({
      success: true,
      message: "NFT purchased successfully",
      data: {
        id: sale.id,
        nftId: sale.nftId,
        buyerId: sale.buyerId,
        sellerId: sale.sellerId,
        price: Number(sale.price),
        currency: sale.currency,
        transactionSignature: sale.transactionSignature,
        createdAt: sale.createdAt,
        listingAddress: verified.listingAddress,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const signature = req.body?.transactionSignature;

      const existingSale =
        typeof signature === "string"
          ? await prisma.sale.findUnique({
              where: {
                transactionSignature: signature.trim(),
              },
            })
          : null;

      if (
        existingSale &&
        existingSale.nftId ===
          (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) &&
        existingSale.buyerId === req.auth?.userId
      ) {
        res.status(200).json({
          success: true,
          message: "Purchase already recorded",
          data: {
            id: existingSale.id,
            nftId: existingSale.nftId,
            buyerId: existingSale.buyerId,
            sellerId: existingSale.sellerId,
            price: Number(existingSale.price),
            currency: existingSale.currency,
            transactionSignature: existingSale.transactionSignature,
          },
        });
        return;
      }

      res.status(409).json({
        success: false,
        message: "This purchase transaction has already been recorded",
      });
      return;
    }

    console.error("Buy NFT error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to purchase NFT";

    res.status(400).json({
      success: false,
      message,
    });
  }
}
