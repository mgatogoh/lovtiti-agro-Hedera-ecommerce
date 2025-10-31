import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { ContractExecuteTransaction, ContractFunctionParameters, } from "@hashgraph/sdk";
import { uploadToIPFS } from "@/utils/pinata"; //Use your Pinata util
import { auth } from "@clerk/nextjs/server";
import dotenv from "dotenv";
import { AGRO_CONTRACT_ID, hederaClient } from "@/lib/hederaClient";

dotenv.config();

// GET /api/listings - Get all listings with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.priceCents = {};
      if (minPrice) where.priceCents.gte = parseInt(minPrice) * 100;
      if (maxPrice) where.priceCents.lte = parseInt(maxPrice) * 100;
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price-low':
        orderBy = { priceCents: 'asc' };
        break;
      case 'price-high':
        orderBy = { priceCents: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          seller: {
            select: {
              id: true,
              email: true,
              profiles: {
                where: { type: 'FARMER' },
                select: {
                  fullName: true,
                  country: true,
                },
              },
            },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create a new listing

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      title,
      description,
      productDescription,
      priceCents,
      quantity,
      unit,
      category,
      location,
      harvestDate,
      expiryDate,
      images,
      video,
    } = body;

    if (!title || !description || !priceCents || !quantity || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profiles: true },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hasValidProfile = user.profiles.some((p) =>
      ["FARMER", "AGROEXPERT"].includes(p.type)
    );
    if (!hasValidProfile) {
      return NextResponse.json(
        { error: "Farmer or Agro Expert profile required." },
        { status: 403 }
      );
    }

    // ✅ Upload images to Pinata
    const uploadedImages: string[] = [];

    if (images && images.length > 0) {
      console.log(`📸 Uploading ${images.length} images to IPFS...`);

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
          if (typeof image === "string") {
            if (image.startsWith('data:')) {
              // Base64 image - convert to buffer and upload
              const base64Data = image.split(',')[1];
              const buffer = Buffer.from(base64Data, 'base64');
              const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${i}_${Date.now()}`;

              const uploaded = await uploadToIPFS(buffer, fileName);
              const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${uploaded.IpfsHash}`;
              uploadedImages.push(ipfsUrl);
              console.log(`✅ Image ${i + 1} uploaded to IPFS: ${ipfsUrl}`);
            } else {
              // Already an IPFS URL
              uploadedImages.push(image);
            }
          } else {
            // File object - convert to buffer and upload
            const buffer = Buffer.from(await image.arrayBuffer());
            const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${i}_${Date.now()}`;

            const uploaded = await uploadToIPFS(buffer, fileName);
            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${uploaded.IpfsHash}`;
            uploadedImages.push(ipfsUrl);
            console.log(`✅ Image ${i + 1} uploaded to IPFS: ${ipfsUrl}`);
          }
        } catch (uploadError) {
          console.error(`❌ Image ${i + 1} upload failed:`, uploadError);
          // Continue with other images even if one fails
        }
      }

      console.log(`✅ Successfully uploaded ${uploadedImages.length}/${images.length} images`);
    }

    // ✅ Call Hedera smart contract (optional for development)
    let contractTxHash = null;

    if (process.env.ENABLE_SMART_CONTRACT !== 'false') {
      try {
        // First, try to register as farmer (will fail if already registered, which is fine)
        try {
          console.log("🌾 Attempting to register farmer in smart contract...");
          const registerTx = new ContractExecuteTransaction()
            .setContractId(AGRO_CONTRACT_ID)
            .setGas(200000)
            .setFunction("createFarmer");

          const registerSubmitTx = await registerTx.execute(hederaClient);
          const registerReceipt = await registerSubmitTx.getReceipt(hederaClient);
          console.log("✅ Farmer registration successful:", registerReceipt.status.toString());
        } catch (registerError: any) {
          // If registration fails, it might be because farmer already exists
          console.log("ℹ️ Farmer registration failed (might already exist):", registerError.message);
        }

        // Now try to add the product
        console.log("📦 Adding product to smart contract...");
        const tx = new ContractExecuteTransaction()
          .setContractId(AGRO_CONTRACT_ID)
          .setGas(300000)
          .setFunction(
            "addProduct",
            new ContractFunctionParameters()
              .addUint256(Number(priceCents))
              .addUint256(Math.floor(Number(quantity)))
          );

        const submitTx = await tx.execute(hederaClient);
        const receipt = await submitTx.getReceipt(hederaClient);
        const status = receipt.status.toString();

        if (status !== "SUCCESS") {
          console.error("❌ Smart contract execution failed:", status);
          // Don't fail the entire request, just log the error
          console.log("⚠️ Continuing without smart contract registration...");
        } else {
          contractTxHash = submitTx.transactionId.toString();
          console.log("✅ Product added to smart contract successfully:", contractTxHash);
        }
      } catch (contractError: any) {
        console.error("❌ Smart contract error:", contractError);
        console.log("⚠️ Continuing without smart contract registration...");
        // Don't fail the entire request, just continue without smart contract
      }
    } else {
      console.log("ℹ️ Smart contract calls disabled for development");
    }

    // Log contract transaction hash if available
    if (contractTxHash) {
      console.log(`✅ Hedera contract transaction: ${contractTxHash}`);
    }

    // ✅ Save to Prisma DB
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        productDescription,
        priceCents: parseInt(priceCents),
        currency: "HBAR",
        quantity: parseFloat(quantity),
        unit,
        category,
        location,
        harvestDate: harvestDate ? new Date(harvestDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        images: uploadedImages,
        video,
        sellerId: user.id,
      },
    });

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (err) {
    console.error("Error creating listing:", err);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

