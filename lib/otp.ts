import { randomInt } from 'crypto'
import { redis } from './redis'

export function generateOTP(): string {
  return randomInt(10000000, 99999999).toString()
}

export async function saveOTP(email: string, otp: string, purpose: string): Promise<void> {
  const key = `otp:${purpose}:${email}`
  await redis.set(key, otp, { ex: 600 })
}

export async function verifyOTP(email: string, otp: string, purpose: string): Promise<boolean> {
  const key = `otp:${purpose}:${email}`
  const storedOtp = await redis.get<string>(key)

  if (storedOtp && storedOtp === otp) {
    await redis.del(key)
    return true
  }

  return false
}
