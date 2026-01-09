# Rendezvous Social Club - Deployment Guide

This guide walks you through deploying the Rendezvous Social Club mobile app to production.

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup ✅

#### A. Create Project
1. Go to [Supabase](https://app.supabase.com/)
2. Create a new project
3. Save your project URL and anon key

#### B. Run Database Migrations
1. Go to SQL Editor in Supabase dashboard
2. Copy SQL from `docs/CONTEXT.md` (sections: Database Schema, RLS Policies, Triggers)
3. Run each section separately:
   - Tables (17 tables)
   - RLS Policies (for all tables)
   - Database Triggers (3 triggers)
   - Indexes (optional, for performance)

#### C. Configure Storage Buckets
Create the following buckets in Storage section:

1. **profile-avatars**
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

2. **profile-heroes**
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

3. **profile-gallery**
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

4. **event-images**
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

5. **gallery-images**
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

6. **app-assets**
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`
   - Upload default sunset image for hero backgrounds

7. **ticket-qr-codes**
   - Public: No (only accessible to ticket holders)
   - File size limit: 1MB
   - Allowed MIME types: `image/png`

#### D. Storage Bucket Policies
For each bucket, apply the RLS policies from `docs/CONTEXT.md` (Storage Policies section).

Example for `profile-avatars`:
```sql
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-avatars');
```

#### E. Deploy Edge Functions
Deploy the following Edge Functions (source code in `docs/CONTEXT.md`):

1. **send-push-notification**
   ```bash
   supabase functions deploy send-push-notification
   ```

2. **stripe-webhook**
   ```bash
   supabase functions deploy stripe-webhook --no-verify-jwt
   ```

3. **friend-notification-trigger**
   ```bash
   supabase functions deploy friend-notification-trigger
   ```

4. **validate-invite-code**
   ```bash
   supabase functions deploy validate-invite-code
   ```

5. **create-payment-intent**
   ```bash
   supabase functions deploy create-payment-intent
   ```

#### F. Create Initial Admin User
1. Go to Authentication → Users
2. Create a new user with email/password
3. Go to Table Editor → profiles
4. Find the user's profile
5. Update `role` column to `admin`
6. Update `onboarding_completed` to `true`

#### G. Create Initial Invite Codes
Insert invite codes into the `invites` table:

```sql
INSERT INTO invites (code, uses_remaining, expires_at, created_by)
VALUES 
  ('LAUNCH2026', 100, '2026-12-31', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)),
  ('FRIENDS2026', 50, '2026-06-30', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)),
  ('VIP2026', 20, '2026-12-31', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1));
```

---

### 2. Stripe Setup ✅

#### A. Create Stripe Account
1. Go to [Stripe](https://stripe.com/)
2. Create an account
3. Complete business verification

#### B. Get API Keys
1. Go to Developers → API keys
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. For production, use **Live mode** keys (starts with `pk_live_`)

#### C. Configure Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://your-project-id.supabase.co/functions/v1/stripe-webhook`
3. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the webhook signing secret

#### D. Configure Payment Methods
1. Go to Settings → Payment methods
2. Enable:
   - Card payments
   - Apple Pay
   - Google Pay

---

### 3. Environment Configuration ✅

#### A. Create .env File
```bash
cp .env.example .env
```

#### B. Update .env with Your Keys
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key

# For production:
# EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
```

---

### 4. App Configuration ✅

#### A. Update app.json
Update the following fields in `app.json`:

```json
{
  "expo": {
    "name": "Rendezvous Social Club",
    "slug": "rendezvous-social-club",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#007AFF"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.rendezvous.socialclub",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "We need access to your photo library to upload profile pictures and event photos."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#007AFF"
      },
      "package": "com.rendezvous.socialclub",
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store",
      "@stripe/stripe-react-native"
    ]
  }
}
```

#### B. Create App Icons
1. Design app icon (1024x1024 PNG)
2. Use [Expo Icon Generator](https://icon.kitchen/) or similar
3. Replace files in `assets/` folder:
   - `icon.png` (1024x1024)
   - `adaptive-icon.png` (1024x1024, Android)
   - `splash-icon.png` (1242x2436)
   - `favicon.png` (48x48)

---

### 5. Testing ✅

#### A. Local Testing
```bash
# Start development server
npx expo start

# Test on iOS Simulator
npx expo start --ios

# Test on Android Emulator
npx expo start --android
```

#### B. Test Checklist
- [ ] Register new account with invite code
- [ ] Accept Terms & Conditions
- [ ] Upload profile picture (onboarding)
- [ ] View newsfeed
- [ ] Browse events
- [ ] RSVP to free event
- [ ] RSVP to paid event (complete payment)
- [ ] Search for users
- [ ] Send friend request
- [ ] Accept friend request
- [ ] View friend's attending notification
- [ ] View gallery
- [ ] Chat with admin
- [ ] View notifications
- [ ] View calendar
- [ ] Test admin dashboard (with admin account)
- [ ] Upload images
- [ ] Real-time updates

---

### 6. Build for Production ✅

#### A. Install EAS CLI
```bash
npm install -g eas-cli
```

#### B. Login to Expo
```bash
eas login
```

#### C. Configure EAS Build
```bash
eas build:configure
```

#### D. Build iOS App
```bash
# Development build
eas build --platform ios --profile development

