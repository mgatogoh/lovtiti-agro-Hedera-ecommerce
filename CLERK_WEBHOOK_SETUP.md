# Clerk Webhook Setup Guide

## 🚨 Issue: Users Not Being Saved to Database

When you sign in with Google, the user is not being recorded in the Neon database. This is because the Clerk webhook isn't configured properly.

## ✅ Database is Working

We've confirmed that:
- ✅ Database connectivity is working
- ✅ Manual user creation works
- ✅ Users can be saved to the database
- ❌ Clerk webhook is not triggering on Google sign-in

## 🔧 Solution: Configure Clerk Webhook

### Step 1: Access Clerk Dashboard

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your Lovtiti Agro Mart project
3. Go to "Webhooks" in the left sidebar

### Step 2: Create Webhook Endpoint

1. Click "Add Endpoint"
2. Set the **Endpoint URL** to:
   ```
   https://your-domain.com/api/auth/clerk
   ```
   
   For local development, use:
   ```
   https://your-ngrok-url.ngrok.io/api/auth/clerk
   ```
   (You'll need to use ngrok or deploy to get a public URL)

3. Select the following **Events**:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`

### Step 3: Get Webhook Secret

1. After creating the webhook, click on it
2. Copy the **Signing Secret** (starts with `whsec_`)
3. Add it to your `.env` file:

```bash
CLERK_WEBHOOK_SECRET="whsec_your_actual_secret_here"
```

### Step 4: Test the Webhook

1. Save your `.env` file
2. Restart your development server
3. Try signing in with Google again
4. Check the console logs for webhook activity

## 🧪 Testing Without Webhook (Alternative)

If you can't set up the webhook immediately, you can manually create users:

### Option 1: Use the Test Page

1. Go to `http://localhost:3000/test-user-creation`
2. Click "Generate Google User"
3. Click "Create User"
4. Check that the user appears in your database

### Option 2: Use the API Directly

```bash
curl -X POST http://localhost:3000/api/users/create \
  -H "Content-Type: application/json" \
  -d '{"id": "google_user_12345", "email": "your-email@gmail.com", "role": "BUYER"}'
```

## 🔍 Debugging Webhook Issues

### Check Webhook Logs

Look for these logs in your console:

```
🔔 Clerk webhook received
📋 Webhook headers: { svix_id: 'present', svix_timestamp: 'present', svix_signature: 'present' }
🎯 Webhook event type: user.created
✅ User saved to database successfully: user_12345
```

### Common Issues

1. **Missing Headers**: Webhook URL not configured in Clerk
2. **Verification Failed**: Wrong webhook secret
3. **Database Error**: Check database connectivity
4. **No Webhook Triggered**: Webhook not configured or URL not accessible

### Test Webhook Manually

You can test the webhook endpoint directly:

```bash
curl -X POST http://localhost:3000/api/auth/clerk \
  -H "Content-Type: application/json" \
  -d '{"type": "user.created", "data": {"id": "test123", "email_addresses": [{"email_address": "test@example.com"}]}}'
```

## 🚀 Production Setup

For production deployment:

1. **Deploy your app** to Vercel/Netlify
2. **Update webhook URL** in Clerk dashboard to your production URL
3. **Set environment variables** in your deployment platform
4. **Test webhook** with a real user sign-up

## 📊 Verification Steps

After setting up the webhook:

1. ✅ Sign in with Google
2. ✅ Check console logs for webhook activity
3. ✅ Verify user appears in Neon database
4. ✅ Check that user activity logging works
5. ✅ Confirm user can access appropriate dashboard

## 🔗 Useful Links

- [Clerk Webhooks Documentation](https://clerk.com/docs/webhooks)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [Neon Database Console](https://console.neon.tech)

## 📝 Environment Variables Checklist

Make sure your `.env` file has:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Database
DATABASE_URL="postgresql://..."
```

---

**Note**: The webhook setup is required for automatic user creation. Without it, users will only be created manually or through the test endpoints.







