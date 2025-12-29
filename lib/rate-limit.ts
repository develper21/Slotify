interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

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
export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }
): RateLimitResult {
    const now = Date.now()
    const key = `${identifier}`

    if (!store[key] || store[key].resetTime < now) {
        store[key] = {
            count: 0,
            resetTime: now + config.windowMs,
        }
    }

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

export const rateLimitConfigs = {
    login: { maxRequests: 10, windowMs: 60000 },
    signup: { maxRequests: 5, windowMs: 60000 },
    forgotPassword: { maxRequests: 5, windowMs: 60000 },

    api: { maxRequests: 100, windowMs: 60000 },

    general: { maxRequests: 200, windowMs: 60000 },
}

export function getClientIdentifier(req: Request, userId?: string): string {
    if (userId) return `user:${userId}`

    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const cfConnectingIp = req.headers.get('cf-connecting-ip')

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
    return `ip:${ip}`
}

export function clearRateLimit(identifier: string): void {
    delete store[identifier]
}

export function clearAllRateLimits(): void {
    Object.keys(store).forEach(key => delete store[key])
}
