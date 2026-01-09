# Rendezvous Social Club - Build Guide

This guide provides step-by-step instructions for implementing all features based on the comprehensive specification in `docs/CONTEXT.md`.

## 🏗️ Current Status

### ✅ Completed
- [x] Project structure and folder organization
- [x] Supabase client setup for React Native
- [x] Navigation structure (Auth, Onboarding, Main App)
- [x] Authentication screens (Login, Register, Terms)
- [x] TypeScript types for database
- [x] Custom hooks (useAuth, useProfile)
- [x] Placeholder screens for main app

### 🚧 To Be Implemented

Follow this guide to implement the remaining 14 major features systematically.

---

## Phase 1: Foundation & Authentication (Week 1)

### 1.1 Complete Supabase Setup

**Prerequisites:**
1. Create Supabase project at https://supabase.com
2. Run SQL migrations from `docs/CONTEXT.md` (lines 130-1000)
3. Create storage buckets (see docs/CONTEXT.md lines 2200-2600)
4. Deploy Edge Functions (see docs/CONTEXT.md lines 2800-3600)

**Configuration:**
```bash
# Copy .env.example to .env
cp .env.example .env

# Add your credentials
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Generate Types:**
```bash
npx supabase gen types typescript --project-id your-project > src/types/database.ts
```

### 1.2 Complete Registration Flow

**File:** `src/screens/auth/RegisterScreen.tsx`

**Tasks:**
1. Add invite code validation
   - Call Edge Function `validate-invite-code`
   - Show loading state during validation
   - Display error if code is invalid

2. Add username uniqueness check
   - Query Supabase real-time as user types
   - Show green checkmark when available

3. Add password strength validation
   - Min 8 characters
   - At least one uppercase, lowercase, number

**Reference:** docs/CONTEXT.md lines 3700-3900 (Registration Flow)

### 1.3 Complete Terms Acceptance

**File:** `src/screens/auth/TermsScreen.tsx`

**Tasks:**
1. Add full terms content from docs/CONTEXT.md lines 240-280
2. Implement scrolled-to-bottom detection
3. Record terms acceptance with version + IP
4. Update invite code uses_count after successful registration

**Edge Function to call:** None (direct database insert is fine)

---

## Phase 2: Onboarding & Profile (Week 1-2)

### 2.1 Complete Onboarding Flow

**File:** `src/screens/onboarding/OnboardingScreen.tsx`

**Tasks:**
1. Install image picker:
   ```bash
   npx expo install expo-image-picker
   ```

2. Implement image picker UI
   - Large circular avatar preview
   - "Upload Photo" button
   - Camera or library selection

3. Implement image upload to Supabase Storage
   ```typescript
   import * as ImagePicker from 'expo-image-picker';
   import { supabase } from '../../lib/supabase/client';
   
   // Pick image
   const result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.Images,
     allowsEditing: true,
     aspect: [1, 1],
     quality: 0.8,
   });
   
   // Upload to storage
   const fileExt = result.uri.split('.').pop();
   const filePath = `${userId}/avatar.${fileExt}`;
   
   const { error } = await supabase.storage
     .from('profile-avatars')
     .upload(filePath, {
       uri: result.uri,
       type: `image/${fileExt}`,
       name: `avatar.${fileExt}`,
     });
   
   // Update profile
   const { data: { publicUrl } } = supabase.storage
     .from('profile-avatars')
     .getPublicUrl(filePath);
   
   await supabase.from('profiles').update({
     avatar_url: publicUrl,
     onboarding_completed: true,
   }).eq('id', userId);
   ```

4. Add image compression (max 5MB)
   ```bash
   npm install expo-image-manipulator
   ```

**Reference:** docs/CONTEXT.md lines 3750-3850 (Onboarding Flow)

### 2.2 Build Profile Screens

**Files to create:**
- `src/screens/main/ProfileScreen.tsx` (own profile)
- `src/screens/main/PublicProfileScreen.tsx` (other users)
- `src/components/profile/ProfileHeader.tsx`
- `src/components/profile/ProfileHero.tsx`
- `src/components/profile/ProfileStats.tsx`
- `src/components/profile/ProfileGallery.tsx`

**Profile Screen Layout:**
```
┌─────────────────────────┐
│   Hero Image (default   │
│   sunset or custom)     │
├─────────────────────────┤
│  [Avatar] Name          │
│  @username              │
│  Bio text               │
├─────────────────────────┤
│  Events: 12 Friends: 45 │
├─────────────────────────┤
│  [Edit Profile] [Settings]
├─────────────────────────┤
│  Gallery Grid           │
│  [+] [photo] [photo]    │
│  [photo] [photo] [photo]│
└─────────────────────────┘
```

**Key Features:**
1. Default hero sunset image if `hero_image_url` is null
2. Change hero image button (own profile only)
3. Edit profile modal
4. Profile gallery with upload/reorder/delete
5. Friends/Events counts from database

**Reference:** docs/CONTEXT.md lines 4090-4120 (Profile Management Flow)

---

## Phase 3: Events & RSVP (Week 2-3)

### 3.1 Build Events List Screen

**File:** `src/screens/main/EventsScreen.tsx`

**Tasks:**
1. Fetch published events from Supabase
   ```typescript
   const { data: events } = await supabase
     .from('events')
     .select('*')
     .eq('published', true)
     .gte('start_time', new Date().toISOString())
     .order('start_time', { ascending: true });
   ```

2. Create EventCard component
   - Cover image
   - Title, date, location
   - Price badge (FREE or €X.XX)
   - RSVP counts
   - Tap to view details

3. Add search and filters
   - Search by title/description
   - Filter by category
   - Filter by date range
   - Filter by free/paid

**Component structure:**
```typescript
<FlatList
  data={events}
  renderItem={({ item }) => <EventCard event={item} />}
  refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
