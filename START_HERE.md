# 🎯 START HERE - Local Demo Setup

Get the app running locally with dummy data in **5 minutes**!

## ✅ Prerequisites Checklist

- [ ] macOS (or Linux with Docker)
- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed

---

## 📦 Step 1: Install Docker Desktop (if not installed)

### Download Docker Desktop
👉 https://www.docker.com/products/docker-desktop

1. Download for your OS
2. Install and start Docker Desktop
3. Wait for the Docker icon to appear in your menu bar

**Check if Docker is running:**
```bash
docker ps
```

If you see a table output (even if empty), Docker is ready! ✅

---

## 🚀 Step 2: Run the Setup (ONE COMMAND!)

```bash
npm run setup:local
```

### What This Does:

1. ✅ Installs Supabase CLI (if needed)
2. ✅ Starts PostgreSQL database in Docker
3. ✅ Creates all database tables
4. ✅ Seeds with 5 users + sample data
5. ✅ Creates `.env` file automatically
6. ✅ Starts the web app

**Wait time:** 2-3 minutes (only first time)

---

## 🎉 Step 3: Login & Test

Once the setup completes, the web app will open at:
**http://localhost:8081**

### Login as Admin:
```
Email: admin@local.dev
Password: admin123
```

### Or as Regular User:
```
Email: alice@local.dev
Password: alice123
```

---

## 🎮 What You'll See

### As Admin (`admin@local.dev`):
- ✅ Feed with 4 posts
- ✅ 6 events (parties, wine tasting, sports)
- ✅ 8 gallery images
- ✅ "Admin Panel" button in profile
- ✅ Admin dashboard with stats

### As Alice (`alice@local.dev`):
- ✅ Feed with announcements
- ✅ 2 confirmed events in calendar
- ✅ Friends list (Bob)
- ✅ Pending friend request from David
- ✅ Notifications for events & friends

---

## 🔄 Quick Commands Reference

```bash
# Start everything (first time)
npm run setup:local

# Start database only
npm run db:start

# Stop database
npm run db:stop

# Reset database (clear all data)
npm run db:reset

# Open database GUI
npm run db:studio

# Start app + database
npm run dev:local
```

---

## 📊 What's Included

### 👥 5 Users
- **admin@local.dev** (Admin with full access)
- **alice@local.dev** (Active member, 2 events)
- **bob@local.dev** (Wine enthusiast, 2 events)
- **carol@local.dev** (Sports lover, 1 event)
- **david@local.dev** (Music fan, 1 event)

All passwords: `[username]123` (e.g., `alice123`)

### 🎯 6 Events
1. 🎉 Beach Party (tonight) - Alice & Bob attending
2. 🍷 Wine Tasting (tomorrow) - Bob attending
3. 🏐 Volleyball Tournament (weekend) - Carol & David interested
4. 🎵 Jazz Night - David & Alice attending
5. 🍕 Pizza Making Class - Bob & Carol interested
6. 🌅 Sunrise Yoga - Carol attending

### 📝 4 Posts
- Welcome announcement
- Event reminders
- Community guidelines
- Member spotlight

### 🖼️ 8 Gallery Images
- Mallorca sunset
- Beach parties
- Wine tasting
- Sports activities

### 👫 Friendships
- Alice ↔ Bob (friends)
- Bob ↔ Carol (friends)
- Carol ↔ David (friends)
- Alice → David (pending request)

---

## 🎨 Test Scenarios

### Scenario 1: Admin Overview
1. Login as `admin@local.dev` / `admin123`
2. Click "Admin Panel" in profile
3. View statistics dashboard
4. See all users and events

### Scenario 2: User Event Flow
1. Login as `alice@local.dev` / `alice123`
2. Browse events in Events tab
3. See "Beach Party" (already attending)
4. RSVP to "Volleyball Tournament"
5. Check Calendar tab (3 events now)

### Scenario 3: Friends System
1. Login as `david@local.dev` / `david123`
2. See notification (Alice sent friend request)
3. Go to Friends tab
4. Accept Alice's request
5. Search for "bob"
6. Send friend request to Bob

### Scenario 4: Explore Gallery
1. Login as any user
2. Go to Gallery tab
3. View 8 images in grid
4. Tap any image for fullscreen view
5. Swipe through gallery

---

## 🌐 Access Points

- **Web App:** http://localhost:8081
- **Supabase Studio:** http://localhost:54323 (Database GUI)
- **API:** http://localhost:54321

---

## 🐛 Troubleshooting

### "Docker not found" error
```bash
# macOS: Install Docker Desktop
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop
```

### "Port already in use"
```bash
# Stop existing Supabase
npm run db:stop

# Or kill the specific port
lsof -ti:54321 | xargs kill -9
```

### "Database connection failed"
```bash
# Reset everything
npm run db:stop
docker volume prune -f
npm run setup:local
```

### App shows "Backend not configured"
```bash
# Restart the setup
npm run db:stop
npm run setup:local
```

---

## 📖 Documentation

- **Quick Guide:** `LOCAL_README.md`
- **Detailed Setup:** `LOCAL_SETUP.md`
- **Database Schema:** `supabase-setup.sql`
- **Seed Data:** `supabase/seed.sql`
- **Full Spec:** `docs/CONTEXT.md`

---

## ✨ Success Checklist

After running `npm run setup:local`, you should have:

- [ ] Docker Desktop running
- [ ] Supabase containers started
- [ ] Database seeded with 5 users
- [ ] `.env` file created
- [ ] Web app open at http://localhost:8081
- [ ] Can login as admin@local.dev / admin123
- [ ] See events, posts, gallery
- [ ] Admin panel accessible

---

## 🎉 You're Ready!

Everything is set up and running locally. No cloud accounts needed!

**Test the entire app with realistic data:**
- Complete user flows
- Event RSVP system
- Friends and notifications
- Admin panel
- Gallery and feed

**All changes are local and can be reset anytime with `npm run db:reset`**

---

## 🚀 Next Steps

1. Test all features as different users
2. Try creating new accounts (registration works!)
3. Explore admin dashboard
4. View database in Supabase Studio
5. When ready for production, follow `SETUP.md` for cloud deployment

**Happy testing!** 🎊
