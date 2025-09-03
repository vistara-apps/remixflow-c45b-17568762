/**
 * RoyaltySplit model
 */

export interface RoyaltySplit {
  splitId: string;
  remixId: string;
  recipientAddress: string;
  percentage: number;
  amountPaid: number;
  createdAt: number;
  lastPaidAt?: number;
  transactions?: {
    txHash: string;
    amount: number;
    timestamp: number;
  }[];
}

/**
 * Validates a RoyaltySplit object
 * @param split The split object to validate
 * @returns True if valid, false otherwise
 */
export function validateRoyaltySplit(split: Partial<RoyaltySplit>): boolean {
  if (!split.splitId || !split.remixId || !split.recipientAddress) {
    return false;
  }
  
  if (split.percentage === undefined || split.percentage <= 0 || split.percentage > 100) {
    return false;
  }
  
  if (split.amountPaid === undefined || split.amountPaid < 0) {
    return false;
  }
  
  if (!split.createdAt) {
    return false;
  }
  
  return true;
}

/**
 * Creates a new RoyaltySplit object with default values
 * @param params Parameters for the new split
 * @returns A new RoyaltySplit object
 */
export function createRoyaltySplit(params: {
  remixId: string;
  recipientAddress: string;
  percentage: number;
}): RoyaltySplit {
  const timestamp = Date.now();
  const splitId = `split:${params.remixId}:${params.recipientAddress}`;
  
  return {
    splitId,
    remixId: params.remixId,
    recipientAddress: params.recipientAddress,
    percentage: params.percentage,
    amountPaid: 0,
    createdAt: timestamp,
    transactions: []
  };
}

/**
 * Updates a RoyaltySplit object
 * @param split The split object to update
 * @param updates The updates to apply
 * @returns The updated RoyaltySplit object
 */
export function updateRoyaltySplit(split: RoyaltySplit, updates: Partial<RoyaltySplit>): RoyaltySplit {
  return {
    ...split,
    ...updates
  };
}

/**
 * Records a payment to a RoyaltySplit
 * @param split The split object to update
 * @param amount The amount paid
 * @param txHash The transaction hash
 * @returns The updated RoyaltySplit object
 */
export function recordPayment(split: RoyaltySplit, amount: number, txHash: string): RoyaltySplit {
  const timestamp = Date.now();
  
  const transactions = [...(split.transactions || []), {
    txHash,
    amount,
    timestamp
  }];
  
  return {
    ...split,
    amountPaid: split.amountPaid + amount,
    lastPaidAt: timestamp,
    transactions
  };
}