# Production build for App Store
eas build --platform ios --profile production
```

#### E. Build Android App
```bash
# Development build
eas build --platform android --profile development

# Production build for Google Play
eas build --platform android --profile production
```

---

### 7. App Store Submission ✅

#### A. Apple App Store (iOS)

1. **Create App Store Connect Account**
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Enroll in Apple Developer Program ($99/year)

2. **Create App Listing**
   - Create new app
   - Bundle ID: `com.rendezvous.socialclub`
   - App name: "Rendezvous Social Club"
   - Category: Social Networking

3. **Prepare Metadata**
   - App description
   - Keywords: social club, events, mallorca, invite-only
   - Screenshots (required for all device sizes)
   - Privacy policy URL
   - Support URL

4. **Submit for Review**
   ```bash
   eas submit --platform ios
   ```

5. **App Review Notes**
   - Provide test account credentials
   - Provide invite code for testing
   - Explain invite-only system

#### B. Google Play Store (Android)

1. **Create Google Play Console Account**
   - Go to [Google Play Console](https://play.google.com/console/)
   - Pay one-time $25 registration fee

2. **Create App Listing**
   - Package name: `com.rendezvous.socialclub`
   - App name: "Rendezvous Social Club"
   - Category: Social

3. **Prepare Store Listing**
   - Short description (80 chars max)
   - Full description
   - Screenshots (required for phone, tablet, feature graphic)
   - Privacy policy URL
   - Content rating questionnaire

4. **Submit for Review**
   ```bash
   eas submit --platform android
   ```

5. **Release Notes**
   - Initial release: "Welcome to Rendezvous Social Club - An exclusive social club for Mallorca."

---

### 8. Post-Deployment ✅

#### A. Monitor Errors
- Set up Sentry or similar error tracking
- Monitor Supabase logs
- Monitor Stripe webhook logs

#### B. Analytics (Optional)
- Set up Expo Analytics
- Track key events:
  - User registrations
  - Event RSVPs
  - Payments
  - Friend connections

#### C. Push Notifications Setup
1. Configure Apple Push Notification Service (APNs)
   - Create APNs key in Apple Developer Portal
   - Add to Expo project

2. Configure Firebase Cloud Messaging (FCM)
   - Create Firebase project
   - Add Android app
   - Download `google-services.json`
   - Add to Expo project

3. Test push notifications
   ```bash
   npx expo-notifications-test
   ```

#### D. Backup Strategy
- Enable Supabase Point-in-Time Recovery
- Regular database backups
- Storage bucket backups

---

## 🚀 Production Deployment Commands

### Quick Deployment Script

```bash
#!/bin/bash

# Build and deploy production apps

echo "🔨 Building iOS app..."
eas build --platform ios --profile production --non-interactive

echo "🔨 Building Android app..."
eas build --platform android --profile production --non-interactive

echo "📱 Submitting to App Store..."
eas submit --platform ios --latest

echo "📱 Submitting to Google Play..."
eas submit --platform android --latest

echo "✅ Deployment complete!"
```

Save as `deploy.sh` and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📊 Post-Launch Monitoring

### Week 1
- [ ] Monitor crash reports daily
- [ ] Check payment success rate
- [ ] Monitor user registration flow
- [ ] Check push notification delivery
- [ ] Review user feedback

### Week 2-4
- [ ] Analyze user engagement metrics
- [ ] Review event RSVP patterns
- [ ] Check friend connection rates
- [ ] Monitor storage usage
- [ ] Optimize slow queries

### Monthly
- [ ] Review Supabase costs
- [ ] Review Stripe transaction fees
- [ ] Analyze feature usage
- [ ] Plan feature updates
- [ ] Security audit

---

## 🆘 Troubleshooting

### Common Issues

#### "Supabase connection failed"
- Check environment variables are set correctly
- Verify Supabase project is active
- Check RLS policies are applied

#### "Stripe payment failed"
- Verify Stripe keys are correct (test vs live)
- Check webhook is configured
- Verify payment methods are enabled

#### "Image upload failed"
- Check storage bucket policies
- Verify bucket exists and is public
- Check file size limits

#### "Push notifications not working"
- Verify APNs/FCM configuration
- Check device token registration
- Test Edge Function manually

---

## 📞 Support

For deployment issues:
1. Check [Expo Documentation](https://docs.expo.dev/)
2. Check [Supabase Documentation](https://supabase.com/docs)
3. Check [Stripe Documentation](https://stripe.com/docs)
4. Contact development team

---

**Deployment complete! 🎉**

Your Rendezvous Social Club app is now live!
