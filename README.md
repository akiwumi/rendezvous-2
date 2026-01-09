# Rendezvous Social Club - Mobile App

An invite-only social club mobile application for Mallorca, built with React Native, Expo, and Supabase.

## 🎉 Current Status: **62.5% Complete - Functional MVP!**

**10 out of 16** major features are fully implemented and ready for testing!

### ✅ What's Working Now
- Complete authentication flow (Login, Register, Terms)
- Onboarding with mandatory profile picture upload
- Admin newsfeed with real-time updates
- Events browsing with search
- User profiles with hero image management
- Calendar showing confirmed attending events
- Supabase integration throughout

### 📋 Documentation

**Complete technical specification:** [docs/CONTEXT.md](./docs/CONTEXT.md) (5,336 lines)  
**Implementation guide:** [BUILD_GUIDE.md](./BUILD_GUIDE.md) (771 lines)  
**Development progress:** [PROGRESS.md](./PROGRESS.md) - Detailed status report

The comprehensive specification includes:
- Complete database schema (17 tables)
- Row Level Security (RLS) policies
- Storage bucket configurations
- API specifications & Edge Functions
- Detailed UI/UX flows
- Security & compliance guidelines
- Implementation guidelines

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- iOS Simulator (Mac) or Android Studio
- Expo Go app on your physical device (optional)
- Supabase account
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/akiwumi/rendezvous-2.git
cd rendezvous-2

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
```

### Environment Setup

Create `.env` file with:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

### Development

```bash
# Start Expo dev server
npx expo start

# Then choose:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on your phone
```

### Build for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

## 🏗️ Tech Stack

- **Frontend:** React Native, Expo SDK 54, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **Navigation:** React Navigation 7
- **Payments:** Stripe React Native SDK
- **State:** React Query + Context API
- **UI:** React Native components + custom design system

## 📱 Features Status

### ✅ Implemented (10/16 - 62.5%)
- ✅ **Authentication** - Login, Registration, Terms acceptance
- ✅ **Onboarding** - Mandatory profile picture upload
- ✅ **Navigation** - Auth flow, onboarding gate, bottom tabs
- ✅ **Newsfeed** - Admin posts with real-time updates
- ✅ **Events** - Browse, search, and view events
- ✅ **Profile** - User profiles with hero image management
- ✅ **Calendar** - View confirmed attending events
- ✅ **Supabase Integration** - All screens connected to backend
- ✅ **Image Upload** - Profile avatars and hero images
- ✅ **Real-time Updates** - Live post and event updates

### 🚧 Remaining Features (6/16)
- ⏳ Friends System
- ⏳ Notifications Panel
- ⏳ Event RSVP & Payments (Stripe)
- ⏳ Member-Admin Chat
- ⏳ Club Gallery
- ⏳ Admin Panel

## 📁 Project Structure

```
rendezvous_social/
├── docs/                       # Comprehensive specification
├── app/                        # App screens (Expo Router)
├── components/                 # Reusable components
├── lib/                        # Utilities & services
│   ├── supabase/              # Supabase client
│   ├── stripe/                # Stripe integration
│   └── hooks/                 # Custom hooks
├── types/                      # TypeScript types
├── assets/                     # Images, fonts, etc.
└── app.json                   # Expo configuration
```

## 🔐 Security

- Row Level Security (RLS) on all database tables
- Secure storage for auth tokens (expo-secure-store)
- Invite-only access control
- Content moderation system
- PCI-compliant payments via Stripe
- Biometric authentication support
- Certificate pinning for API requests

## 🔧 Configuration

### Supabase Setup

1. Create project at https://supabase.com
2. Run SQL migrations from `docs/CONTEXT.md`
3. Configure Storage buckets
4. Set up Edge Functions
5. Add credentials to `.env`

### Stripe Setup

1. Create account at https://stripe.com
2. Get publishable key
3. Configure webhooks for mobile
4. Add key to `.env`

### Push Notifications

```bash
# Configure for iOS
npx expo credentials:manager

# Configure for Android
# Add google-services.json
```

## 📋 Development Roadmap

**Phase 1 (Week 1-2):** Foundation  
- Authentication & registration
- Profile system
- Supabase integration

**Phase 2 (Week 3-4):** Core Features  
- Event browsing & RSVP
- Navigation structure
- Image upload

**Phase 3 (Week 5-6):** Social Features  
- Friends system
- Push notifications
- Chat functionality

**Phase 4 (Week 7):** Payments  
- Stripe integration
- Ticket generation
- Payment flow

**Phase 5 (Week 8):** Polish & Launch  
- Performance optimization
- Testing (iOS & Android)
- App Store submission

## 🧪 Testing

```bash
# Run tests
npm test

# E2E tests (Detox)
npm run test:e2e:ios
npm run test:e2e:android
```

## 📦 Deployment

### iOS App Store

```bash
eas build --platform ios
eas submit --platform ios
```

### Google Play Store

```bash
eas build --platform android
eas submit --platform android
```

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

## 📄 License

Proprietary - All rights reserved

---

**Built for Rendezvous Social Club, Mallorca** 🇪🇸
