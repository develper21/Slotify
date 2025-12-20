import { test as base, expect } from '@playwright/test'

// Extend base test with custom fixtures
export const test = base.extend({
    // Add custom fixtures here if needed
})

export { expect }

// Custom test helpers
export const testConfig = {
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    timeout: 30000,
}

// Helper functions for authentication
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
