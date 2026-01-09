# Local Development Setup with Dummy Data

Run the entire app locally with a pre-populated database (no cloud setup needed!)

## 🚀 Quick Start (One Command!)

```bash
# Install Supabase CLI and start local instance with dummy data
npm run setup:local
```

This will:
1. Install Supabase CLI
2. Start local PostgreSQL + Auth + Storage
3. Create all database tables
4. Add 5 dummy users (including 1 admin)
5. Add sample events, posts, and gallery images
6. Start the web app

**That's it!** 🎉

---

## 📋 Manual Setup (If needed)

### Step 1: Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Or via npm
npm install -g supabase
```

### Step 2: Initialize Supabase Locally

```bash
# Initialize (creates supabase/ folder)
npx supabase init

# Start local Supabase (PostgreSQL + Auth + Storage)
npx supabase start
```

**Wait ~2 minutes** for Docker containers to start. You'll see:

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGc...
service_role key: eyJhbGc...
```

### Step 3: Apply Database Schema

```bash
# Run the setup script
npx supabase db reset

# Or manually:
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed.sql
```

### Step 4: Configure .env for Local

```bash
# Create .env with local credentials
cat > .env << 'EOF'
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
STRIPE_SECRET_KEY=sk_test_demo
EOF
```

### Step 5: Start the App

```bash
npx expo start --web
```

---

## 👥 Dummy User Accounts

The local setup includes 5 pre-created users:

### Admin Account
- **Email:** `admin@local.dev`
- **Password:** `admin123`
- **Role:** Admin (full access to admin panel)
- **Name:** Admin User
- **Profile:** Complete with avatar

### Regular Users

**User 1:**
- **Email:** `alice@local.dev`
- **Password:** `alice123`
- **Name:** Alice Johnson
- **Bio:** Event enthusiast and party lover

**User 2:**
- **Email:** `bob@local.dev`
- **Password:** `bob123`
- **Name:** Bob Smith
- **Bio:** Wine connoisseur and foodie

**User 3:**
- **Email:** `carol@local.dev`
- **Password:** `carol123`
- **Name:** Carol Davis
- **Bio:** Sports and fitness enthusiast

**User 4:**
- **Email:** `david@local.dev`
- **Password:** `david123`
- **Name:** David Wilson
- **Bio:** Music lover and nightlife explorer

---

## 🎯 Dummy Data Included

### Events (6 total)
1. 🎉 **Beach Party** - Tonight at 8 PM (attending: Alice, Bob)
2. 🍷 **Wine Tasting** - Tomorrow at 6 PM (attending: Bob)
3. 🏐 **Volleyball Meetup** - This weekend (interested: Carol, David)
4. 🎵 **Jazz Night** - Next week (attending: David, Alice)
5. 🍕 **Pizza Making Class** - Next week (interested: Bob, Carol)
6. 🌅 **Sunset Yoga** - In 2 weeks (attending: Carol)

### Posts (4 total)
1. Welcome announcement
2. New event reminder
3. Community guidelines
4. Member spotlight

### Gallery Images (8 total)
- Mallorca sunset
- Beach party photos
- Wine tasting event
- Sports activities

### Friend Connections
- Alice ↔ Bob (friends)
- Bob ↔ Carol (friends)
- Carol ↔ David (friends)
- Alice → David (pending request)

### Notifications
- Friend requests
- Friend acceptances
- Event reminders
- New posts

---

## 🎮 Testing Scenarios

### Scenario 1: Admin Workflow
```
1. Login as admin@local.dev / admin123
2. View Admin Panel (button in profile)
3. See all users, events, posts
4. View statistics dashboard
```

### Scenario 2: Regular User Workflow
```
1. Login as alice@local.dev / alice123
2. See feed with posts
3. Browse events (see RSVP status)
4. View calendar (2 confirmed events)
5. Check notifications (friend requests)
6. View friends list
7. Search for other users
```

### Scenario 3: Event RSVP Flow
```
1. Login as david@local.dev / david123
2. Browse events
3. Click on "Pizza Making Class"
4. Click "Interested"
5. Change to "Attend"
6. See payment sheet (for paid events)
7. Confirm attendance
8. Check calendar (event appears)
```

### Scenario 4: Friends System
```
1. Login as alice@local.dev / alice123
2. View notifications (pending request from David)
3. Go to Friends screen
4. Accept David's request
5. See David in friends list
6. Search for more users
7. Send new friend request
```

---

## 🔧 Useful Commands

### View Local Database
```bash
# Open Supabase Studio (GUI)
open http://localhost:54323

# Or use psql
psql postgresql://postgres:postgres@localhost:54322/postgres

# View all users
SELECT id, email, raw_user_meta_data->>'full_name' as name FROM auth.users;

# View all profiles
SELECT username, full_name, is_admin FROM profiles;
```

### Reset Database
```bash
# Reset everything (clears data)
npx supabase db reset

# Re-seed with dummy data
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed.sql
```

### Stop Local Supabase
```bash
npx supabase stop
```

### View Logs
```bash
# Postgres logs
docker logs supabase_db_rendezvous_social

# API logs
npx supabase status
```

---

## 📊 Supabase Studio

Open the local admin panel: **http://localhost:54323**

From here you can:
- Browse tables
- Run SQL queries
- View auth users
- Manage storage buckets
- Test RLS policies
- View logs

---

## 🐛 Troubleshooting

### Docker not running
```bash
# Check Docker
docker ps

# Start Docker Desktop (macOS)
open -a Docker
```

### Port already in use
```bash
# Find and kill process on port 54321
lsof -ti:54321 | xargs kill -9

# Or use different ports
npx supabase start --port 54325
```

### Database connection failed
```bash
# Stop all containers
npx supabase stop

# Remove volumes
docker volume prune

# Start fresh
npx supabase start
```

### "relation does not exist" errors
```bash
# Reset and reapply migrations
npx supabase db reset
```

---

## 🎁 Bonus: Pre-configured Features

The local setup includes:

✅ **Auth:**
- 5 pre-verified users (no email confirmation needed)
- Admin and regular user roles
- Session management

✅ **Database:**
- All tables created
- RLS policies active
- Sample data populated
- Foreign keys and constraints

✅ **Storage:**
- Profile avatars bucket
- Event images bucket
- Gallery images bucket
- Test images uploaded

✅ **Real-time:**
- Subscriptions enabled
- Live updates for posts, events, notifications

---

## 🚀 Next Steps

Once local setup is complete:

1. **Test as Admin:**
   ```
   admin@local.dev / admin123
   ```

2. **Test as Regular User:**
   ```
   alice@local.dev / alice123
   ```

3. **Create New Account:**
   - Registration works (no invite code needed locally)
   - Terms acceptance
   - Profile photo upload

4. **Explore Features:**
   - Events RSVP
   - Friends system
   - Notifications
   - Gallery
   - Search

---

## 📝 Notes

- **No internet needed** - Everything runs locally
- **Fast reset** - `npx supabase db reset` clears everything
- **Safe testing** - No effect on production
- **Easy debugging** - View logs in Supabase Studio

**Happy testing!** 🎉
