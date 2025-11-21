# Clerk to JWT Authentication Migration Guide

This guide outlines the steps to migrate from Clerk authentication to a JWT-based local authentication system.

## ✅ Completed Steps

### 1. Core Authentication Infrastructure Created
- ✅ `lib/auth.ts` - Server-side JWT utilities
- ✅ `hooks/useAuth.ts` - Client-side authentication hook

## 📋 Required Steps

### Step 1: Install Dependencies

```bash
npm install jose bcryptjs
npm install --save-dev @types/bcryptjs
```

### Step 2: Update Environment Variables

Add to `.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
```

Remove Clerk variables:
```env
# Remove these:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
# CLERK_SECRET_KEY=...
```

### Step 3: Update Prisma Schema

Add password field to User model:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Add this field
  firstName     String?
  lastName      String?
  role          Role
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // ... rest of fields
}
```

Run migration:
```bash
npx prisma migrate dev --name add_password_field
npx prisma generate
```

### Step 4: Create Authentication API Routes

Create these files:

#### `/app/api/auth/register/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role } = await request.json();

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    });

    // Create JWT token
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
```

#### `/app/api/auth/login/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
```

#### `/app/api/auth/logout/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}
```

#### `/app/api/auth/me/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: session });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Failed to get user' },
      { status: 500 }
    );
  }
}
```

### Step 5: Update Middleware

Replace `middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/listings/create',
  '/checkout',
];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/auth/login', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
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

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Step 6: Update Layout

Replace `app/layout.tsx`:

```typescript
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lovtiti Agro Mart",
  description: "Blockchain-powered agricultural marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

### Step 7: Update Components

#### Replace Clerk imports in components:

**Before:**
```typescript
import { useUser } from '@clerk/nextjs';
```

**After:**
```typescript
import { useUser } from '@/hooks/useAuth';
```

#### Update Navbar component:

Replace Clerk components with custom auth:

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// In your Navbar component:
const { user, isSignedIn, signOut } = useAuth();

// Replace SignedIn/SignedOut with:
{isSignedIn ? (
  <div className="flex items-center gap-4">
    <span>{user?.firstName || user?.email}</span>
    <Button onClick={signOut}>Sign Out</Button>
  </div>
) : (
  <div className="flex items-center gap-4">
    <Link href="/auth/login">
      <Button variant="outline">Sign In</Button>
    </Link>
    <Link href="/auth/signup">
      <Button>Get Started</Button>
    </Link>
  </div>
)}
```

### Step 8: Update API Routes

Replace all instances of:

**Before:**
```typescript
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
```

**After:**
```typescript
import { getSession, requireAuth } from '@/lib/auth';

// For optional auth:
const session = await getSession();
const userId = session?.id;

// For required auth:
const session = await requireAuth();
const userId = session.id;
```

### Step 9: Update Auth Pages

#### `/app/auth/login/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-green-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### Step 10: Files to Update

Update these files to replace Clerk imports with `useAuth`:

1. ✅ `hooks/useCartSync.ts` - Replace `useUser` import
2. ✅ `hooks/useUserSync.ts` - Replace `useUser` import
3. ✅ `components/Navbar.tsx` - Replace Clerk components
4. ✅ `components/StreamProvider.tsx` - Replace `useUser` import
5. ✅ `app/cart/page.tsx` - Replace `useUser` import
6. ✅ `app/checkout/page.tsx` - Replace `useUser` import
7. ✅ `app/listings/create/page.tsx` - Replace `useUser` import
8. ✅ `app/debug-user/page.tsx` - Replace `useUser` import
9. ✅ All API routes - Replace `auth()` with `getSession()`

### Step 11: Remove Clerk Dependencies

```bash
npm uninstall @clerk/nextjs
```

Remove Clerk configuration files:
- `lib/clerk-config.ts`
- `.cursorrules/clerkrules.md`
- `app/api/auth/clerk/route.ts`

## Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Protected routes redirect to login
- [ ] Auth routes redirect to dashboard when logged in
- [ ] Session persists across page refreshes
- [ ] API routes check authentication correctly
- [ ] Cart syncs with authenticated user
- [ ] User profile displays correctly

## Rollback Plan

If issues occur:
1. Reinstall Clerk: `npm install @clerk/nextjs`
2. Restore `middleware.ts` from git
3. Restore `app/layout.tsx` from git
4. Remove password field from database

## Notes

- JWT tokens are stored in HTTP-only cookies for security
- User data is cached in sessionStorage for quick access
- Passwords are hashed with bcrypt (10 rounds)
- Tokens expire after 7 days
- Multi-tab sync is supported via storage events