/>
```

**Reference:** docs/CONTEXT.md lines 3850-3950 (Event RSVP Flow)

### 3.2 Build Event Detail Screen

**File:** `src/screens/main/EventDetailScreen.tsx`

**Key Components:**
1. Event header (image, title, date, location, price)
2. Description
3. RSVP buttons (Interested / Attend)
4. Attendee list (if user is attending)
5. Rating section (if event ended and user attended)

**RSVP Logic:**
```typescript
const handleRSVP = async (status: 'interested' | 'attending_confirmed') => {
  // Check if paid event
  if (event.price_eur > 0 && status === 'attending_confirmed') {
    // Navigate to payment screen
    navigation.navigate('EventPayment', { eventId: event.id });
    return;
  }
  
  // Free event - create RSVP directly
  const { error } = await supabase.from('event_rsvps').upsert({
    event_id: event.id,
    user_id: userId,
    status,
  });
  
  if (!error) {
    // Trigger friend notification via Edge Function
    await supabase.functions.invoke('friend-notification-trigger', {
      body: { userId, eventId: event.id }
    });
  }
};
```

**Reference:** docs/CONTEXT.md lines 3850-3950 (Event RSVP + Payment Flow)

### 3.3 Implement Stripe Payment Flow

**Install Stripe:**
```bash
npx expo install @stripe/stripe-react-native
```

**Files to create:**
- `src/screens/main/EventPaymentScreen.tsx`
- `src/lib/stripe/client.ts`

**Payment Flow:**
1. Create payment intent via Edge Function
2. Show Stripe payment sheet
3. Handle success/failure
4. Update RSVP to `attending_confirmed`
5. Show ticket

**Stripe Setup:**
```typescript
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

export function PaymentScreen({ route }) {
  const { eventId } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const openPaymentSheet = async () => {
    // 1. Create payment intent
    const { data } = await supabase.functions.invoke('create-payment-intent', {
      body: { eventId, rsvpId }
    });
    
    // 2. Initialize payment sheet
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Rendezvous Social Club',
      paymentIntentClientSecret: data.clientSecret,
    });
    
    if (!error) {
      // 3. Present payment sheet
      const { error: paymentError } = await presentPaymentSheet();
      
      if (!paymentError) {
        // Success! Webhook will handle RSVP update
        navigation.navigate('TicketScreen', { eventId });
      }
    }
  };
}
```

**Reference:** docs/CONTEXT.md lines 3850-3950 (Payment Flow)

---

## Phase 4: Social Features (Week 3-4)

### 4.1 Implement Friends System

**Files to create:**
- `src/screens/main/FriendsScreen.tsx`
- `src/components/friends/FriendCard.tsx`
- `src/components/friends/FriendRequestCard.tsx`

**Features:**
1. View all friends
2. View pending friend requests
3. Send friend request from profile
4. Accept/decline requests
5. Remove friend

**Friend Request Flow:**
```typescript
// Send request
const sendFriendRequest = async (recipientId: string) => {
  const { error } = await supabase.from('friend_requests').insert({
    requester_id: userId,
    recipient_id: recipientId,
    status: 'pending',
  });
  
  // Create notification
  await supabase.from('notifications').insert({
    user_id: recipientId,
    type: 'friend_request',
    title: 'New Friend Request',
    message: `${userName} sent you a friend request`,
    related_user_id: userId,
  });
};

