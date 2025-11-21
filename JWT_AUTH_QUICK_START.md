# JWT Authentication Quick Start Guide

## 🎯 What's Been Created

I've set up a complete JWT-based authentication system to replace Clerk. Here's what's ready:

### ✅ Core Files Created

1. **`lib/auth.ts`** - Server-side JWT utilities
   - Token creation and verification
   - Password hashing with bcrypt
   - Session management
   - Cookie handling

2. **`hooks/useAuth.ts`** - Client-side authentication hook
   - Sign in/up/out functions
   - Session storage management
   - Multi-tab sync
   - Clerk-compatible `useUser()` export

3. **API Routes:**
   - `/api/auth/register` - User registration
   - `/api/auth/login` - User login
   - `/api/auth/logout` - User logout
   - `/api/auth/me` - Get current user

4. **`CLERK_TO_JWT_MIGRATION.md`** - Complete migration guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install jose bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. Add Environment Variable

Add to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-in-production
```

### 3. Update Database Schema

Add password field to User model in `prisma/schema.prisma`:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // ADD THIS LINE
  firstName     String?
  lastName      String?
  role          Role
  // ... rest of your fields
}
```

Run migration:

```bash
npx prisma migrate dev --name add_password_field
npx prisma generate
```

### 4. Update Imports in Your Components

**Replace this:**
```typescript
import { useUser } from '@clerk/nextjs';
```

**With this:**
```typescript
import { useUser } from '@/hooks/useAuth';
```

The `useUser()` hook is compatible with Clerk's API, so most of your existing code will work!

### 5. Update API Routes

**Replace this:**
```typescript
import { auth } from '@clerk/nextjs/server';
const { userId } = await auth();
```

**With this:**
```typescript
import { getSession } from '@/lib/auth';
const session = await getSession();
const userId = session?.id;
```

## 📝 Usage Examples

### Client-Side (Components)

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, isSignedIn, signIn, signOut } = useAuth();

  if (!isSignedIn) {
    return <button onClick={() => signIn('email@example.com', 'password')}>
      Sign In
    </button>;
  }

  return (
    <div>
      <p>Welcome, {user?.firstName}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Server-Side (API Routes)

```typescript
import { getSession, requireAuth } from '@/lib/auth';

// Optional authentication
export async function GET() {
  const session = await getSession();
  if (session) {
    // User is authenticated
    console.log('User ID:', session.id);
  }
}

// Required authentication
export async function POST() {
  try {
    const session = await requireAuth(); // Throws if not authenticated
    // User is definitely authenticated here
    console.log('User ID:', session.id);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

## 🔄 Migration Priority

### High Priority (Do First)
1. ✅ Install dependencies
2. ✅ Add JWT_SECRET to .env
3. ✅ Update database schema
4. ✅ Update `middleware.ts` (see migration guide)
5. ✅ Update `app/layout.tsx` (remove ClerkProvider)

### Medium Priority
6. Update `components/Navbar.tsx`
7. Update `app/auth/login/page.tsx`
8. Update `app/auth/signup/page.tsx`
9. Update API routes that use `auth()`

### Low Priority
10. Update remaining components with `useUser()`
11. Remove Clerk dependencies
12. Clean up Clerk config files

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Tokens expire after 7 days
- ✅ CSRF protection via SameSite cookies
- ✅ Secure cookies in production (HTTPS only)
- ✅ Session validation on every request

## 🧪 Testing Your Setup

1. **Test Registration:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","role":"BUYER"}'
   ```

2. **Test Login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Test Get Current User:**
   ```bash
   curl http://localhost:3000/api/auth/me \
     -H "Cookie: auth-token=YOUR_TOKEN_HERE"
   ```

## 📚 Full Documentation

See `CLERK_TO_JWT_MIGRATION.md` for:
- Complete step-by-step migration guide
- All code examples
- Middleware configuration
- Component updates
- Testing checklist
- Rollback plan

## 🆘 Need Help?

Common issues:

1. **"JWT_SECRET is not defined"** - Add it to your `.env` file
2. **"Password field doesn't exist"** - Run the Prisma migration
3. **"User is null"** - Check if auth cookie is being set
4. **"Unauthorized"** - Verify JWT_SECRET matches between requests

## 🎉 Benefits of JWT Auth

- ✅ No external dependencies
- ✅ Full control over authentication
- ✅ No monthly costs
- ✅ Works offline (after initial login)
- ✅ Faster (no external API calls)
- ✅ Better privacy (data stays on your server)
- ✅ Easier to customize

## Next Steps

1. Follow the Quick Setup above
2. Test registration and login
3. Update your components gradually
4. Remove Clerk when everything works
5. Deploy with confidence! 🚀
