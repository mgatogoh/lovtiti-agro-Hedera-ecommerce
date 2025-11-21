# Test JWT Authentication - Quick Start Guide

## 🚀 Quick Test

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Registration
1. Visit: http://localhost:3000/auth/signup
2. Select a role (e.g., FARMER)
3. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
   - Phone: +1234567890
   - Location: Nairobi, Kenya
4. (Optional) Connect wallet or enter wallet ID
5. Click "Create Account"
6. Should redirect to dashboard

### 3. Test Login
1. Visit: http://localhost:3000/auth/login
2. Enter credentials:
   - Email: john@example.com
   - Password: password123
3. Click "Sign In"
4. Should redirect to dashboard

### 4. Test Protected Routes
1. **While logged in:**
   - Visit /dashboard - Should work ✅
   - Visit /cart - Should work ✅
   - Visit /checkout - Should work ✅
   - Visit /settings - Should work ✅

2. **Logout** (click Sign Out in navbar)

3. **While logged out:**
   - Visit /dashboard - Should redirect to login ✅
   - Visit /cart - Should redirect to login ✅
   - Visit /checkout - Should redirect to login ✅

### 5. Test Public Routes
**While logged out:**
- Visit / - Should work ✅
- Visit /listings/browse - Should work ✅
- Visit /about - Should work ✅
- Visit /pricing - Should work ✅

### 6. Test Auth Route Redirects
**While logged in:**
- Visit /auth/login - Should redirect to dashboard ✅
- Visit /auth/signup - Should redirect to dashboard ✅

---

## 🧪 Detailed Testing

### Registration Tests

#### Test 1: Valid Registration
```
Email: test1@example.com
Password: password123
Confirm: password123
Name: Test User
Phone: +1234567890
Location: Lagos, Nigeria
Role: BUYER

Expected: ✅ Account created, redirected to /dashboard/buyer
```

#### Test 2: Password Mismatch
```
Password: password123
Confirm: password456

Expected: ❌ Error: "Passwords do not match"
```

#### Test 3: Short Password
```
Password: pass123

Expected: ❌ Error: "Password must be at least 8 characters"
```

#### Test 4: Missing Fields
```
Leave email empty

Expected: ❌ Error: "Email is required"
```

#### Test 5: Duplicate Email
```
Email: test1@example.com (already registered)

Expected: ❌ Error: "User already exists"
```

### Login Tests

#### Test 1: Valid Login
```
Email: test1@example.com
Password: password123

Expected: ✅ Logged in, redirected to dashboard
```

#### Test 2: Invalid Email
```
Email: nonexistent@example.com
Password: password123

Expected: ❌ Error: "Invalid credentials"
```

#### Test 3: Invalid Password
```
Email: test1@example.com
Password: wrongpassword

Expected: ❌ Error: "Invalid credentials"
```

### Middleware Tests

#### Test 1: Protected Route Without Auth
```
1. Logout
2. Visit: http://localhost:3000/dashboard

Expected: ✅ Redirected to /auth/login?redirect=/dashboard
```

#### Test 2: Login Preserves Redirect
```
1. From above, login
2. After successful login

Expected: ✅ Redirected to /dashboard (the intended page)
```

#### Test 3: Auth Route When Logged In
```
1. Login as FARMER
2. Visit: http://localhost:3000/auth/login

Expected: ✅ Redirected to /dashboard/farmer
```

### Session Tests

#### Test 1: Session Persistence
```
1. Login
2. Refresh page
3. Check navbar

Expected: ✅ Still logged in, user info displayed
```

#### Test 2: Multi-Tab Sync
```
1. Login in Tab 1
2. Open Tab 2
3. Check navbar in Tab 2

Expected: ✅ User info displayed in both tabs
```

#### Test 3: Logout Sync
```
1. Login in Tab 1 and Tab 2
2. Logout in Tab 1
3. Check Tab 2

Expected: ✅ Tab 2 also shows logged out state
```

### Wallet Integration Tests

#### Test 1: MetaMask Connection
```
1. During signup, click "Connect MetaMask"
2. Approve in MetaMask

Expected: ✅ Wallet address displayed, can proceed
```

#### Test 2: Manual Wallet Entry
```
1. During signup, enter wallet ID manually
2. Enter: 0.0.123456

Expected: ✅ Wallet ID accepted, can proceed
```

#### Test 3: Optional Wallet
```
1. During signup, skip wallet connection
2. Complete registration

Expected: ✅ Account created without wallet
```

---

## 🔍 Debugging

### Check JWT Token
```javascript
// In browser console
document.cookie
// Should see: auth-token=...
```

### Check Session Storage
```javascript
// In browser console
sessionStorage.getItem('user')
// Should see user data JSON
```

### Check Network Requests
1. Open DevTools → Network tab
2. Login
3. Check requests:
   - POST /api/auth/login - Should return 200
   - Response should include user data

### Check Middleware
1. Visit protected route while logged out
2. Check Network tab:
   - Should see redirect (307)
   - Location header: /auth/login?redirect=...

---

## 🐛 Common Issues

### Issue 1: "Unauthorized" on API Routes
**Cause**: JWT token not being sent
**Fix**: Check cookie settings in lib/auth.ts

### Issue 2: Redirect Loop
**Cause**: Middleware misconfiguration
**Fix**: Check route arrays in middleware.ts

### Issue 3: Session Not Persisting
**Cause**: Cookie not being set
**Fix**: Check setAuthCookie in lib/auth.ts

### Issue 4: "User already exists"
**Cause**: Email already registered
**Fix**: Use different email or check database

### Issue 5: Password Validation Fails
**Cause**: Password too short
**Fix**: Use at least 8 characters

---

## 📊 Test Results Template

```
✅ Registration with valid data
✅ Registration with invalid data (shows errors)
✅ Login with valid credentials
✅ Login with invalid credentials (shows error)
✅ Protected routes redirect when not authenticated
✅ Auth routes redirect when authenticated
✅ Public routes accessible without auth
✅ Session persists across page refresh
✅ Multi-tab session sync
✅ Logout clears session
✅ Navbar shows user info when logged in
✅ Navbar shows login/signup when logged out
✅ Cart requires authentication
✅ Checkout requires authentication
✅ Wallet connection works (optional)
✅ Role-based dashboard redirect
```

---

## 🎯 Success Criteria

All tests should pass:
- ✅ Can register new user
- ✅ Can login existing user
- ✅ Can logout
- ✅ Protected routes are protected
- ✅ Public routes are accessible
- ✅ Session persists
- ✅ Redirects work correctly
- ✅ Error messages display
- ✅ UI is responsive
- ✅ No console errors

---

## 📝 Report Issues

If you find any issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Check Network tab for failed requests
4. Check the error message displayed
5. Document and report

---

**Ready to Test!** 🚀

Start with the Quick Test section above, then move to Detailed Testing if needed.
