# Rendezvous Social Club - Testing Guide

Comprehensive testing checklist for all app features.

## 🧪 Pre-Testing Setup

### Requirements
- ✅ Supabase project configured with all tables
- ✅ Storage buckets created and configured
- ✅ At least one invite code created
- ✅ `.env` file with correct credentials
- ✅ Stripe test account configured
- ✅ App running on simulator/device

---

## 1️⃣ Authentication Flow

### Test: User Registration

**Steps:**
1. Open app → See login screen
2. Tap "Create Account"
3. Fill in registration form:
   - Email: `test@example.com`
   - Password: `Test123456!`
   - Full Name: `Test User`
   - Username: `testuser`
   - Invite Code: `TEST2026` (or your code)
4. Tap "Create Account"

**Expected:**
- ✅ Form validates all fields
- ✅ Shows loading indicator
- ✅ Navigates to Terms & Conditions screen

### Test: Terms Acceptance

**Steps:**
1. Read Terms & Conditions
2. Tap "Accept & Continue"

**Expected:**
- ✅ Terms are displayed
- ✅ Records acceptance in database
- ✅ Navigates to onboarding screen

### Test: Login

**Steps:**
1. Logout from profile screen
2. Enter email and password
3. Tap "Sign In"

**Expected:**
- ✅ Shows loading indicator
- ✅ Validates credentials
- ✅ Navigates to main app (or onboarding if not completed)

---

## 2️⃣ Onboarding Flow

### Test: Mandatory Profile Picture

**Steps:**
1. After registration, arrives at onboarding screen
2. Tap "Choose Photo"
3. Select image from library
4. Crop/adjust image
5. Tap "Continue"

**Expected:**
- ✅ Image picker opens
- ✅ Shows selected image preview
- ✅ Uploads to Supabase Storage
- ✅ Updates profile with avatar URL
- ✅ Marks onboarding as complete
- ✅ Navigates to main app

**Verify in Supabase:**
```sql
SELECT avatar_url, onboarding_completed FROM profiles WHERE email = 'test@example.com';
```

---

## 3️⃣ Navigation

### Test: Bottom Tab Navigation

**Steps:**
1. Tap each tab: Feed, Events, Search, Friends, Gallery, Profile
2. Verify each screen loads

**Expected:**
- ✅ All tabs are visible
- ✅ Active tab is highlighted
- ✅ Each screen displays properly
- ✅ Navigation is smooth

### Test: Deep Navigation

**Steps:**
1. From Events tab → Tap event → View details
2. Tap back button → Returns to events list
3. From Profile → Tap "Contact Admin" → Opens chat
4. Tap back → Returns to profile

**Expected:**
- ✅ Stack navigation works
- ✅ Back button appears and works
- ✅ State is preserved when navigating

---

## 4️⃣ Newsfeed

### Test: View Posts

**Steps:**
1. Go to Feed tab
2. Scroll through posts
3. Pull down to refresh

**Expected:**
- ✅ Posts display with title, content, images
- ✅ Different post types shown (announcement, event_promotion, offer)
- ✅ Pull-to-refresh works
- ✅ Empty state if no posts

### Test: Real-time Updates

**Steps:**
1. Open app on device
2. In Supabase, insert new post:
```sql
INSERT INTO posts (type, title, content, status)
VALUES ('announcement', 'New Post', 'Test real-time', 'published');
```
3. Check app

**Expected:**
- ✅ New post appears automatically
- ✅ No page refresh needed

---

## 5️⃣ Events System

### Test: Browse Events

**Steps:**
1. Go to Events tab
2. View event list
3. Use search box
4. Try filters (if implemented)

**Expected:**
- ✅ Events display with image, title, date, price
- ✅ Free events show "FREE" badge
- ✅ Paid events show price
- ✅ Search filters results
- ✅ Empty state if no events

### Test: Event Details

**Steps:**
1. Tap on an event
2. View all event information
3. Check RSVP stats

**Expected:**
- ✅ Full event details displayed
- ✅ Cover image shown
- ✅ Date, time, location visible
- ✅ Attending/Interested counts shown
- ✅ Category badge displayed

### Test: RSVP - Interested

**Steps:**
1. On event detail screen
2. Tap "Interested"
3. Check success message

