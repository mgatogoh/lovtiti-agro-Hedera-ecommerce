import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/listings/create',
  '/checkout',
  '/cart',
];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/auth/login-jwt', '/auth/signup-jwt', '/auth/login', '/auth/signup'];

// Public routes that don't need authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/help',
  '/privacy',
  '/terms',
  '/pricing',
  '/learn-more',
  '/services',
  '/listings/browse',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_') ||
    pathname.includes('.') && !pathname.includes('/api/')
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
    const url = new URL('/auth/login-jwt', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    // Get user role from session and redirect to appropriate dashboard
    const role = session.role?.toLowerCase() || 'buyer';
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  // Allow access to public routes and API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
