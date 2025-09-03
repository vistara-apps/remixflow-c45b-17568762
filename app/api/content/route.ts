/**
 * API route for content management
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContentData } from '@/utils/dataUtils';
import { OriginalContent, validateOriginalContent, createOriginalContent } from '@/models';
import { uploadToIPFS } from '@/utils/ipfsUtils';

/**
 * GET /api/content/:contentId
 * Get content by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = params.contentId;
    
    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }
    
    const content = await ContentData.getContent(contentId);
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error getting content:', error);
    return NextResponse.json(
      { error: 'Failed to get content' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content
 * Create new content
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const ownerAddress = formData.get('ownerAddress') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const royaltyPercentage = parseInt(formData.get('royaltyPercentage') as string) || 50;
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [];
    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : {};
    
    if (!file || !ownerAddress || !title) {
      return NextResponse.json(
        { error: 'File, owner address, and title are required' },
        { status: 400 }
      );
    }
    
    // Upload file to IPFS
    const ipfsHash = await uploadToIPFS(file, {
      creator: ownerAddress,
      contentType: file.type,
      title,
      description,
      timestamp: Date.now()
    });
    
    // Create content object
    const content = createOriginalContent({
      ipfsHash,
      ownerAddress,
      title,
      contentType: file.type,
      description,
      royaltyPercentage,
      tags,
      metadata
    });
    
    // Validate content
    if (!validateOriginalContent(content)) {
      return NextResponse.json(
        { error: 'Invalid content data' },
        { status: 400 }
      );
    }
    
    // Save content
    const success = await ContentData.createContent(content);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create content' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/content/:contentId
 * Update content
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = params.contentId;
    const body = await request.json();
    
    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }
    
    // Check if content exists
    const existingContent = await ContentData.getContent(contentId);
    
    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    // Update content
    const updatedContent = await ContentData.updateContent(contentId, body);
    
    if (!updatedContent) {
      return NextResponse.json(
        { error: 'Failed to update content' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

