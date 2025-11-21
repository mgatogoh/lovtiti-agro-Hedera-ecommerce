# JWT Auth - Quick Reference Card

## 🚀 Quick Start

```bash
# Start dev server
npm run dev

# Test signup
http://localhost:3000/auth/signup

# Test login
http://localhost:3000/auth/login
```

---

## 📝 Code Snippets

### Client-Side Auth Check
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isSignedIn, isLoaded } = useAuth();

if (!isLoaded) return <div>Loading...</div>;
if (!isSignedIn) return <div>Please login</div>;

return <div>Hello {user.firstName}!</div>;
```

### Server-Side Auth Check
```typescript
import { requireAuth } from '@/lib/auth';

export async function POST() {
  const session = await requireAuth();
  const userId = session.id;
  // ... your code
}
```

### Protect a Page
```typescript
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/auth/login');
    }
  }, [isLoaded, isSignedIn, router]);
  
  if (!isLoaded || !isSignedIn) return null;
  return <div>Protected content</div>;
}
```

---

## 🔑 User Object

```typescript
interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}
```

---

## 🛣️ Routes

### Auth Pages
- `/auth/signup` - Registration
- `/auth/login` - Login

### Protected Routes
- `/dashboard/*` - Requires auth
- `/cart` - Requires auth
- `/checkout` - Requires auth
- `/settings` - Requires auth

### Public Routes
- `/` - Home
- `/listings/browse` - Browse products
- `/about` - About page
- `/pricing` - Pricing

---

## 🔐 Auth Functions

### Client (hooks/useAuth.ts)
```typescript
const {
  user,           // User object or null
  isSignedIn,     // Boolean
  isLoaded,       // Boolean
  signIn,         // (email, password) => Promise
  signUp,         // (data) => Promise
  signOut,        // () => Promise
  updateUser,     // (updates) => void
} = useAuth();
```

### Server (lib/auth.ts)
```typescript
// Get session (optional)
const session = await getSession();

// Require auth (throws if not authenticated)
const session = await requireAuth();

// Get session from request
const session = await getSessionFromRequest(request);

// Create token
const token = await createToken(payload);

// Verify token
const payload = await verifyToken(token);

// Hash password
const hash = await hashPassword(password);

// Verify password
const isValid = await verifyPassword(password, hash);
```

---

## 🧪 Test Credentials

```
Email: test@example.com
Password: password123
```

---

## 📊 Migration Status

- ✅ Auth pages (signup, login)
- ✅ Middleware (route protection)
- ✅ Core components (Navbar, Cart, Checkout)
- ✅ Hooks (useAuth, useUserSync, useCartSync)
- ⚠️ Some API routes (need update)
- ❌ Tests (need update)

---

## 🐛 Debug Commands

```javascript
// Check cookie
document.cookie

// Check session storage
sessionStorage.getItem('user')

// Check if authenticated
const { isSignedIn } = useAuth();
console.log('Authenticated:', isSignedIn);
```

---

## 📁 Key Files

```
lib/auth.ts                    - JWT utilities
hooks/useAuth.ts               - Client auth hook
middleware.ts                  - Route protection
app/auth/signup/page.tsx       - Signup page
app/auth/login/page.tsx        - Login page
app/api/auth/register/route.ts - Register API
app/api/auth/login/route.ts    - Login API
```

---

## 🎯 Common Tasks

### Add Protected Route
Edit `middleware.ts`:
```typescript
const protectedRoutes = [
  '/dashboard',
  '/your-new-route', // Add here
];
```

### Add Public Route
Edit `middleware.ts`:
```typescript
const publicRoutes = [
  '/',
  '/your-public-route', // Add here
];
```

### Update API Route
```typescript
// Before (Clerk)
import { auth } from '@clerk/nextjs/server';
const { userId } = await auth();

// After (JWT)
import { requireAuth } from '@/lib/auth';
const session = await requireAuth();
const userId = session.id;
```

---

## 📚 Documentation

- `JWT_MIGRATION_SUMMARY.md` - Complete overview
- `TEST_JWT_AUTH.md` - Testing guide
- `JWT_MIGRATION_PHASE2_COMPLETE.md` - Detailed changes

---

## ✅ Quick Checklist

- [ ] JWT_SECRET in .env
- [ ] Database running
- [ ] npm run dev started
- [ ] Can register new user
- [ ] Can login
- [ ] Can logout
- [ ] Protected routes work
- [ ] Public routes work
- [ ] Session persists

---

**Ready to code!** 🚀
