import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database.types'
import { rateLimit, rateLimitConfigs, getClientIdentifier } from '@/lib/rate-limit'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const path = req.nextUrl.pathname

    // Apply rate limiting ONLY to POST requests on auth routes
    const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']
    const isAuthRoute = authRoutes.some(route => path.startsWith(route))
    const isPostRequest = req.method === 'POST'

    if (isAuthRoute && isPostRequest) {
        const identifier = getClientIdentifier(req)
        let config = rateLimitConfigs.general

        if (path.startsWith('/login')) config = rateLimitConfigs.login
        else if (path.startsWith('/signup')) config = rateLimitConfigs.signup
        else if (path.startsWith('/forgot-password')) config = rateLimitConfigs.forgotPassword

        const rateLimitResult = rateLimit(identifier, config)

        if (!rateLimitResult.success) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Too many requests. Please try again later.',
                    retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
                        'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
                    },
                }
            )
        }

        // Add rate limit headers to response
        res.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
        res.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
        res.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString())
    }

    const supabase = createMiddlewareClient<Database>({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Get user role if authenticated
    let userRole: string | null = null
    if (session?.user) {
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

        userRole = userData?.role || null
    }

    // Public routes (no authentication required)
    const publicRoutes = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password']
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

    // Allow public access to home page and appointment details (for browsing)
    const isHomePage = path === '/'
    const isAppointmentDetail = path.match(/^\/appointments\/[^\/]+$/) // /appointments/[id] only
    const isPubliclyAccessible = isPublicRoute || isHomePage || isAppointmentDetail

    // Protected routes by role
    const customerRoutes = ['/book', '/profile']
    const organizerRoutes = ['/dashboard', '/appointments', '/schedule', '/questions', '/misc', '/settings', '/reports', '/bookings']
    const adminRoutes = ['/admin']

    // Redirect authenticated users away from auth pages
    if (session && isAuthRoute) {
        if (userRole === 'admin') {
            return NextResponse.redirect(new URL('/admin', req.url))
        } else if (userRole === 'organizer') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        } else {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    // Redirect unauthenticated users to login (except for publicly accessible pages)
    if (!session && !isPubliclyAccessible) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // Role-based route protection
    if (session && userRole) {
        // Customer trying to access organizer/admin routes
        if (userRole === 'customer') {
            if (organizerRoutes.some(route => path.startsWith(route)) ||
                adminRoutes.some(route => path.startsWith(route))) {
                return NextResponse.redirect(new URL('/', req.url))
            }
        }

        // Organizer trying to access admin routes
        if (userRole === 'organizer') {
            if (adminRoutes.some(route => path.startsWith(route))) {
                return NextResponse.redirect(new URL('/dashboard', req.url))
            }
        }

        // Admin trying to access customer/organizer routes (optional, remove if admins should have access)
        // if (userRole === 'admin') {
        //   if (customerRoutes.some(route => path.startsWith(route)) || 
        //       organizerRoutes.some(route => path.startsWith(route))) {
        //     return NextResponse.redirect(new URL('/admin', req.url))
        //   }
        // }
    }

    return res
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
