/**
 * Provenance utilities for RemixFlow
 * Provides functions for NFT-based provenance tracking
 */

import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { REMIX_PROVENANCE_ADDRESS, REMIX_PROVENANCE_ABI } from './contractConfig';
import { uploadToIPFS, getIPFSUrl } from './ipfsUtils';

/**
 * Creates metadata for a remix NFT
 * @param params Metadata parameters
 * @returns The metadata object
 */
export async function createRemixMetadata(params: {
  name: string;
  description: string;
  originalContentHash: string;
  remixContentHash: string;
  creatorAddress: string;
  transformation: string;
  transformationParams: Record<string, any>;
  contentType: string;
  image?: string;
  animation_url?: string;
}): Promise<Record<string, any>> {
  // Create the metadata object
  const metadata = {
    name: params.name,
    description: params.description,
    external_url: `https://remixflow.app/remix/${params.remixContentHash}`,
    image: params.image || `https://remixflow.app/api/thumbnail/${params.remixContentHash}`,
    animation_url: params.animation_url,
    attributes: [
      {
        trait_type: 'Transformation',
        value: params.transformation
      },
      {
        trait_type: 'Content Type',
        value: params.contentType
      },
      {
        trait_type: 'Original Creator',
        value: params.creatorAddress
      }
    ],
    properties: {
      originalContentHash: params.originalContentHash,
      remixContentHash: params.remixContentHash,
      transformation: params.transformation,
      transformationParams: params.transformationParams,
      contentType: params.contentType,
      createdAt: Date.now()
    }
  };
  
  return metadata;
}

/**
 * Mints a remix NFT
 * @param params Minting parameters
 * @returns The transaction hash and token ID
 */
export async function mintRemixNFT(params: {
  creator: string;
  originalContentHash: string;
  remixContentHash: string;
  transformation: string;
  metadata: Record<string, any>;
}): Promise<{ txHash: string; tokenId: number }> {
  try {
    // Upload metadata to IPFS
    const metadataHash = await uploadToIPFS(
      new File(
        [JSON.stringify(params.metadata, null, 2)], 
        'metadata.json', 
        { type: 'application/json' }
      ),
      { type: 'metadata' }
    );
    
    const tokenURI = getIPFSUrl(metadataHash);
    
    // Check if we're in a browser environment with ethereum provider
    if (typeof window === 'undefined' || !window.ethereum) {
      // Simulate transaction for non-browser environments
      const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const tokenId = Math.floor(Math.random() * 1000000);
      
      return { txHash, tokenId };
    }
    
    // Create wallet client
    const client = createWalletClient({
      chain: base,
      transport: custom(window.ethereum),
    });
    
    // Get the connected account or use private key if available
    const account = process.env.NEXT_PUBLIC_PRIVATE_KEY 
      ? privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY)
      : (await client.getAddresses())[0];
    
    // Mint the NFT
    const tx = await client.writeContract({
      address: REMIX_PROVENANCE_ADDRESS as `0x${string}`,
      abi: REMIX_PROVENANCE_ABI,
      functionName: 'mintRemix',
      args: [
        params.creator,
        params.originalContentHash,
        params.remixContentHash,
        params.transformation,
        tokenURI
      ],
      account,
    });
    
    // In a real implementation, we would get the token ID from the event
    // For now, we'll simulate it
    const tokenId = Math.floor(Math.random() * 1000000);
    
    return { txHash: tx, tokenId };
  } catch (error) {
    console.error('Error minting remix NFT:', error);
    throw new Error(`Failed to mint remix NFT: ${error.message}`);
  }
}

/**
 * Gets all remixes for an original content
 * @param originalContentHash The original content hash
 * @returns Array of remix token IDs
 */
export async function getRemixesByOriginalContent(
  originalContentHash: string
): Promise<number[]> {
  try {
    // In a real implementation, we would call the contract
    // For now, we'll return an empty array
    return [];
  } catch (error) {
    console.error('Error getting remixes by original content:', error);
    throw new Error(`Failed to get remixes by original content: ${error.message}`);
  }
}

/**
 * Gets the provenance certificate for a remix
 * @param tokenId The token ID
 * @returns The provenance certificate
 */
export async function getProvenanceCertificate(
  tokenId: number
): Promise<{
  tokenId: number;
  creator: string;
  originalContentHash: string;
  remixContentHash: string;
  transformation: string;
  tokenURI: string;
  metadata: Record<string, any>;
}> {
  try {
    // In a real implementation, we would call the contract
    // For now, we'll return a simulated certificate
    return {
      tokenId,
      creator: '0x0000000000000000000000000000000000000000',
      originalContentHash: '',
      remixContentHash: '',
      transformation: '',
      tokenURI: '',
      metadata: {}
    };
  } catch (error) {
    console.error('Error getting provenance certificate:', error);
    throw new Error(`Failed to get provenance certificate: ${error.message}`);
  }
}

