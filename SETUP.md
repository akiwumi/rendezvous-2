# Rendezvous Social Club - Setup Guide

Quick start guide to get the app running locally.

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the project root with the following:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Stripe Configuration
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
```

**Where to get these values:**
- **Supabase URL & Key:** [Supabase Dashboard](https://app.supabase.com/) → Your Project → Settings → API
- **Stripe Key:** [Stripe Dashboard](https://dashboard.stripe.com/) → Developers → API keys

### 3. Start Development Server

```bash
npx expo start
```

### 4. Run on Device/Simulator

- **iOS:** Press `i` in terminal (requires Mac + Xcode)
- **Android:** Press `a` in terminal (requires Android Studio)
- **Physical Device:** Scan QR code with Expo Go app

---

## 📱 First Time Setup

### Option A: Quick Test (No Backend)

The app will show error messages but UI is fully functional:

1. Skip Supabase/Stripe configuration
2. Run `npx expo start`
3. Explore the UI and navigation flow
4. Authentication and data features will fail gracefully

### Option B: Full Setup with Backend

Follow the complete setup below to test all features.

---

## 🗄️ Supabase Setup (Required for Full Functionality)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com/)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - **Name:** Rendezvous Social Club
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to Mallorca (e.g., EU West)
5. Wait for project to provision (~2 minutes)

### Step 2: Get API Credentials

1. Go to Project Settings → API
2. Copy **Project URL** → Add to `.env` as `EXPO_PUBLIC_SUPABASE_URL`
3. Copy **anon public key** → Add to `.env` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Run Database Migrations

1. Go to SQL Editor in Supabase Dashboard
2. Open `docs/CONTEXT.md` in this project
3. Copy SQL from these sections and run them **in order**:

#### A. Create Tables (Section: Database Schema)
Copy and run the SQL for all 18 tables:
- profiles
- invites
- terms_acceptances
- posts
- events
- event_rsvps
- payments
- tickets
- friend_requests
- notifications
- push_devices
- notification_preferences
- conversations
- messages
- gallery_images
- profile_images
- event_ratings
- audit_logs

#### B. Apply RLS Policies (Section: Row Level Security Policies)
Copy and run ALL RLS policies from `docs/CONTEXT.md`

#### C. Create Triggers (Section: Database Triggers)
Copy and run the trigger functions:
- `update_event_rsvp_counts`
- `update_profile_events_attended`
- `update_friends_count`

### Step 4: Configure Storage Buckets

1. Go to Storage in Supabase Dashboard
2. Create these buckets (click "New bucket"):

| Bucket Name | Public | File Size Limit | Allowed Types |
|-------------|--------|-----------------|---------------|
| profile-avatars | ✅ Yes | 5 MB | image/* |
| profile-heroes | ✅ Yes | 5 MB | image/* |
| profile-gallery | ✅ Yes | 5 MB | image/* |
| event-images | ✅ Yes | 10 MB | image/* |
| gallery-images | ✅ Yes | 10 MB | image/* |
| app-assets | ✅ Yes | 10 MB | image/* |
| ticket-qr-codes | ❌ No | 1 MB | image/png |

3. Apply storage policies from `docs/CONTEXT.md` (Section: Storage Policies)

### Step 5: Create Test Data

#### A. Create Admin User
```sql
-- Run in SQL Editor after creating your first user via the app
UPDATE profiles 
SET role = 'admin', onboarding_completed = true
WHERE email = 'your-email@example.com';
```

#### B. Create Invite Codes
```sql
INSERT INTO invites (code, uses_remaining, expires_at)
VALUES 
  ('TEST2026', 100, '2026-12-31'),
  ('DEMO2026', 50, '2026-06-30');
