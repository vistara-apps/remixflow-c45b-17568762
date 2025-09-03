/**
 * API route for provenance tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProvenanceCertificate, getRemixesByOriginalContent } from '@/utils/provenanceUtils';

/**
 * GET /api/provenance/certificate/:tokenId
 * Get provenance certificate for a remix
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const tokenId = parseInt(params.tokenId);
    
    if (isNaN(tokenId)) {
      return NextResponse.json(
        { error: 'Valid token ID is required' },
        { status: 400 }
      );
    }
    
    // Get provenance certificate
    const certificate = await getProvenanceCertificate(tokenId);
    
    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error getting provenance certificate:', error);
    return NextResponse.json(
      { error: 'Failed to get provenance certificate' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/provenance/remixes/:originalContentHash
 * Get all remixes for an original content
 */
export async function GET_REMIXES(
  request: NextRequest,
  { params }: { params: { originalContentHash: string } }
) {
  try {
    const originalContentHash = params.originalContentHash;
    
    if (!originalContentHash) {
      return NextResponse.json(
        { error: 'Original content hash is required' },
        { status: 400 }
      );
    }
    
    // Get all remixes for the original content
    const remixes = await getRemixesByOriginalContent(originalContentHash);
    
    return NextResponse.json(remixes);
  } catch (error) {
    console.error('Error getting remixes by original content:', error);
    return NextResponse.json(
      { error: 'Failed to get remixes by original content' },
      { status: 500 }
    );
  }
}