// Accept request
const acceptFriendRequest = async (requestId: string) => {
  await supabase.from('friend_requests').update({
    status: 'accepted',
    responded_at: new Date().toISOString(),
  }).eq('id', requestId);
  
  // Triggers will update friends_count
};
```

**Reference:** docs/CONTEXT.md lines 4010-4050 (Friend System Flow)

### 4.2 Implement Notifications

**Files to create:**
- `src/screens/main/NotificationsScreen.tsx`
- `src/components/notifications/NotificationCard.tsx`
- `src/components/ui/NotificationBell.tsx`

**Features:**
1. In-app notification panel
2. Unread badge count
3. Mark as read
4. Navigate to related content

**Notification Types:**
- Friend request
- Friend accepted
- Friend attending event
- Event reminder
- Event update
- Admin message

**Real-time subscription:**
```typescript
useEffect(() => {
  const subscription = supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      setNotifications(prev => [payload.new, ...prev]);
      setUnreadCount(prev => prev + 1);
    })
    .subscribe();
  
  return () => subscription.unsubscribe();
}, [userId]);
```

**Reference:** docs/CONTEXT.md lines 4050-4090 (Notification System Flow)

### 4.3 Implement Push Notifications

**Install dependencies:**
```bash
npx expo install expo-notifications expo-device expo-constants
```

**Setup:**
1. Get device push token
2. Store in `push_devices` table
3. Request permissions
4. Handle incoming notifications

**Push Token Registration:**
```typescript
import * as Notifications from 'expo-notifications';

const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  
  await supabase.from('push_devices').upsert({
    user_id: userId,
    device_token: token,
    platform: Platform.OS,
    is_active: true,
  });
};
```

**Reference:** docs/CONTEXT.md lines 2900-3100 (Push Notification Edge Function)

---

## Phase 5: Additional Features (Week 4-5)

### 5.1 Build Calendar Screen

**File:** `src/screens/main/CalendarScreen.tsx`

**Install calendar:**
```bash
npx expo install react-native-calendars
```

**Features:**
1. Show confirmed attending events
2. Month/List view toggle
3. Set reminders (1 hour, 1 day, 1 week before)
4. Add to device calendar

**Reference:** docs/CONTEXT.md lines 4125-4165 (Calendar & Reminders Flow)

### 5.2 Build Event Ratings

**Component:** `src/components/events/EventRating.tsx`

**Features:**
1. Show rating form after event ends
2. 1-5 star rating + optional review
3. Show average rating on event detail
4. Only attendees can rate

**Reference:** docs/CONTEXT.md lines 780-850 in CONTEXT.md (Event Ratings Table)

### 5.3 Build Member-Admin Chat

**Files:**
- `src/screens/main/ChatScreen.tsx`
- `src/components/chat/MessageBubble.tsx`
- `src/components/chat/MessageInput.tsx`

**Features:**
1. Real-time messaging with admins
2. Message history
3. Typing indicators
4. Read receipts

**Real-time Messages:**
```typescript
const subscription = supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`,
  }, (payload) => {
    setMessages(prev => [...prev, payload.new]);
  })
  .subscribe();
```

**Reference:** docs/CONTEXT.md lines 1600-1700 (Chat Tables)

### 5.4 Build Club Gallery

**File:** `src/screens/main/GalleryScreen.tsx`

**Features:**
1. Browse albums
2. View photos in album
3. Full-screen image viewer
4. Link to related events

**Reference:** docs/CONTEXT.md lines 1550-1600 (Gallery Tables)

---

## Phase 6: Admin Panel (Week 5-6)

### 6.1 Admin Navigation

**File:** `src/navigation/AdminNavigator.tsx`

**Screens:**
- Dashboard
- Manage Posts
- Manage Events
- Manage Gallery
- Manage Users
- View Payments
- Moderation Queue
- Chat Inbox

**Access Control:**
```typescript
const { profile } = useProfile(userId);

if (profile?.role !== 'admin') {
  return <Text>Access Denied</Text>;
}
```

### 6.2 Admin Screens

Create admin versions of:
1. **Post Editor** - Create/edit newsfeed posts
2. **Event Manager** - Create/edit/publish events
3. **User Manager** - Ban/unban users, view activity
4. **Gallery Manager** - Upload/organize gallery images
5. **Payment Dashboard** - View payments, issue refunds
6. **Moderation Queue** - Review flagged content

**Reference:** docs/CONTEXT.md lines 4150-4200 (Admin Panel Flow)

---

## Phase 7: Polish & Testing (Week 6-7)

### 7.1 UI/UX Polish

1. **Loading States**
   - Skeleton loaders for content
   - Spinners for actions
   - Pull-to-refresh everywhere

