/**
 * Middleware for authentication and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client for rate limiting
const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || '',
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || '',
});

// Rate limit configuration
const RATE_LIMIT_REQUESTS = 100; // Number of requests
const RATE_LIMIT_WINDOW = 60 * 60; // Time window in seconds (1 hour)

/**
 * Middleware function
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get client IP
  const ip = request.ip || 'anonymous';
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;");
  
  // Skip rate limiting for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return response;
  }
  
  // Apply rate limiting for API routes
  const rateLimitKey = `rate-limit:${ip}`;
  
  try {
    // Get current count
    const currentCount = await redis.get(rateLimitKey) as number || 0;
    
    // Check if rate limit exceeded
    if (currentCount >= RATE_LIMIT_REQUESTS) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + RATE_LIMIT_WINDOW).toString(),
          },
        }
      );
    }
    
    // Increment count
    await redis.incr(rateLimitKey);
    
    // Set expiry if not already set
    if (currentCount === 0) {
      await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW);
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_REQUESTS - currentCount - 1).toString());
    response.headers.set('X-RateLimit-Reset', (Math.floor(Date.now() / 1000) + RATE_LIMIT_WINDOW).toString());
    
    return response;
  } catch (error) {
    console.error('Error applying rate limit:', error);
    
    // Allow request to proceed if rate limiting fails
    return response;
  }
}

/**
 * Configure which paths should be processed by the middleware
 */
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to specific pages that need protection
    '/dashboard/:path*',
    '/remix/:path*',
  ],
};

