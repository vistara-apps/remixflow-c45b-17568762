/**
 * User model
 */

export interface User {
  userId: string;
  walletAddress: string;
  createdAt: number;
  updatedAt: number;
  displayName?: string;
  profileImage?: string;
  bio?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

/**
 * Validates a User object
 * @param user The user object to validate
 * @returns True if valid, false otherwise
 */
export function validateUser(user: Partial<User>): boolean {
  if (!user.userId || !user.walletAddress) {
    return false;
  }
  
  if (!user.createdAt || !user.updatedAt) {
    return false;
  }
  
  return true;
}

/**
 * Creates a new User object with default values
 * @param walletAddress The wallet address of the user
 * @returns A new User object
 */
export function createUser(walletAddress: string): User {
  const timestamp = Date.now();
  
  return {
    userId: walletAddress,
    walletAddress,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

/**
 * Updates a User object
 * @param user The user object to update
 * @param updates The updates to apply
 * @returns The updated User object
 */
export function updateUser(user: User, updates: Partial<User>): User {
  return {
    ...user,
    ...updates,
    updatedAt: Date.now()
  };
}

