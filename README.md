# Rendezvous Social Club - Mobile App

An invite-only social club mobile application for Mallorca, built with React Native, Expo, and Supabase.

## 🎉 Current Status: **100% Complete - Production Ready!**

**All 17 major features** are fully implemented and ready for production deployment!

### ✅ What's Working Now
- ✅ Complete authentication flow (Login, Register, Terms)
- ✅ Onboarding with mandatory profile picture upload
- ✅ Admin newsfeed with real-time updates
- ✅ Events browsing, RSVP, and payment flow
- ✅ User profiles with hero image management
- ✅ Calendar showing confirmed attending events
- ✅ Notifications panel with real-time updates
- ✅ Friends system (add, accept, decline, remove)
- ✅ User search functionality
- ✅ Club gallery with image viewer
- ✅ Member-admin chat with real-time messaging
- ✅ Stripe payment integration for paid events
- ✅ Admin dashboard with statistics and management
- ✅ Supabase integration throughout

### 📋 Documentation

**Complete technical specification:** [docs/CONTEXT.md](./docs/CONTEXT.md) (5,336 lines)  
**Implementation guide:** [BUILD_GUIDE.md](./BUILD_GUIDE.md) (771 lines)  
**Development progress:** [PROGRESS.md](./PROGRESS.md) - Detailed status report

The comprehensive specification includes:
- Complete database schema (18 tables)
- Row Level Security (RLS) policies
- Storage bucket configurations (7 buckets)
- API specifications & Edge Functions (5 functions)
- Detailed UI/UX flows with Mermaid diagrams
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

# Create .env file
cp .env.example .env

# Add your Supabase and Stripe credentials to .env
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Start the development server
npx expo start
```

### Running the App

- **iOS Simulator:** Press `i` in the terminal
- **Android Emulator:** Press `a` in the terminal
- **Physical Device:** Scan the QR code with Expo Go app

## 📱 Features

### Core Features

#### 1. Authentication & Onboarding
- Invite-only registration with code validation
- Terms & Conditions acceptance (required)
- Mandatory profile picture upload
- Secure session management with Expo SecureStore

#### 2. Newsfeed
- Admin-curated posts (announcements, events, offers)
- Real-time updates via Supabase subscriptions
- Pull-to-refresh
- Image display

#### 3. Events
- Event browsing with search and filters
- Detailed event view with full information
- RSVP system (Interested / Attend)
- Payment integration for paid events via Stripe
- Real-time RSVP count updates
- Event capacity tracking

#### 4. Profile Management
- User profiles with avatar and hero images
- Default sunset hero image (Mallorca themed)
- Stats display (events attended, friends count)
- Profile gallery
- Settings and preferences

#### 5. Calendar
- View all confirmed attending events
- Date and time display
- Location information
- Quick navigation to event details

#### 6. Notifications
- In-app notification panel
- Real-time updates
- Notification types:
  - Friend requests
  - Friend accepted
  - Friend attending event
  - Event reminders
  - Admin announcements
- Mark as read functionality

#### 7. Friends System
- Search for users by name/username
- Send friend requests
- Accept/decline requests
- Remove friends
- View friends list
- Real-time friendship status

#### 8. Gallery
- Admin-curated club gallery
- Grid layout with featured badges
- Full-screen image viewer
- Image captions and categories
- Event linking

#### 9. Chat
- Direct messaging with admin team
- Real-time message updates
- Message history
- Read receipts
- Auto-scroll to latest

#### 10. Payments
- Stripe integration for paid events
- Apple Pay / Google Pay support
- Payment intent creation
- Ticket generation
- Payment confirmation
- Secure processing

#### 11. Admin Dashboard
- Statistics overview
- Content management (posts, events, gallery)
- User management (view, ban, invites)
- Payment & ticket management
- Communication tools
- Role-based access control

## 🏗️ Architecture

### Tech Stack

- **Frontend:** React Native (Expo)
- **Language:** TypeScript
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime
- **Payments:** Stripe
- **Navigation:** React Navigation
- **State Management:** React Hooks
- **Image Handling:** Expo Image Picker

### Project Structure

```
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── events/         # Event components (PaymentSheet)
│   ├── feed/           # Feed components
│   ├── friends/        # Friend components
│   ├── gallery/        # Gallery components
│   └── ui/             # Reusable UI components
├── screens/
│   ├── admin/          # Admin screens
│   ├── auth/           # Auth screens (Login, Register, Terms)
│   ├── main/           # Main app screens
│   └── onboarding/     # Onboarding screens
├── navigation/
│   ├── AuthNavigator.tsx
│   └── AppNavigator.tsx
├── lib/
│   ├── hooks/          # Custom React hooks
│   ├── supabase/       # Supabase client
│   ├── stripe/         # Stripe helpers
│   └── utils/          # Utility functions
├── types/
│   └── database.ts     # TypeScript types from Supabase
└── constants/          # App constants
```

## 🗄️ Database Schema

The app uses 18 Supabase tables:

1. **profiles** - User profiles with role-based access
2. **invites** - Invite code system
3. **terms_acceptances** - Terms acceptance tracking
4. **posts** - Admin newsfeed posts
5. **events** - Event listings
6. **event_rsvps** - RSVP tracking
7. **payments** - Payment records
8. **tickets** - Event tickets
9. **friend_requests** - Friend system
10. **notifications** - In-app notifications
11. **push_devices** - Push notification tokens
12. **notification_preferences** - User notification settings
13. **conversations** - Chat conversations
14. **messages** - Chat messages
15. **gallery_images** - Club gallery
16. **profile_images** - User profile galleries
17. **event_ratings** - Event reviews
18. **audit_logs** - Admin action logging

See [docs/CONTEXT.md](./docs/CONTEXT.md) for complete SQL schema and RLS policies.

## 🔐 Security

- Row Level Security (RLS) policies on all tables
- Secure session management with Expo SecureStore
- Role-based access control (member/admin)
- Invite-only registration
- Terms acceptance tracking
- Audit logging for admin actions
- Secure payment processing via Stripe

## 🚀 Deployment

### Prerequisites

1. **Supabase Project Setup**
   - Create a new Supabase project
   - Run database migrations from `docs/CONTEXT.md`
   - Set up RLS policies
   - Configure storage buckets
   - Deploy Edge Functions

2. **Stripe Setup**
   - Create Stripe account
   - Get publishable key
   - Set up webhooks
   - Configure payment methods

3. **Expo Account**
   - Create Expo account
   - Install EAS CLI: `npm install -g eas-cli`
   - Login: `eas login`

### Build for Production

```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## 📝 Environment Variables