```

#### C. Create Sample Event
```sql
INSERT INTO events (
  title, 
  description, 
  start_time, 
  end_time, 
  location_name, 
  location_address,
  category,
  price_eur,
  capacity,
  status
) VALUES (
  'Welcome Party',
  'Join us for our launch party in Palma de Mallorca!',
  '2026-02-15 20:00:00+00',
  '2026-02-16 02:00:00+00',
  'Café del Mar',
  'Passeig Marítim, Palma',
  'social',
  15.00,
  50,
  'published'
);
```

#### D. Create Sample Post
```sql
INSERT INTO posts (
  type,
  title,
  content,
  status
) VALUES (
  'announcement',
  'Welcome to Rendezvous Social Club!',
  'We''re excited to have you here. Check out our upcoming events and connect with fellow members.',
  'published'
);
```

---

## 💳 Stripe Setup (Optional, for Payments)

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com/)
2. Sign up for a free account
3. Complete basic profile setup

### Step 2: Get Test API Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in **Test mode** (toggle in top right)
3. Go to Developers → API keys
4. Copy **Publishable key** (starts with `pk_test_`)
5. Add to `.env` as `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Step 3: Test Credit Cards

Use these test cards in the app:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`
- **Any future expiry date and CVC**

More test cards: [Stripe Test Cards](https://stripe.com/docs/testing)

---

## ✅ Verify Setup

### Test Checklist

Run the app and test these features:

- [ ] App starts without errors
- [ ] Can view login screen
- [ ] Can navigate to register screen
- [ ] Registration shows invite code field
- [ ] Terms screen displays properly
- [ ] (With Supabase) Can register new account with invite code `TEST2026`
- [ ] (With Supabase) Can upload profile picture
- [ ] (With Supabase) Can view newsfeed
- [ ] (With Supabase) Can view events list
- [ ] (With Supabase + Stripe) Can complete payment for paid event
- [ ] Bottom navigation works (Feed, Events, Search, Friends, Gallery, Profile)
- [ ] Can navigate to profile screen

### Common Issues & Solutions

#### "Cannot connect to Supabase"
- ✅ Check `.env` file exists in project root
- ✅ Verify Supabase URL and key are correct
- ✅ Restart development server: `Ctrl+C` then `npx expo start`

#### "Invite code invalid"
- ✅ Run SQL to create invite codes (see Step 5B above)
- ✅ Check `invites` table in Supabase has entries

#### "Cannot upload images"
- ✅ Create storage buckets (see Step 4 above)
- ✅ Apply storage policies from `docs/CONTEXT.md`
- ✅ Make buckets public (except ticket-qr-codes)

#### "Payment failed"
- ✅ Check Stripe key in `.env` starts with `pk_test_`
- ✅ Use test card `4242 4242 4242 4242`
- ✅ Make sure you're in Stripe Test mode

---

## 📱 Development Workflow

### Daily Development

```bash
# Start server
npx expo start

# Clear cache if needed
npx expo start --clear

# Run on specific platform
npx expo start --ios
npx expo start --android
```

### Making Changes

1. Edit files in `src/` directory
2. App will hot-reload automatically
3. Check terminal for errors
4. Use React DevTools for debugging

### Database Changes

1. Update schema in Supabase SQL Editor
2. Update types: Generate new types from Supabase dashboard
3. Update `src/types/database.ts`
4. Restart app

---

## 🔧 Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Clear cache and start
npx expo start --clear

# Run on iOS simulator (Mac only)
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Check for updates
npx expo install --check

# Fix dependency issues
npx expo doctor

# View logs
npx expo start --dev-client

# Type check
npx tsc --noEmit
```

---

## 📚 Documentation

- **Complete Spec:** [docs/CONTEXT.md](./docs/CONTEXT.md) - All database schemas, RLS policies, API specs
- **Build Guide:** [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Feature implementation guide
- **Progress:** [PROGRESS.md](./PROGRESS.md) - Development status
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide

---

## 🆘 Getting Help

### Resources

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **React Navigation:** https://reactnavigation.org/docs/getting-started

### Debug Mode

Enable debug logging:

```typescript
// Add to App.tsx
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Has Supabase Key:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
console.log('Has Stripe Key:', !!process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);
```

---

## ✨ Next Steps

Once setup is complete:

1. ✅ Explore the app features
2. ✅ Test user registration flow
3. ✅ Create events in Supabase
4. ✅ Test payment flow with Stripe
5. ✅ Review [BUILD_GUIDE.md](./BUILD_GUIDE.md) for customization
6. ✅ See [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy

---

**You're all set! 🎉**

Start developing with `npx expo start`