**Expected:**
- ✅ Shows loading state
- ✅ Success message appears
- ✅ Button state updates
- ✅ RSVP count increments
- ✅ Status badge shows "⭐ You are interested"

**Verify in Supabase:**
```sql
SELECT * FROM event_rsvps WHERE user_id = 'your-user-id';
```

### Test: RSVP - Attend (Free Event)

**Steps:**
1. On free event detail screen
2. Tap "Attend"
3. Confirm RSVP

**Expected:**
- ✅ Shows loading state
- ✅ Success message appears
- ✅ Status changes to "✓ You are attending"
- ✅ Event appears in calendar
- ✅ Friends receive notification (if enabled)

### Test: RSVP - Attend (Paid Event)

**Steps:**
1. On paid event detail screen
2. Tap "Attend"
3. Payment sheet appears
4. Enter test card: `4242 4242 4242 4242`
5. Expiry: Any future date
6. CVC: Any 3 digits
7. Tap "Pay Now"

**Expected:**
- ✅ Status changes to "⏳ Payment pending"
- ✅ Stripe payment sheet opens
- ✅ Shows correct price
- ✅ Payment processes successfully
- ✅ Success message appears
- ✅ Status changes to "✓ You are attending"
- ✅ Event appears in calendar
- ✅ Ticket is created

**Verify in Supabase:**
```sql
-- Check payment
SELECT * FROM payments WHERE user_id = 'your-user-id';

-- Check ticket
SELECT * FROM tickets WHERE user_id = 'your-user-id';

-- Check RSVP
SELECT * FROM event_rsvps WHERE user_id = 'your-user-id' AND status = 'attending_confirmed';
```

### Test: Cancel RSVP

**Steps:**
1. On event you've RSVP'd to
2. Tap "Cancel RSVP"
3. Confirm cancellation

**Expected:**
- ✅ Confirmation dialog appears
- ✅ RSVP is deleted
- ✅ Buttons reset to initial state
- ✅ Event removed from calendar

---

## 6️⃣ Calendar

### Test: View Calendar

**Steps:**
1. Go to Calendar tab
2. View confirmed attending events

**Expected:**
- ✅ Only confirmed events shown
- ✅ Events sorted by date
- ✅ Date, time, location displayed
- ✅ Empty state if no confirmed events

### Test: Event Navigation

**Steps:**
1. Tap event in calendar
2. View event details

**Expected:**
- ✅ Navigates to event detail screen
- ✅ Shows full event information

---

## 7️⃣ Friends System

### Test: Search for Users

**Steps:**
1. Go to Search tab
2. Type username or name in search box
3. Wait for results

**Expected:**
- ✅ Shows "Enter 2 characters" message initially
- ✅ Search activates after 2+ characters
- ✅ Results display with avatar, name, username
- ✅ Shows friendship status (Add Friend, Pending, Friends)
- ✅ Empty state if no results

### Test: Send Friend Request

**Steps:**
1. Search for another user
2. Tap "Add Friend"
3. Check success message

**Expected:**
- ✅ Shows loading state
- ✅ Success message appears
- ✅ Button changes to "Pending"
- ✅ Notification sent to recipient

**Verify in Supabase:**
```sql
SELECT * FROM friend_requests WHERE requester_id = 'your-user-id';
SELECT * FROM notifications WHERE user_id = 'recipient-user-id' AND type = 'friend_request';
```

### Test: Receive & Accept Friend Request

**Steps:**
1. Go to Friends tab
2. Tap "Requests" tab
3. See pending request
4. Tap "Accept"

**Expected:**
- ✅ Request appears in list
- ✅ Shows requester's avatar and name
- ✅ Accept/Decline buttons visible
- ✅ Request accepted successfully
- ✅ Moves to "Friends" tab
- ✅ Requester gets notification

### Test: View Friends List

**Steps:**
1. Go to Friends tab
2. View "Friends" tab
3. See all accepted friendships

**Expected:**
- ✅ All friends displayed
- ✅ Shows avatar, name, username
- ✅ "Remove" button available
- ✅ Pull-to-refresh works

### Test: Remove Friend

**Steps:**
1. In Friends list
2. Tap "Remove" on a friend
3. Confirm removal

