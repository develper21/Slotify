import { test as base, expect } from '@playwright/test'

export const test = base.extend({})
export { expect }

export const testConfig = {
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    timeout: 30000,
}

export async function loginAsCustomer(page: any) {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'customer@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/home')
}

export async function loginAsOrganizer(page: any) {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'organizer@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
}

export async function loginAsAdmin(page: any) {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
}
