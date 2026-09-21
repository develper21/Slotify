// MOCK SESSION WRAPPER FOR DEVELOPMENT

export * from './mock-data'
import { MOCK_USER, MOCK_ADMIN, MOCK_CUSTOMER } from './mock-data'

export function getMockUser(role?: string) {
    if (role === 'admin') return MOCK_ADMIN
    if (role === 'customer') return MOCK_CUSTOMER
    return MOCK_USER
}

export const IS_MOCK_MODE = true // Toggle this to disconnect/reconnect Supabase
