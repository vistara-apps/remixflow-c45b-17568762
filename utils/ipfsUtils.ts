/**
 * IPFS utilities for RemixFlow
 * Provides functions for uploading and retrieving content from IPFS
 */

/**
 * Uploads a file to IPFS
 * @param file The file to upload
 * @param metadata Optional metadata to include with the file
 * @returns The IPFS hash of the uploaded file
 */
export async function uploadToIPFS(
  file: File,
  metadata: Record<string, any> = {}
): Promise<string> {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata
    if (Object.keys(metadata).length > 0) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    
    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    
    // For development/testing, return a mock hash if upload fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock IPFS hash for development');
      return `mock-ipfs-hash-${Date.now()}`;
    }
    
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
}

/**
 * Gets the IPFS URL for a hash
 * @param hash The IPFS hash
 * @returns The IPFS URL
 */
export function getIPFSUrl(hash: string): string {
  // Check if hash is already a URL
  if (hash.startsWith('http') || hash.startsWith('ipfs://')) {
    return hash;
  }
  
  // Check if hash is a mock hash (for development)
  if (hash.startsWith('mock-ipfs-hash-')) {
    return `https://remixflow.app/api/mock/${hash}`;
  }
  
  // Use IPFS gateway
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  return `${gateway}${hash}`;
}

/**
 * Uploads JSON data to IPFS
 * @param data The JSON data to upload
 * @returns The IPFS hash of the uploaded data
 */
export async function uploadJSONToIPFS(data: Record<string, any>): Promise<string> {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // Create a Blob and then a File from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });
    
    // Upload to IPFS
    return await uploadToIPFS(file, { type: 'metadata' });
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    
    // For development/testing, return a mock hash if upload fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock IPFS hash for development');
      return `mock-ipfs-hash-${Date.now()}`;
    }
    
    throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
  }
}

/**
 * Fetches data from IPFS
 * @param hash The IPFS hash
 * @returns The data as JSON
 */
export async function fetchFromIPFS<T = any>(hash: string): Promise<T> {
  try {
    // Get IPFS URL
    const url = getIPFSUrl(hash);
    
    // Fetch data
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    
    // Parse JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    
    // For development/testing, return mock data if fetch fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock data for development');
      return { mockData: true, hash } as unknown as T;
    }
    
    throw new Error(`Failed to fetch from IPFS: ${error.message}`);
  }
}

