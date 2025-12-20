import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const path = req.nextUrl.pathname

    // Public routes - no authentication required
    const publicRoutes = ['/', '/login', '/signup', '/verify-email', '/forgot-password', '/reset-password', '/appointments']
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

    // Allow access to all routes without authentication for now
    return res
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}