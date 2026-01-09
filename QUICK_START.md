# Quick Start Guide - Dummy Admin Setup

## 🚀 Step 1: Set Up Supabase (5 minutes)

### Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name:** rendezvous-social-club
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
4. Wait 2-3 minutes for project creation

---

## 🔑 Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

4. Edit `.env` and paste your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
SUPABASE_SERVICE_ROLE_KEY=service-role-key
STRIPE_SECRET_KEY=sk_test_placeholder
```

---

## 📊 Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  hero_image_url TEXT,
  bio TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  share_attendance_with_friends BOOLEAN DEFAULT true,
  events_attended INTEGER DEFAULT 0,
  friends_count INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create terms_acceptances table
CREATE TABLE terms_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT '2026-01-01',
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create events table (simplified for demo)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  price_eur NUMERIC(10,2) DEFAULT 0,
  capacity INTEGER,
  image_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create posts table (for newsfeed)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  post_type TEXT DEFAULT 'announcement',
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles (all members can read, users can update their own)
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for events (all can read, admins can manage)
CREATE POLICY "Events are viewable by authenticated users"
  ON events FOR SELECT
  TO authenticated
  USING (is_published = true);

-- RLS Policies for posts (all can read, admins can manage)
CREATE POLICY "Posts are viewable by authenticated users"
  ON posts FOR SELECT
  TO authenticated
  USING (is_published = true);

-- RLS Policies for terms_acceptances
CREATE POLICY "Users can view own terms acceptances"
  ON terms_acceptances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own terms acceptances"
  ON terms_acceptances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
\`\`\`

4. Click **Run** (bottom right)
5. You should see "Success. No rows returned"

---

## 👤 Step 4: Create Dummy Admin User

### Option A: Via Supabase Dashboard (Easiest)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email:** admin@rendezvous.com
   - **Password:** Admin123!
   - **Auto Confirm User:** ✅ (check this box!)
4. Click **Create user**

5. Now go to **SQL Editor** and run this to make them admin:

\`\`\`sql
-- Get the user ID (copy this from the output)
SELECT id, email FROM auth.users WHERE email = 'admin@rendezvous.com';

-- Replace 'USER_ID_HERE' with the actual UUID from above
INSERT INTO profiles (id, email, username, full_name, is_admin, onboarding_completed)
VALUES (
  'USER_ID_HERE',
  'admin@rendezvous.com',
  'admin',
  'Admin User',
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET is_admin = true, onboarding_completed = true;
\`\`\`

### Option B: Complete SQL Script (Alternative)

Or run this all-in-one script in SQL Editor:

\`\`\`sql
-- Create admin user in auth.users (you'll need to set password manually after)
-- Note: This creates the profile, but you still need to create auth user via dashboard

DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Check if user exists
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@rendezvous.com';
  
  IF admin_id IS NULL THEN
    -- If using Supabase dashboard, create user there first, then run:
    RAISE NOTICE 'Create the user via Supabase Dashboard > Authentication > Add User first';
    RAISE NOTICE 'Email: admin@rendezvous.com, Password: Admin123!';
    RAISE NOTICE 'Then run this script again to create the profile';
  ELSE
    -- Create admin profile
    INSERT INTO profiles (id, email, username, full_name, is_admin, onboarding_completed)
    VALUES (admin_id, 'admin@rendezvous.com', 'admin', 'Admin User', true, true)
    ON CONFLICT (id) DO UPDATE SET is_admin = true, onboarding_completed = true;
    
    RAISE NOTICE 'Admin profile created successfully!';
  END IF;
END $$;
\`\`\`

---

## ✅ Step 5: Test Login

1. **Restart your web app:**

\`\`\`bash
# Stop current server
pkill -f "expo start"

# Start fresh
npx expo start --web
\`\`\`

2. **Open in browser:** http://localhost:8081

3. **Login with:**
   - **Email:** admin@rendezvous.com
   - **Password:** Admin123!

4. **You should see:**
   - ✅ Successful login
   - ✅ Skip to main app (onboarding already completed)
   - ✅ "Admin Panel" button visible in profile (because `is_admin = true`)

---

## 🎨 Step 6: Add Sample Data (Optional)

### Create a Sample Event

\`\`\`sql
INSERT INTO events (title, description, start_time, end_time, location, price_eur, category, is_published, created_by)
SELECT 
  'Welcome Party at Beach Club',
  'Join us for our exclusive welcome party at the beautiful Mallorca Beach Club. Drinks, music, and great company!',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '7 days' + INTERVAL '4 hours',
  'Mallorca Beach Club, Palma',
  25.00,
  'party',
  true,
  id
FROM profiles WHERE email = 'admin@rendezvous.com';
\`\`\`

### Create a Sample Post

\`\`\`sql
INSERT INTO posts (title, content, post_type, is_published, created_by)
SELECT 
  '🎉 Welcome to Rendezvous Social Club!',
  'We''re excited to have you join our exclusive community in Mallorca. Check out our upcoming events and connect with other members!',
  'announcement',
  true,
  id
FROM profiles WHERE email = 'admin@rendezvous.com';
\`\`\`

---

## 🔧 Troubleshooting

### "Invalid credentials" error
- ✅ Make sure you checked "Auto Confirm User" when creating the user
- ✅ Verify the email/password are correct
- ✅ Check that `.env` file has correct Supabase URL and key

### "Profile not found" error
- ✅ Run the profile creation SQL again
- ✅ Verify the user exists in Authentication tab
- ✅ Check that `onboarding_completed = true` in profiles table

### App shows placeholder credentials warning
- ✅ Make sure `.env` file is in the project root
- ✅ Restart the Expo server after creating/updating `.env`
- ✅ Check that variables start with `EXPO_PUBLIC_`

---

## 📱 Next Steps

Once logged in as admin, you can:

1. **View Admin Dashboard** - Tap "Admin Panel" button in profile
2. **Create Events** - Add new events for members to RSVP
3. **Create Posts** - Publish announcements to the newsfeed
4. **Manage Users** - View member list and moderate content
5. **Test Regular User Flow** - Create a non-admin account to test member features

---

## 🎯 Quick Reference

**Admin Credentials:**
- Email: `admin@rendezvous.com`
- Password: `Admin123!`

**Supabase Dashboard:**
- https://app.supabase.com/project/_/editor

**Local Web App:**
- http://localhost:8081

**Documentation:**
- Full spec: `docs/CONTEXT.md`
- Setup guide: `SETUP.md`
- Build guide: `BUILD_GUIDE.md`

---

**Need help?** Check the full SETUP.md file for detailed Supabase configuration!
