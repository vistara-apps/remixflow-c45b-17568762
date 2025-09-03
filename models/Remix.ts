/**
 * Remix model
 */

export interface Remix {
  remixId: string;
  originalContentId: string;
  creatorAddress: string;
  ipfsHash: string;
  originalIpfsHash: string;
  title: string;
  description: string;
  transformation: string;
  transformationParams: Record<string, any>;
  contentType: string;
  creationTimestamp: number;
  onchainTxHash: string;
  royaltyDistributionTxHash: string;
  tokenId?: number;
  plays?: number;
  likes?: number;
  shares?: number;
  earnings?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Validates a Remix object
 * @param remix The remix object to validate
 * @returns True if valid, false otherwise
 */
export function validateRemix(remix: Partial<Remix>): boolean {
  if (!remix.remixId || !remix.originalContentId || !remix.creatorAddress) {
    return false;
  }
  
  if (!remix.ipfsHash || !remix.originalIpfsHash) {
    return false;
  }
  
  if (!remix.title || !remix.transformation || !remix.contentType) {
    return false;
  }
  
  if (!remix.creationTimestamp) {
    return false;
  }
  
  return true;
}

/**
 * Creates a new Remix object with default values
 * @param params Parameters for the new remix
 * @returns A new Remix object
 */
export function createRemix(params: {
  originalContentId: string;
  creatorAddress: string;
  ipfsHash: string;
  originalIpfsHash: string;
  title: string;
  description?: string;
  transformation: string;
  transformationParams: Record<string, any>;
  contentType: string;
  onchainTxHash?: string;
  royaltyDistributionTxHash?: string;
  tokenId?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}): Remix {
  const timestamp = Date.now();
  const remixId = `remix:${timestamp}:${Math.floor(Math.random() * 1000000)}`;
  
  return {
    remixId,
    originalContentId: params.originalContentId,
    creatorAddress: params.creatorAddress,
    ipfsHash: params.ipfsHash,
    originalIpfsHash: params.originalIpfsHash,
    title: params.title,
    description: params.description || '',
    transformation: params.transformation,
    transformationParams: params.transformationParams || {},
    contentType: params.contentType,
    creationTimestamp: timestamp,
    onchainTxHash: params.onchainTxHash || '',
    royaltyDistributionTxHash: params.royaltyDistributionTxHash || '',
    tokenId: params.tokenId,
    plays: 0,
    likes: 0,
    shares: 0,
    earnings: 0,
    tags: params.tags || [],
    metadata: params.metadata || {}
  };
}

/**
 * Updates a Remix object
 * @param remix The remix object to update
 * @param updates The updates to apply
 * @returns The updated Remix object
 */
export function updateRemix(remix: Remix, updates: Partial<Remix>): Remix {
  return {
    ...remix,
    ...updates
  };
}

