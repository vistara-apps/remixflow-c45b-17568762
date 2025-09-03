/**
 * API route for royalty management
 */

import { NextRequest, NextResponse } from 'next/server';
import { RoyaltyData, RemixData } from '@/utils/dataUtils';
import { distributeRoyalties, getRoyaltyInfo } from '@/utils/royaltyUtils';

/**
 * GET /api/royalties/:remixId
 * Get royalty information for a remix
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
    
    // Check if remix exists
    const remix = await RemixData.getRemix(remixId);
    
    if (!remix) {
      return NextResponse.json(
        { error: 'Remix not found' },
        { status: 404 }
      );
    }
    
    // Get royalty information
    const royaltyInfo = await getRoyaltyInfo(remixId);
    
    return NextResponse.json(royaltyInfo);
  } catch (error) {
    console.error('Error getting royalty information:', error);
    return NextResponse.json(
      { error: 'Failed to get royalty information' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/royalties/distribute
 * Distribute royalties for a remix
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { remixId, amount } = body;
    
    if (!remixId || amount === undefined) {
      return NextResponse.json(
        { error: 'Remix ID and amount are required' },
        { status: 400 }
      );
    }
    
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than zero' },
        { status: 400 }
      );
    }
    
    // Check if remix exists
    const remix = await RemixData.getRemix(remixId);
    
    if (!remix) {
      return NextResponse.json(
        { error: 'Remix not found' },
        { status: 404 }
      );
    }
    
    // Distribute royalties
    const txHash = await distributeRoyalties(remixId, amount);
    
    return NextResponse.json({
      success: true,
      txHash,
      remixId,
      amount
    });
  } catch (error) {
    console.error('Error distributing royalties:', error);
    return NextResponse.json(
      { error: 'Failed to distribute royalties' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/royalties/recipient/:address
 * Get all royalty splits for a recipient
 */
export async function GET_RECIPIENT(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;
    
    if (!address) {
      return NextResponse.json(
        { error: 'Recipient address is required' },
        { status: 400 }
      );
    }
    
    // Get all royalty splits for the recipient
    const splits = await RoyaltyData.getRecipientRoyaltySplits(address);
    
    return NextResponse.json(splits);
  } catch (error) {
    console.error('Error getting recipient royalty splits:', error);
    return NextResponse.json(
      { error: 'Failed to get recipient royalty splits' },
      { status: 500 }
    );
  }
}

