// Simple in-memory rate limiter for auth routes
// For production, use Redis or Upstash

interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key]
        }
    })
}, 5 * 60 * 1000)

export interface RateLimitConfig {
    maxRequests: number
    windowMs: number
}

export interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    reset: number
}

/**
 * Simple rate limiter
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }
): RateLimitResult {
    const now = Date.now()
    const key = `${identifier}`

    // Initialize or reset if window expired
    if (!store[key] || store[key].resetTime < now) {
        store[key] = {
            count: 0,
            resetTime: now + config.windowMs,
        }
    }

    // Increment count
    store[key].count++

    const remaining = Math.max(0, config.maxRequests - store[key].count)
    const success = store[key].count <= config.maxRequests

    return {
        success,
        limit: config.maxRequests,
        remaining,
        reset: store[key].resetTime,
    }
}

/**
 * Rate limit configurations for different routes
 */
export const rateLimitConfigs = {
    // Auth routes - more lenient for development
    login: { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
    signup: { maxRequests: 5, windowMs: 60000 }, // 5 requests per minute
    forgotPassword: { maxRequests: 5, windowMs: 60000 }, // 5 requests per minute (changed from 5 min to 1 min)

    // API routes - moderate limits
    api: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute

    // General routes - lenient limits
    general: { maxRequests: 200, windowMs: 60000 }, // 200 requests per minute
}

/**
 * Get client identifier from request
 * Uses IP address or user ID if authenticated
 */
export function getClientIdentifier(req: Request, userId?: string): string {
    if (userId) return `user:${userId}`

    // Try to get IP from various headers
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const cfConnectingIp = req.headers.get('cf-connecting-ip')

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
    return `ip:${ip}`
}

/**
 * Clear rate limit for an identifier (development only)
 * @param identifier - Client identifier to clear
 */
export function clearRateLimit(identifier: string): void {
    delete store[identifier]
}

/**
 * Clear all rate limits (development only)
 */
export function clearAllRateLimits(): void {
    Object.keys(store).forEach(key => delete store[key])
}
