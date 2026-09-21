import { Redis } from '@upstash/redis'

const hasRedisCredentials = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

// In-memory fallback cache when Upstash Redis is not configured
const memoryStore = new Map<string, { value: any; expiresAt?: number }>()

const fallbackRedis = {
    async get<T = any>(key: string): Promise<T | null> {
        const item = memoryStore.get(key)
        if (!item) return null
        if (item.expiresAt && Date.now() > item.expiresAt) {
            memoryStore.delete(key)
            return null
        }
        return item.value as T
    },
    async set(key: string, value: any, opts?: { ex?: number; nx?: boolean }): Promise<'OK' | null> {
        if (opts?.nx) {
            const existing = memoryStore.get(key)
            if (existing && (!existing.expiresAt || Date.now() <= existing.expiresAt)) {
                return null
            }
        }
        const expiresAt = opts?.ex ? Date.now() + opts.ex * 1000 : undefined
        memoryStore.set(key, { value, expiresAt })
        return 'OK'
    },
    async del(key: string): Promise<number> {
        const existed = memoryStore.delete(key)
        return existed ? 1 : 0
    },
}

export const redis = hasRedisCredentials
    ? new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    : (fallbackRedis as unknown as Redis)