**Expected:**
- ✅ Confirmation dialog appears
- ✅ Friend removed from list
- ✅ Success message shown
- ✅ Friendship deleted in database

---

## 8️⃣ Notifications

### Test: View Notifications

**Steps:**
1. Tap notification bell icon
2. View notification list
3. Switch between "All" and "Unread" tabs

**Expected:**
- ✅ Notifications display properly
- ✅ Different types shown (friend request, friend accepted, etc.)
- ✅ Unread notifications highlighted
- ✅ Tabs filter correctly
- ✅ Pull-to-refresh works

### Test: Real-time Notifications

**Steps:**
1. Have friend RSVP to an event
2. Check notifications panel

**Expected:**
- ✅ New notification appears automatically
- ✅ Shows friend's name and event
- ✅ Can tap to view event

### Test: Mark as Read

**Steps:**
1. View an unread notification
2. Check it's marked as read

**Expected:**
- ✅ Notification marked as read on view
- ✅ Unread badge updates
- ✅ Visual indicator changes

---

## 9️⃣ Gallery

### Test: View Gallery

**Steps:**
1. Go to Gallery tab
2. Scroll through images
3. Pull to refresh

**Expected:**
- ✅ Images display in grid (3 columns)
- ✅ Featured images have ⭐ badge
- ✅ Pull-to-refresh works
- ✅ Empty state if no images

### Test: Image Viewer

**Steps:**
1. Tap on an image
2. View full-screen
3. Read caption
4. Tap close button

**Expected:**
- ✅ Modal opens with full-screen image
- ✅ Image displays at full size
- ✅ Caption shown below
- ✅ Event link if applicable
- ✅ Category badge displayed
- ✅ Close button works

---

## 🔟 Chat

### Test: Open Chat

**Steps:**
1. Go to Profile tab
2. Tap "💬 Contact Admin"
3. View chat screen

**Expected:**
- ✅ Chat screen opens
- ✅ Info banner shown
- ✅ Message history loads
- ✅ Input field visible

### Test: Send Message

**Steps:**
1. Type message in input field
2. Tap "Send"
3. View sent message

**Expected:**
- ✅ Message appears in chat
- ✅ Shows on right side (own message)
- ✅ Timestamp displayed
- ✅ Input clears after sending
- ✅ Auto-scrolls to bottom

### Test: Real-time Chat

**Steps:**
1. Have admin reply via Supabase:
```sql
INSERT INTO messages (conversation_id, sender_id, content)
VALUES (
  (SELECT id FROM conversations WHERE user_id = 'your-user-id'),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'Hello, how can I help?'
);
```
2. Check app

**Expected:**
- ✅ Message appears automatically
- ✅ Shows on left side (admin message)
- ✅ Admin name displayed
- ✅ Auto-scrolls to new message

---

## 1️⃣1️⃣ Profile Management

### Test: View Own Profile

**Steps:**
1. Go to Profile tab
2. View profile information

**Expected:**
- ✅ Hero image displayed (default sunset or custom)
- ✅ Avatar displayed
- ✅ Name, username, bio shown
- ✅ Stats shown (events attended, friends count)
- ✅ Action buttons visible

### Test: Update Hero Image

**Steps:**
1. Tap "Change Hero"
2. Select new image
3. Wait for upload

**Expected:**
- ✅ Image picker opens
- ✅ Shows upload progress
- ✅ Hero image updates
- ✅ "Reset to Default" button appears

### Test: Reset Hero to Default

**Steps:**
1. Tap "Reset to Default"
2. Confirm reset

**Expected:**
- ✅ Hero resets to default sunset image
- ✅ "Reset to Default" button disappears
- ✅ Success message shown

### Test: Update Avatar

**Steps:**
1. Tap on avatar
2. Select new image
3. Wait for upload

**Expected:**
- ✅ Image picker opens
- ✅ Shows upload progress
- ✅ Avatar updates
- ✅ Updates throughout app

---

## 1️⃣2️⃣ Admin Dashboard

### Test: Admin Access

**Steps:**
1. Login with admin account
2. Go to Profile tab
3. Tap "⚙️ Admin Dashboard"

