import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

export async function proxy(req: NextRequest) {
    const res = NextResponse.next()
    const path = req.nextUrl.pathname
    const session = await getSession()

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
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (session && (path === '/login' || path === '/signup')) {
        const role = session.user.role
        if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', req.url))
        if (role === 'organizer') return NextResponse.redirect(new URL('/dashboard', req.url))
        return NextResponse.redirect(new URL('/home', req.url))
    }

    return res
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}