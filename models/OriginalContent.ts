/**
 * OriginalContent model
 */

export interface OriginalContent {
  contentId: string;
  ipfsHash: string;
  ownerAddress: string;
  title: string;
  description: string;
  royaltyPercentage: number;
  contentType: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Validates an OriginalContent object
 * @param content The content object to validate
 * @returns True if valid, false otherwise
 */
export function validateOriginalContent(content: Partial<OriginalContent>): boolean {
  if (!content.contentId || !content.ipfsHash || !content.ownerAddress) {
    return false;
  }
  
  if (!content.title || !content.contentType) {
    return false;
  }
  
  if (content.royaltyPercentage === undefined || content.royaltyPercentage < 0 || content.royaltyPercentage > 100) {
    return false;
  }
  
  if (!content.createdAt || !content.updatedAt) {
    return false;
  }
  
  return true;
}

/**
 * Creates a new OriginalContent object with default values
 * @param params Parameters for the new content
 * @returns A new OriginalContent object
 */
export function createOriginalContent(params: {
  ipfsHash: string;
  ownerAddress: string;
  title: string;
  contentType: string;
  description?: string;
  royaltyPercentage?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}): OriginalContent {
  const timestamp = Date.now();
  const contentId = `content:${timestamp}:${Math.floor(Math.random() * 1000000)}`;
  
  return {
    contentId,
    ipfsHash: params.ipfsHash,
    ownerAddress: params.ownerAddress,
    title: params.title,
    description: params.description || '',
    royaltyPercentage: params.royaltyPercentage || 50,
    contentType: params.contentType,
    createdAt: timestamp,
    updatedAt: timestamp,
    tags: params.tags || [],
    metadata: params.metadata || {}
  };
}

/**
 * Updates an OriginalContent object
 * @param content The content object to update
 * @param updates The updates to apply
 * @returns The updated OriginalContent object
 */
export function updateOriginalContent(content: OriginalContent, updates: Partial<OriginalContent>): OriginalContent {
  return {
    ...content,
    ...updates,
    updatedAt: Date.now()
  };
}

