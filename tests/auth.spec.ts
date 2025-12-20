import { test, expect, loginAsCustomer, loginAsOrganizer, loginAsAdmin } from './fixtures'

test.describe('Authentication Flow', () => {
    test('should redirect unauthenticated user to login', async ({ page }) => {
        await page.goto('/dashboard')
        await expect(page).toHaveURL('/login')
    })

    test('should redirect authenticated customer to home', async ({ page }) => {
        await loginAsCustomer(page)
        await page.goto('/')
        await expect(page).toHaveURL('/home')
    })

    test('should redirect authenticated organizer to dashboard', async ({ page }) => {
        await loginAsOrganizer(page)
        await page.goto('/')
        await expect(page).toHaveURL('/dashboard')
    })

    test('should redirect authenticated admin to admin panel', async ({ page }) => {
        await loginAsAdmin(page)
        await page.goto('/')
        await expect(page).toHaveURL('/admin')
    })
})

test.describe('Role-Based Access Control', () => {
    test('customer cannot access organizer routes', async ({ page }) => {
        await loginAsCustomer(page)
        await page.goto('/dashboard')
        await expect(page).toHaveURL('/')
    })

    test('customer cannot access admin routes', async ({ page }) => {
        await loginAsCustomer(page)
        await page.goto('/admin')
        await expect(page).toHaveURL('/')
    })

    test('organizer cannot access admin routes', async ({ page }) => {
        await loginAsOrganizer(page)
        await page.goto('/admin')
        await expect(page).toHaveURL('/dashboard')
    })

    test('organizer can access dashboard', async ({ page }) => {
        await loginAsOrganizer(page)
        await page.goto('/dashboard')
        await expect(page).toHaveURL('/dashboard')
        await expect(page.locator('h1')).toContainText('Dashboard')
    })

    test('admin can access admin panel', async ({ page }) => {
        await loginAsAdmin(page)
        await page.goto('/admin')
        await expect(page).toHaveURL('/admin')
        await expect(page.locator('h1')).toContainText('Admin')
    })
})

test.describe('Public Routes', () => {
    test('unauthenticated user can view appointment details', async ({ page }) => {
        await page.goto('/appointments/test-id')
        await expect(page).not.toHaveURL('/login')
    })

    test('unauthenticated user can access login page', async ({ page }) => {
        await page.goto('/login')
        await expect(page).toHaveURL('/login')
        await expect(page.locator('h1')).toContainText('Login')
    })

    test('unauthenticated user can access signup page', async ({ page }) => {
        await page.goto('/signup')
        await expect(page).toHaveURL('/signup')
        await expect(page.locator('h1')).toContainText('Sign Up')
    })
})