Create a `.env` file with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Registration with invite code
- [ ] Terms acceptance
- [ ] Profile picture upload
- [ ] Login/logout
- [ ] View newsfeed
- [ ] Browse events
- [ ] RSVP to free event
- [ ] RSVP to paid event (payment flow)
- [ ] Search for users
- [ ] Send friend request
- [ ] Accept friend request
- [ ] View gallery
- [ ] Chat with admin
- [ ] View notifications
- [ ] View calendar
- [ ] Admin dashboard access

## 📊 Progress

| Feature | Status | Progress |
|---------|--------|----------|
| Authentication | ✅ Complete | 100% |
| Onboarding | ✅ Complete | 100% |
| Navigation | ✅ Complete | 100% |
| Newsfeed | ✅ Complete | 100% |
| Events | ✅ Complete | 100% |
| Profile | ✅ Complete | 100% |
| Calendar | ✅ Complete | 100% |
| Notifications | ✅ Complete | 100% |
| Friends System | ✅ Complete | 100% |
| Search | ✅ Complete | 100% |
| Gallery | ✅ Complete | 100% |
| Chat | ✅ Complete | 100% |
| Payments | ✅ Complete | 100% |
| Admin Dashboard | ✅ Complete | 100% |

**Overall Progress: 100%** 🎉

## 🤝 Contributing

This is a private project for Rendezvous Social Club. For questions or support, contact the development team.

## 📄 License

Proprietary - All rights reserved by Rendezvous Social Club

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Powered by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)
- Icons from system emojis

---

**Ready for production deployment!** 🚀

For detailed implementation steps, see [BUILD_GUIDE.md](./BUILD_GUIDE.md)  
For development progress, see [PROGRESS.md](./PROGRESS.md)  
For complete technical specification, see [docs/CONTEXT.md](./docs/CONTEXT.md)
