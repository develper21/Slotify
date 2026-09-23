import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Edge-safe session verification (proxy runtime cannot use next/headers cookies()).
const secretKey = process.env.JWT_SECRET || 'your-fallback-secret-key'
const key = new TextEncoder().encode(secretKey)

async function getSessionFromRequest(req: NextRequest) {
    const token = req.cookies.get('session')?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
        const user = payload.user as { id?: string; email?: string; role?: string } | undefined
        if (!user?.id) return null

        // Expired session?
        const expires = payload.expires ? new Date(payload.expires as string) : null
        if (expires && expires < new Date()) return null

        return { id: user.id, email: user.email || '', role: user.role || 'customer' }
    } catch {
        return null
    }
}

export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname
    const session = await getSessionFromRequest(req)

    const publicPrefixes = [
        '/login',
        '/signup',
        '/verify-email',
        '/forgot-password',
        '/reset-password',
        '/appointments',
        '/home',
        '/book',
        '/api',
        '/misc',
    ]

    const isPublicRoute =
        path === '/' ||
        publicPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))

    if (!session && !isPublicRoute) {
        const loginUrl = new URL('/login', req.url)
        loginUrl.searchParams.set('next', path)
        return NextResponse.redirect(loginUrl)
    }

    // Layer 1 (Edge) role protection for sensitive dashboard areas
    const role = session?.role
    if (session && path.startsWith('/dashboard/admin')) {
        if (role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    if (
        session &&
        (path.startsWith('/dashboard/appointments') || path.startsWith('/dashboard/questions'))
    ) {
        if (role !== 'organizer' && role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    if (session && (path === '/login' || path === '/signup')) {
        if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', req.url))
        if (role === 'organizer') return NextResponse.redirect(new URL('/dashboard', req.url))
        return NextResponse.redirect(new URL('/home', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
