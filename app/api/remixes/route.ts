/**
 * API route for remix management
 */

import { NextRequest, NextResponse } from 'next/server';
import { RemixData, ContentData } from '@/utils/dataUtils';
import { Remix, validateRemix, createRemix } from '@/models';
import { processAIRemix } from '@/utils/aiUtils';
import { calculateRoyaltySplits, registerRemixRoyalties } from '@/utils/royaltyUtils';
import { createRemixMetadata, mintRemixNFT } from '@/utils/provenanceUtils';

/**
 * GET /api/remixes/:remixId
 * Get a remix by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { remixId: string } }
) {
  try {
    const remixId = params.remixId;
    
    if (!remixId) {
      return NextResponse.json(
        { error: 'Remix ID is required' },
        { status: 400 }
      );
    }
    
    const remix = await RemixData.getRemix(remixId);
    
    if (!remix) {
      return NextResponse.json(
        { error: 'Remix not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(remix);
  } catch (error) {
    console.error('Error getting remix:', error);
    return NextResponse.json(
      { error: 'Failed to get remix' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/remixes
 * Create a new remix
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'audio' | 'video';
    const transformation = formData.get('transformation') as string;
    const transformationParams = formData.get('transformationParams') 
      ? JSON.parse(formData.get('transformationParams') as string) 
      : {};
    const originalContentId = formData.get('originalContentId') as string;
    const creatorAddress = formData.get('creatorAddress') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const royaltySplits = formData.get('royaltySplits') 
      ? JSON.parse(formData.get('royaltySplits') as string) 
      : [];
    const tags = formData.get('tags') 
      ? JSON.parse(formData.get('tags') as string) 
      : [];
    const metadata = formData.get('metadata') 
      ? JSON.parse(formData.get('metadata') as string) 
      : {};
    
    if (!file || !type || !transformation || !originalContentId || !creatorAddress) {
      return NextResponse.json(
        { error: 'File, type, transformation, original content ID, and creator address are required' },
        { status: 400 }
      );
    }
    
    // Get original content
    const originalContent = await ContentData.getContent(originalContentId);
    
    if (!originalContent) {
      return NextResponse.json(
        { error: 'Original content not found' },
        { status: 404 }
      );
    }
    
    // Process the remix using AI
    const { transformedFile, ipfsHash, metadata: aiMetadata } = await processAIRemix(
      file,
      type,
      transformation,
      transformationParams
    );
    
    // Calculate royalty splits
    const splits = calculateRoyaltySplits(
      originalContent.ownerAddress,
      creatorAddress,
      royaltySplits
    );
    
    // Create remix object
    const remix = createRemix({
      originalContentId,
      creatorAddress,
      ipfsHash,
      originalIpfsHash: originalContent.ipfsHash,
      title: title || `${originalContent.title} (${transformation} Remix)`,
      description: description || `${transformation} transformation of ${originalContent.title}`,
      transformation,
      transformationParams,
      contentType: transformedFile.type,
      tags,
      metadata: {
        ...metadata,
        ...aiMetadata
      }
    });
    
    // Validate remix
    if (!validateRemix(remix)) {
      return NextResponse.json(
        { error: 'Invalid remix data' },
        { status: 400 }
      );
    }
    
    // Register royalty splits
    const royaltyTxHash = await registerRemixRoyalties(
      remix.remixId,
      creatorAddress,
      splits
    );
    
    // Create metadata for NFT
    const nftMetadata = await createRemixMetadata({
      name: remix.title,
      description: remix.description,
      originalContentHash: originalContent.ipfsHash,
      remixContentHash: ipfsHash,
      creatorAddress,
      transformation,
      transformationParams,
      contentType: transformedFile.type,
      image: aiMetadata.imageUrl
    });
    
    // Mint NFT for provenance
    const { txHash: provenanceTxHash, tokenId } = await mintRemixNFT({
      creator: creatorAddress,
      originalContentHash: originalContent.ipfsHash,
      remixContentHash: ipfsHash,
      transformation,
      metadata: nftMetadata
    });
    
    // Update remix with transaction hashes and token ID
    remix.royaltyDistributionTxHash = royaltyTxHash;
    remix.onchainTxHash = provenanceTxHash;
    remix.tokenId = tokenId;
    
    // Save remix
    const success = await RemixData.createRemix(remix);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create remix' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(remix, { status: 201 });
  } catch (error) {
    console.error('Error creating remix:', error);
    return NextResponse.json(
      { error: 'Failed to create remix' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/remixes/:remixId
 * Update a remix
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { remixId: string } }
) {
  try {
    const remixId = params.remixId;
    const body = await request.json();
    
    if (!remixId) {
      return NextResponse.json(
        { error: 'Remix ID is required' },
        { status: 400 }
      );
    }
    
    // Check if remix exists
    const existingRemix = await RemixData.getRemix(remixId);
    
    if (!existingRemix) {
      return NextResponse.json(
        { error: 'Remix not found' },
        { status: 404 }
      );
    }
    
    // Update remix
    const updatedRemix = await RemixData.updateRemix(remixId, body);
    
    if (!updatedRemix) {
      return NextResponse.json(
        { error: 'Failed to update remix' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedRemix);
  } catch (error) {
    console.error('Error updating remix:', error);
    return NextResponse.json(
      { error: 'Failed to update remix' },
      { status: 500 }
    );
  }
}

