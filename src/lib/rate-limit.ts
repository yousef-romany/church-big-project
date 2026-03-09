import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting
// In production, consider using Redis or another persistent store
const rateLimitStore: RateLimitStore = {};

export function createRateLimit(options: {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}) {
  const { windowMs, maxRequests } = options;

  return {
    check: (request: NextRequest, identifier?: string): { success: boolean; remaining: number } => {
      // Use IP address or provided identifier for rate limiting
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
      const key = identifier || ip || 'unknown';
      const now = Date.now();

      // Clean up expired entries
      if (rateLimitStore[key] && rateLimitStore[key].resetTime < now) {
        delete rateLimitStore[key];
      }

      // Initialize or update rate limit entry
      if (!rateLimitStore[key]) {
        rateLimitStore[key] = {
          count: 0,
          resetTime: now + windowMs,
        };
      }

      // Check if rate limit exceeded
      if (rateLimitStore[key].count >= maxRequests) {
        return {
          success: false,
          remaining: 0,
        };
      }

      // Increment request count
      rateLimitStore[key].count++;

      return {
        success: true,
        remaining: maxRequests - rateLimitStore[key].count,
      };
    },

    // Helper to create rate limit response
    rateLimitResponse: (message?: string) => {
      return NextResponse.json(
        { message: message || 'طلبات كثيرة جدًا. يرجى المحاولة مرة أخرى لاحقًا.' },
        { status: 429 }
      );
    },

    // Clean up expired entries periodically (call this from time to time)
    cleanup: () => {
      const now = Date.now();
      Object.keys(rateLimitStore).forEach((key) => {
        if (rateLimitStore[key].resetTime < now) {
          delete rateLimitStore[key];
        }
      });
    },
  };
}

// Pre-configured rate limits for different endpoints
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
});

export const emailRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 emails per hour
});

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    authRateLimit.cleanup();
    emailRateLimit.cleanup();
  }, 5 * 60 * 1000);
}