/**
 * API route for user management
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserData } from '@/utils/dataUtils';
import { User, validateUser, createUser } from '@/models';

/**
 * GET /api/users/:userId
 * Get a user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const user = await UserData.getUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await UserData.getUser(body.walletAddress);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const user = createUser(body.walletAddress);
    
    // Add additional fields if provided
    if (body.displayName) user.displayName = body.displayName;
    if (body.profileImage) user.profileImage = body.profileImage;
    if (body.bio) user.bio = body.bio;
    if (body.email) user.email = body.email;
    if (body.socialLinks) user.socialLinks = body.socialLinks;
    
    // Validate user
    if (!validateUser(user)) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      );
    }
    
    // Save user
    const success = await UserData.createUser(user);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/:userId
 * Update a user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await UserData.getUser(userId);
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user
    const updatedUser = await UserData.updateUser(userId, body);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

