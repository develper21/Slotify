/** @jest-environment node */

import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock('@/lib/auth', () => ({
    getSession: jest.fn(),
}))

const { GET } = require('@/app/api/auth/session/route') as typeof import('@/app/api/auth/session/route')
const { getSession } = require('@/lib/auth') as typeof import('@/lib/auth')
const mockGetSession = jest.mocked(getSession)

describe('GET /api/auth/session', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns 401 when there is no authenticated user', async () => {
        mockGetSession.mockResolvedValue(null)

        const response = await GET()

        expect(response.status).toBe(401)
        await expect(response.json()).resolves.toEqual({ user: null })
    })

    it('returns the current user for a valid session', async () => {
        const user = { id: 'user-1', email: 'user@example.com', role: 'customer' }
        mockGetSession.mockResolvedValue({ user })

        const response = await GET()

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ user })
    })

    it('returns 500 when session lookup fails', async () => {
        mockGetSession.mockRejectedValue(new Error('Session store unavailable'))

        const response = await GET()

        expect(response.status).toBe(500)
        await expect(response.json()).resolves.toEqual({ user: null })
    })
})
