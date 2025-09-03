/**
 * Royalty utilities for RemixFlow
 * Provides functions for royalty calculation and distribution
 */

import { createWalletClient, custom, parseEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { ROYALTY_SPLITTER_ADDRESS, ROYALTY_SPLITTER_ABI } from './contractConfig';
import { RoyaltySplit } from '@/models';
import { RoyaltyData } from './dataUtils';

/**
 * Calculates royalty splits for a remix
 * @param originalCreator The original content creator address
 * @param remixCreator The remix creator address
 * @param customSplits Custom royalty splits specified by the user
 * @returns Array of royalty splits
 */
export function calculateRoyaltySplits(
  originalCreator: string,
  remixCreator: string,
  customSplits: { recipient: string; percentage: number }[] = []
): { recipient: string; percentage: number }[] {
  // Start with default splits
  let splits: { recipient: string; percentage: number }[] = [
    { recipient: originalCreator, percentage: 50 } // Original creator gets 50% by default
  ];
  
  // Add custom splits if provided
  if (customSplits.length > 0) {
    splits = customSplits;
  }
  
  // Validate total percentage
  const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0);
  if (totalPercentage > 100) {
    throw new Error('Total royalty percentage exceeds 100%');
  }
  
  return splits;
}

/**
 * Registers a remix for royalty distribution
 * @param remixId The remix ID
 * @param creator The remix creator address
 * @param splits The royalty splits
 * @returns The transaction hash
 */
export async function registerRemixRoyalties(
  remixId: string,
  creator: string,
  splits: { recipient: string; percentage: number }[]
): Promise<string> {
  try {
    // Check if we're in a browser environment with ethereum provider
    if (typeof window === 'undefined' || !window.ethereum) {
      // Simulate transaction for non-browser environments
      const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      // Store the royalty splits in the database
      for (const split of splits) {
        await RoyaltyData.createRoyaltySplit({
          splitId: `split:${remixId}:${split.recipient}`,
          remixId,
          recipientAddress: split.recipient,
          percentage: split.percentage,
          amountPaid: 0,
          createdAt: Date.now()
        });
      }
      
      return txHash;
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
    
    // Register the remix with the contract
    const tx = await client.writeContract({
      address: ROYALTY_SPLITTER_ADDRESS as `0x${string}`,
      abi: ROYALTY_SPLITTER_ABI,
      functionName: 'registerRemix',
      args: [
        remixId,
        creator,
        splits.map(s => ({ recipient: s.recipient, percentage: s.percentage }))
      ],
      account,
    });
    
    // Store the royalty splits in the database
    for (const split of splits) {
      await RoyaltyData.createRoyaltySplit({
        splitId: `split:${remixId}:${split.recipient}`,
        remixId,
        recipientAddress: split.recipient,
        percentage: split.percentage,
        amountPaid: 0,
        createdAt: Date.now()
      });
    }
    
    return tx;
  } catch (error) {
    console.error('Error registering remix royalties:', error);
    throw new Error(`Failed to register remix royalties: ${error.message}`);
  }
}

/**
 * Distributes royalties for a remix
 * @param remixId The remix ID
 * @param amount The amount to distribute (in ETH)
 * @returns The transaction hash
 */
export async function distributeRoyalties(
  remixId: string,
  amount: number
): Promise<string> {
  try {
    // Check if we're in a browser environment with ethereum provider
    if (typeof window === 'undefined' || !window.ethereum) {
      // Simulate transaction for non-browser environments
      const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      // Get the royalty splits
      const splits = await RoyaltyData.getRecipientRoyaltySplits(remixId);
      
      // Simulate recording payments
      for (const split of splits) {
        const paymentAmount = (amount * split.percentage) / 100;
        await RoyaltyData.recordPayment(split.splitId, paymentAmount, txHash);
      }
      
      return txHash;
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
    
    // Convert amount to wei
    const amountInWei = parseEther(amount.toString());
    
    // Distribute royalties via the contract
    const tx = await client.writeContract({
      address: ROYALTY_SPLITTER_ADDRESS as `0x${string}`,
      abi: ROYALTY_SPLITTER_ABI,
      functionName: 'splitRoyalties',
      args: [remixId],
      account,
      value: amountInWei
    });
    
    // Get the royalty splits
    const splits = await RoyaltyData.getRecipientRoyaltySplits(remixId);
    
    // Record payments
    for (const split of splits) {
      const paymentAmount = (amount * split.percentage) / 100;
      await RoyaltyData.recordPayment(split.splitId, paymentAmount, tx);
    }
    
    return tx;
  } catch (error) {
    console.error('Error distributing royalties:', error);
    throw new Error(`Failed to distribute royalties: ${error.message}`);
  }
}

/**
 * Gets royalty information for a remix
 * @param remixId The remix ID
 * @returns Royalty information
 */
export async function getRoyaltyInfo(remixId: string): Promise<{
  splits: RoyaltySplit[];
  totalPaid: number;
  lastDistribution: number | null;
}> {
  try {
    // Get the royalty splits
    const splits = await RoyaltyData.getRecipientRoyaltySplits(remixId);
    
    // Calculate total paid
    const totalPaid = splits.reduce((sum, split) => sum + split.amountPaid, 0);
    
    // Find the latest distribution timestamp
    const lastDistribution = splits.length > 0
      ? Math.max(...splits.filter(s => s.lastPaidAt).map(s => s.lastPaidAt || 0))
      : null;
    
    return {
      splits,
      totalPaid,
      lastDistribution: lastDistribution === 0 ? null : lastDistribution
    };
  } catch (error) {
    console.error('Error getting royalty info:', error);
    throw new Error(`Failed to get royalty info: ${error.message}`);
  }
}