**Expected:**
- ✅ Admin button only visible to admins
- ✅ Dashboard opens
- ✅ Statistics displayed
- ✅ Management sections shown

### Test: Statistics Display

**Steps:**
1. View dashboard statistics

**Expected:**
- ✅ Total members shown
- ✅ Total events shown
- ✅ Upcoming events count
- ✅ Total posts shown
- ✅ Pending payments highlighted
- ✅ Numbers are accurate

### Test: Management Sections

**Steps:**
1. Scroll through all sections
2. View available options

**Expected:**
- ✅ Content Management section
- ✅ User Management section
- ✅ Payments & Tickets section
- ✅ Communication section
- ✅ All options listed with icons

---

## 1️⃣3️⃣ Error Handling

### Test: No Internet Connection

**Steps:**
1. Turn off WiFi and mobile data
2. Try to load any screen
3. Try to perform actions

**Expected:**
- ✅ Shows appropriate error messages
- ✅ No app crashes
- ✅ Retry options available

### Test: Invalid Data

**Steps:**
1. Try to register with invalid email
2. Try to login with wrong password
3. Try to upload non-image file

**Expected:**
- ✅ Shows validation errors
- ✅ Clear error messages
- ✅ No app crashes

---

## 🎯 Performance Testing

### Test: App Launch Time

**Expected:**
- ✅ App launches within 3 seconds
- ✅ Splash screen shows
- ✅ Smooth transition to first screen

### Test: Image Loading

**Expected:**
- ✅ Images load smoothly
- ✅ Placeholder shown while loading
- ✅ No jank or freezing

### Test: List Scrolling

**Expected:**
- ✅ Smooth 60fps scrolling
- ✅ No lag or stutter
- ✅ Pull-to-refresh is smooth

---

## 🔐 Security Testing

### Test: Authentication Required

**Steps:**
1. Logout
2. Try to access various screens

**Expected:**
- ✅ Redirected to login
- ✅ Cannot access protected content
- ✅ Session persists on app restart

### Test: Role-Based Access

**Steps:**
1. Login as regular user
2. Check for admin features

**Expected:**
- ✅ No admin dashboard button
- ✅ Cannot access admin screens
- ✅ Proper error if try to access

---

## 📊 Test Results Template

Use this template to track testing:

```
## Test Session: [Date]

### Environment
- Device: [iOS Simulator / Android Emulator / Physical Device]
- OS Version: [iOS 17.0 / Android 14]
- App Version: 1.0.0

### Tests Completed
- [ ] Authentication (3/3 tests passed)
- [ ] Onboarding (1/1 tests passed)
- [ ] Navigation (2/2 tests passed)
- [ ] Newsfeed (2/2 tests passed)
- [ ] Events (6/6 tests passed)
- [ ] Calendar (2/2 tests passed)
- [ ] Friends (5/5 tests passed)
- [ ] Notifications (3/3 tests passed)
- [ ] Gallery (2/2 tests passed)
- [ ] Chat (3/3 tests passed)
- [ ] Profile (4/4 tests passed)
- [ ] Admin (3/3 tests passed)
- [ ] Error Handling (2/2 tests passed)
- [ ] Performance (3/3 tests passed)
- [ ] Security (2/2 tests passed)

### Issues Found
1. [Description]
   - Severity: [High/Medium/Low]
   - Steps to reproduce:
   - Expected:
   - Actual:

### Notes
[Any additional observations]
```

---

## ✅ Pre-Launch Checklist

Before releasing to production:

### Functionality
- [ ] All features tested and working
- [ ] All payment flows tested
- [ ] Real-time features working
- [ ] Image uploads working
- [ ] Push notifications tested

### Performance
- [ ] App launches quickly (<3s)
- [ ] Scrolling is smooth (60fps)
- [ ] Images load efficiently
- [ ] No memory leaks

### Security
- [ ] Authentication required
- [ ] RLS policies working
- [ ] Sensitive data protected
- [ ] API keys not exposed

### User Experience
- [ ] Loading states shown
- [ ] Error messages clear
- [ ] Empty states helpful
- [ ] Navigation intuitive

### Cross-Platform
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Consistent behavior

---

**Ready to test! 🧪**

Use this guide to thoroughly test all app features before launch.
