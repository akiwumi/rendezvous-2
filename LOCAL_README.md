# 🚀 Local Development - Quick Reference

Run the entire app locally with dummy data in **under 5 minutes**!

## ⚡ One-Command Setup

```bash
npm run setup:local
```

That's it! This command will:
1. ✅ Install Supabase CLI (if needed)
2. ✅ Start local PostgreSQL database
3. ✅ Create all tables and policies
4. ✅ Seed with 5 users + dummy data
5. ✅ Start the web app

---

## 👥 Login Accounts

### Admin
```
Email: admin@local.dev
Password: admin123
```

### Regular Users
```
alice@local.dev / alice123
bob@local.dev / bob123
carol@local.dev / carol123
david@local.dev / david123
```

---

## 📊 Included Data

- **6 Events** (parties, wine tasting, sports, music)
- **4 Posts** (announcements, promos)
- **8 Gallery Images**
- **4 Friend Connections**
- **Multiple RSVPs & Notifications**

---

## 🎮 Quick Commands

```bash
# Start everything (one command)
npm run setup:local

# Start just the database
npm run db:start

# Stop database
npm run db:stop

# Reset database (clear all data)
npm run db:reset

# Open Supabase Studio (database GUI)
npm run db:studio

# Start db + app together
npm run dev:local
```

---

## 🌐 Access Points

- **Web App:** http://localhost:8081
- **Supabase Studio:** http://localhost:54323
- **API:** http://localhost:54321

---

## 🔧 Manual Setup (if needed)

1. **Install Supabase CLI:**
   ```bash
   brew install supabase/tap/supabase
   ```

2. **Start Supabase:**
   ```bash
   supabase start
   ```

3. **Create .env:**
   ```bash
   cat > .env << 'EOF'
   EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   EOF
   ```

4. **Seed database:**
   ```bash
   psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed.sql
   ```

5. **Start app:**
   ```bash
   npm run web
   ```

---

## 🐛 Troubleshooting

### Docker not running
```bash
# macOS: Start Docker Desktop
open -a Docker
```

### Port conflicts
```bash
# Stop Supabase
npm run db:stop

# Kill any process on port
lsof -ti:54321 | xargs kill -9
```

### Database errors
```bash
# Reset everything
npm run db:stop
npm run db:start
npm run db:reset
```

---

## 📖 Full Documentation

- **Detailed guide:** `LOCAL_SETUP.md`
- **Database schema:** `supabase-setup.sql`
- **Seed data:** `supabase/seed.sql`
- **Full spec:** `docs/CONTEXT.md`

---

## ✨ Ready to Test!

1. Run `npm run setup:local`
2. Login as `admin@local.dev` / `admin123`
3. Explore all features with real-looking data!

**No cloud setup needed. Everything runs locally.** 🎉
