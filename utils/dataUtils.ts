/**
 * Data utilities for RemixFlow
 * Provides functions for interacting with Redis and managing data models
 */

import { Redis } from '@upstash/redis';
import { User, OriginalContent, Remix, RoyaltySplit } from '@/models';

// Initialize Redis client
const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || '',
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * User data operations
 */
export const UserData = {
  /**
   * Get a user by ID
   * @param userId The user ID
   * @returns The user object or null if not found
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      const user = await redis.hgetall(`user:${userId}`);
      return user as User || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Create a new user
   * @param user The user object to create
   * @returns True if successful, false otherwise
   */
  async createUser(user: User): Promise<boolean> {
    try {
      await redis.hset(`user:${user.userId}`, user);
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  },

  /**
   * Update a user
   * @param userId The user ID
   * @param updates The updates to apply
   * @returns The updated user object or null if not found
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const user = await this.getUser(userId);
      if (!user) return null;

      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: Date.now()
      };

      await redis.hset(`user:${userId}`, updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  /**
   * Get all remixes for a user
   * @param userId The user ID
   * @returns Array of remix IDs
   */
  async getUserRemixes(userId: string): Promise<string[]> {
    try {
      return await redis.smembers(`user:${userId}:remixes`);
    } catch (error) {
      console.error('Error getting user remixes:', error);
      return [];
    }
  }
};

/**
 * Content data operations
 */
export const ContentData = {
  /**
   * Get original content by ID
   * @param contentId The content ID
   * @returns The content object or null if not found
   */
  async getContent(contentId: string): Promise<OriginalContent | null> {
    try {
      const content = await redis.hgetall(`content:${contentId}`);
      return content as OriginalContent || null;
    } catch (error) {
      console.error('Error getting content:', error);
      return null;
    }
  },

  /**
   * Create new original content
   * @param content The content object to create
   * @returns True if successful, false otherwise
   */
  async createContent(content: OriginalContent): Promise<boolean> {
    try {
      await redis.hset(content.contentId, content);
      await redis.sadd(`user:${content.ownerAddress}:content`, content.contentId);
      return true;
    } catch (error) {
      console.error('Error creating content:', error);
      return false;
    }
  },

  /**
   * Update original content
   * @param contentId The content ID
   * @param updates The updates to apply
   * @returns The updated content object or null if not found
   */
  async updateContent(contentId: string, updates: Partial<OriginalContent>): Promise<OriginalContent | null> {
    try {
      const content = await this.getContent(contentId);
      if (!content) return null;

      const updatedContent = {
        ...content,
        ...updates,
        updatedAt: Date.now()
      };

      await redis.hset(contentId, updatedContent);
      return updatedContent;
    } catch (error) {
      console.error('Error updating content:', error);
      return null;
    }
  },

  /**
   * Get all remixes for original content
   * @param contentId The content ID
   * @returns Array of remix IDs
   */
  async getContentRemixes(contentId: string): Promise<string[]> {
    try {
      return await redis.smembers(`content:${contentId}:remixes`);
    } catch (error) {
      console.error('Error getting content remixes:', error);
      return [];
    }
  },

  /**
   * Get all content for a user
   * @param userId The user ID
   * @returns Array of content IDs
   */
  async getUserContent(userId: string): Promise<string[]> {
    try {
      return await redis.smembers(`user:${userId}:content`);
    } catch (error) {
      console.error('Error getting user content:', error);
      return [];
    }
  }
};

/**
 * Remix data operations
 */
export const RemixData = {
  /**
   * Get a remix by ID
   * @param remixId The remix ID
   * @returns The remix object or null if not found
   */
  async getRemix(remixId: string): Promise<Remix | null> {
    try {
      const remix = await redis.hgetall(remixId);
      return remix as Remix || null;
    } catch (error) {
      console.error('Error getting remix:', error);
      return null;
    }
  },

  /**
   * Create a new remix
   * @param remix The remix object to create
   * @returns True if successful, false otherwise
   */
  async createRemix(remix: Remix): Promise<boolean> {
    try {
      await redis.hset(remix.remixId, remix);
      await redis.sadd(`user:${remix.creatorAddress}:remixes`, remix.remixId);
      await redis.sadd(`content:${remix.originalContentId}:remixes`, remix.remixId);
      return true;
    } catch (error) {
      console.error('Error creating remix:', error);
      return false;
    }
  },

  /**
   * Update a remix
   * @param remixId The remix ID
   * @param updates The updates to apply
   * @returns The updated remix object or null if not found
   */
  async updateRemix(remixId: string, updates: Partial<Remix>): Promise<Remix | null> {
    try {
      const remix = await this.getRemix(remixId);
      if (!remix) return null;

      const updatedRemix = {
        ...remix,
        ...updates
      };

      await redis.hset(remixId, updatedRemix);
      return updatedRemix;
    } catch (error) {
      console.error('Error updating remix:', error);
      return null;
    }
  },

  /**
   * Get all remixes
   * @param limit Maximum number of remixes to return
   * @param offset Offset for pagination
   * @returns Array of remix objects
   */
  async getAllRemixes(limit: number = 10, offset: number = 0): Promise<Remix[]> {
    try {
      // This is a simplified implementation
      // In a real app, you would use a more efficient approach
      const keys = await redis.keys('remix:*');
      const paginatedKeys = keys.slice(offset, offset + limit);
      
      const remixes: Remix[] = [];
      for (const key of paginatedKeys) {
        const remix = await this.getRemix(key);
        if (remix) remixes.push(remix);
      }
      
      return remixes;
    } catch (error) {
      console.error('Error getting all remixes:', error);
      return [];
    }
  },

  /**
   * Get royalty splits for a remix
   * @param remixId The remix ID
   * @returns Array of royalty split objects
   */
  async getRemixRoyaltySplits(remixId: string): Promise<RoyaltySplit[]> {
    try {
      const keys = await redis.keys(`split:${remixId}:*`);
      
      const splits: RoyaltySplit[] = [];
      for (const key of keys) {
        const split = await redis.hgetall(key);
        if (split) splits.push(split as RoyaltySplit);
      }
      
      return splits;
    } catch (error) {
      console.error('Error getting remix royalty splits:', error);
      return [];
    }
  }
};

/**
 * Royalty split data operations
 */
export const RoyaltyData = {
  /**
   * Get a royalty split by ID
   * @param splitId The split ID
   * @returns The split object or null if not found
   */
  async getRoyaltySplit(splitId: string): Promise<RoyaltySplit | null> {
    try {
      const split = await redis.hgetall(splitId);
      return split as RoyaltySplit || null;
    } catch (error) {
      console.error('Error getting royalty split:', error);
      return null;
    }
  },

  /**
   * Create a new royalty split
   * @param split The split object to create
   * @returns True if successful, false otherwise
   */
  async createRoyaltySplit(split: RoyaltySplit): Promise<boolean> {
    try {
      await redis.hset(split.splitId, split);
      return true;
    } catch (error) {
      console.error('Error creating royalty split:', error);
      return false;
    }
  },

  /**
   * Update a royalty split
   * @param splitId The split ID
   * @param updates The updates to apply
   * @returns The updated split object or null if not found
   */
  async updateRoyaltySplit(splitId: string, updates: Partial<RoyaltySplit>): Promise<RoyaltySplit | null> {
    try {
      const split = await this.getRoyaltySplit(splitId);
      if (!split) return null;

      const updatedSplit = {
        ...split,
        ...updates
      };

      await redis.hset(splitId, updatedSplit);
      return updatedSplit;
    } catch (error) {
      console.error('Error updating royalty split:', error);
      return null;
    }
  },

  /**
   * Record a payment to a royalty split
   * @param splitId The split ID
   * @param amount The amount paid
   * @param txHash The transaction hash
   * @returns The updated split object or null if not found
   */
  async recordPayment(splitId: string, amount: number, txHash: string): Promise<RoyaltySplit | null> {
    try {
      const split = await this.getRoyaltySplit(splitId);
      if (!split) return null;

      const timestamp = Date.now();
      const transactions = [...(split.transactions || []), {
        txHash,
        amount,
        timestamp
      }];

      const updatedSplit = {
        ...split,
        amountPaid: split.amountPaid + amount,
        lastPaidAt: timestamp,
        transactions
      };

      await redis.hset(splitId, updatedSplit);
      return updatedSplit;
    } catch (error) {
      console.error('Error recording payment:', error);
      return null;
    }
  },

  /**
   * Get all royalty splits for a recipient
   * @param recipientAddress The recipient address
   * @returns Array of split objects
   */
  async getRecipientRoyaltySplits(recipientAddress: string): Promise<RoyaltySplit[]> {
    try {
      // This is a simplified implementation
      // In a real app, you would use a more efficient approach
      const keys = await redis.keys('split:*');
      
      const splits: RoyaltySplit[] = [];
      for (const key of keys) {
        const split = await this.getRoyaltySplit(key);
        if (split && split.recipientAddress === recipientAddress) {
          splits.push(split);
        }
      }
      
      return splits;
    } catch (error) {
      console.error('Error getting recipient royalty splits:', error);
      return [];
    }
  }
};

