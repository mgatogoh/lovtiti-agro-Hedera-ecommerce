// API route for minting NFTs
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { MintNFTRequest, MintNFTResponse, NFTStandard, NFTCategory } from '@/types/nft';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const body: MintNFTRequest = await request.json();
    const { category, metadata, royalties } = body;

    // Validate required fields
    if (!category || !metadata || !royalties) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            message: 'Missing required fields: category, metadata, royalties' 
          } 
        },
        { status: 400 }
      );
    }

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profiles: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'User not found' } },
        { status: 404 }
      );
    }

    // Generate unique token ID (in production, this would come from Hedera)
    const tokenId = `0.0.${Math.floor(Math.random() * 1000000)}`;
    const contractAddress = `0.0.${Math.floor(Math.random() * 1000000)}`;
    const ipfsHash = `Qm${Math.random().toString(36).substr(2, 44)}`;

    // Create NFT record in database
    const nft = await prisma.nFT.create({
      data: {
        tokenId,
        contractAddress,
        ownerAddress: user.profiles[0]?.hederaWallet || '0.0.0',
        creatorAddress: user.profiles[0]?.hederaWallet || '0.0.0',
        tokenStandard: 'HTS-721',
        metadataUri: `ipfs://${ipfsHash}`,
        metadataHash: ipfsHash,
        category,
        metadata: JSON.stringify(metadata),
        royalties: JSON.stringify(royalties),
        isBurned: false,
      }
    });

    // Create initial supply chain step
    await prisma.supplyChainStep.create({
      data: {
        nftId: nft.id,
        stepIndex: 0,
        action: 'NFT_MINTED',
        location: 'Lovtiti Agro Mart',
        actorAddress: user.profiles[0]?.hederaWallet || '0.0.0',
        metadata: JSON.stringify({
          mintingPlatform: 'Lovtiti Agro Mart',
          mintingTime: new Date().toISOString(),
          category,
          royalties
        }),
        isVerified: true,
        verifierAddress: user.profiles[0]?.hederaWallet || '0.0.0',
        verifiedAt: new Date(),
      }
    });

    // Create initial quality check if it's a product
    if (category === 'PRODUCT' && metadata.attributes?.type === 'PRODUCT') {
      await prisma.qualityCheck.create({
        data: {
          nftId: nft.id,
          checkType: 'INITIAL_MINT',
          passed: true,
          score: 100,
          notes: 'NFT successfully minted with valid metadata',
          inspector: user.profiles[0]?.hederaWallet || '0.0.0',
          evidence: [],
        }
      });
    }

    const response: MintNFTResponse = {
      success: true,
      nft: {
        tokenId: nft.tokenId,
        contractAddress: nft.contractAddress,
        tokenStandard: nft.tokenStandard as NFTStandard,
        category: nft.category as NFTCategory,
        owner: nft.ownerAddress,
        creator: nft.creatorAddress,
        metadata: JSON.parse(nft.metadata),
        royalties: JSON.parse(nft.royalties),
        isBurned: false,
        createdAt: nft.createdAt,
        updatedAt: nft.updatedAt,
      },
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      ipfsHash: nft.metadataHash,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error minting NFT:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: { message: 'Method not allowed' } },
    { status: 405 }
  );
}
