import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
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

    const path = req.nextUrl.pathname

    // Public routes
    const publicRoutes = ['/', '/login', '/signup', '/verify-email', '/forgot-password']
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

    // Auth routes
    const authRoutes = ['/login', '/signup', '/verify-email', '/forgot-password']
    const isAuthRoute = authRoutes.some(route => path.startsWith(route))

    // Protected routes
    const customerRoutes = ['/book', '/profile']
    const organizerRoutes = ['/dashboard', '/appointments', '/schedule', '/questions', '/misc', '/settings', '/reports']
    const adminRoutes = ['/admin', '/users', '/organizers', '/system-settings']

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

    // Redirect unauthenticated users to login
    if (!session && !isPublicRoute) {
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