2. **Error Handling**
   - Toast notifications
   - Retry buttons
   - Offline mode handling

3. **Animations**
   - Smooth transitions
   - Gesture-based interactions
   - Haptic feedback

4. **Dark Mode** (Optional)
   - Theme provider
   - Color schemes
   - System preference detection

### 7.2 Performance Optimization

1. **Image Optimization**
   - Lazy loading
   - Cached images
   - Thumbnail generation

2. **List Performance**
   - FlatList optimization
   - Pagination
   - Virtualization

3. **Bundle Size**
   - Code splitting
   - Remove unused dependencies
   - Optimize assets

### 7.3 Testing

1. **Unit Tests** (Jest)
   ```bash
   npm install --save-dev jest @testing-library/react-native
   ```

2. **E2E Tests** (Detox)
   ```bash
   npm install --save-dev detox
   ```

3. **Manual Testing Checklist:**
   - [ ] Registration with invite code
   - [ ] Terms acceptance
   - [ ] Onboarding avatar upload
   - [ ] Login/logout
   - [ ] Event RSVP (free)
   - [ ] Event RSVP (paid with Stripe)
   - [ ] Friend request flow
   - [ ] Notifications (in-app + push)
   - [ ] Event ratings
   - [ ] Profile editing
   - [ ] Chat with admin
   - [ ] Calendar view
   - [ ] Gallery browsing
   - [ ] Admin features (if admin)

---

## Phase 8: Deployment (Week 7-8)

### 8.1 App Store Preparation

**iOS:**
1. Create App Store Connect account
2. Generate app icons and splash screens
3. Configure app.json:
   ```json
   {
     "expo": {
       "name": "Rendezvous Social Club",
       "slug": "rendezvous-social",
       "version": "1.0.0",
       "ios": {
         "bundleIdentifier": "com.rendezvous.social",
         "buildNumber": "1"
       }
     }
   }
   ```
4. Build with EAS:
   ```bash
   npm install -g eas-cli
   eas build --platform ios
   ```

**Android:**
1. Create Google Play Console account
2. Generate signing keys
3. Configure app.json:
   ```json
   {
     "expo": {
       "android": {
         "package": "com.rendezvous.social",
         "versionCode": 1
       }
     }
   }
   ```
4. Build with EAS:
   ```bash
   eas build --platform android
   ```

### 8.2 Monitoring & Analytics

1. **Sentry** (Error tracking)
   ```bash
   npx expo install sentry-expo
   ```

2. **Analytics** (Posthog or Mixpanel)
   ```bash
   npm install posthog-react-native
   ```

3. **Performance Monitoring**
   - Track screen load times
   - Monitor API response times
   - Track user flows

---

## 🎯 Implementation Priority

If you need to launch quickly, implement in this order:

### MVP (Minimum Viable Product):
1. ✅ Authentication (Login/Register/Terms)
2. ✅ Onboarding (Avatar upload)
3. 🚧 Events (Browse + RSVP free events)
4. 🚧 Profile (View + Edit)
5. 🚧 Feed (View admin posts)

### Phase 2:
6. Friends system
7. Notifications (in-app)
8. Event payments (Stripe)
9. Calendar

### Phase 3:
10. Event ratings
11. Push notifications
12. Chat
13. Gallery
14. Admin panel

---

## 📚 Key Resources

1. **Specification:** `docs/CONTEXT.md` (5,336 lines)
2. **Expo Docs:** https://docs.expo.dev
3. **Supabase Docs:** https://supabase.com/docs
4. **React Navigation:** https://reactnavigation.org/docs
5. **Stripe React Native:** https://stripe.com/docs/payments/accept-a-payment?platform=react-native

---

## 🆘 Troubleshooting

### Common Issues:

**1. Supabase not connecting:**
- Check .env variables
- Verify Supabase URL and anon key
- Check RLS policies

**2. Images not uploading:**
- Verify storage bucket exists
- Check storage policies
- Verify file size limits

**3. Navigation errors:**
- Ensure all screens are imported
- Check param types
- Verify navigator hierarchy

**4. Build errors:**
- Clear cache: `expo start -c`
- Reinstall: `rm -rf node_modules && npm install`
- Check for incompatible packages

---

## 🎉 You're Ready!

You now have:
- ✅ Complete project structure
- ✅ Working authentication flow
- ✅ Navigation setup
- ✅ Supabase integration
- ✅ Comprehensive build guide

Start with Phase 1, follow the guide, and refer to `docs/CONTEXT.md` for detailed specifications. Good luck building! 🚀

---

**Questions?** Refer to the specification or create issues in your repo.
