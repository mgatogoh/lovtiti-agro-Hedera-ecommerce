// JWT-based authentication middleware
// Rename this file to middleware.ts to activate it

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/settings',
    '/listings/create',
    '/checkout',
    '/farmer',
    '/onboarding',
];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/auth/login', '/auth/signup'];

// Public routes that don't need any checks
const publicRoutes = [
    '/',
    '/about',
    '/listings/browse',
    '/pricing',
    '/learn-more',
    '/contact',
    '/help',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes, static files, and images
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)
    ) {
        return NextResponse.next();
    }

    // Get session
    const session = await getSessionFromRequest(request);
    const isAuthenticated = !!session;

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if route is auth route
    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if route is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(route)
    );

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // Redirect to dashboard if accessing auth routes while authenticated
    if (isAuthRoute && isAuthenticated) {
        // Redirect to role-specific dashboard
        const dashboardPath = getDashboardPath(session.role);
        return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Add user info to headers for server components
    if (isAuthenticated && session) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', session.id);
        requestHeaders.set('x-user-role', session.role);
        requestHeaders.set('x-user-email', session.email);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

function getDashboardPath(role: string): string {
    const roleToPath: { [key: string]: string } = {
        'FARMER': '/dashboard/farmer',
        'BUYER': '/dashboard/buyer',
        'DISTRIBUTOR': '/dashboard/distributor',
        'TRANSPORTER': '/dashboard/transporter',
        'AGROEXPERT': '/dashboard/agro-vet',
        'ADMIN': '/dashboard/farmer',
    };

    return roleToPath[role] || '/dashboard/buyer';
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes (handled separately)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public directory)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};
