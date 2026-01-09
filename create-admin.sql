-- Create Admin User Profile
-- Run this AFTER creating the auth user via Supabase Dashboard

-- Step 1: First, create the auth user in Supabase Dashboard:
-- Go to Authentication > Users > Add User
-- Email: admin@rendezvous.com
-- Password: Admin123!
-- ✅ Check "Auto Confirm User"

-- Step 2: Then run this SQL to create the admin profile:

INSERT INTO profiles (id, email, username, full_name, is_admin, onboarding_completed, avatar_url)
SELECT 
  id, 
  'admin@rendezvous.com', 
  'admin', 
  'Admin User', 
  true, 
  true,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
FROM auth.users 
WHERE email = 'admin@rendezvous.com'
ON CONFLICT (id) DO UPDATE 
SET 
  is_admin = true, 
  onboarding_completed = true;

-- Step 3: Verify the admin was created:
SELECT id, email, username, full_name, is_admin, onboarding_completed 
FROM profiles 
WHERE email = 'admin@rendezvous.com';

-- You should see one row with is_admin = true

-- Step 4: Add some sample data (optional)

-- Sample Event
INSERT INTO events (title, description, start_time, end_time, location, price_eur, category, is_published, created_by)
SELECT 
  '🎉 Welcome Party at Beach Club',
  'Join us for our exclusive welcome party at the beautiful Mallorca Beach Club. Sunset drinks, live music, and great company await!',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '7 days' + INTERVAL '4 hours',
  'Mallorca Beach Club, Palma de Mallorca',
  25.00,
  'party',
  true,
  id
FROM profiles WHERE email = 'admin@rendezvous.com';

-- Sample Post
INSERT INTO posts (title, content, post_type, is_published, created_by)
SELECT 
  '🌟 Welcome to Rendezvous Social Club!',
  'We''re thrilled to have you join our exclusive community in beautiful Mallorca! 🏝️

Connect with like-minded individuals, discover amazing events, and create unforgettable memories.

Check out our upcoming events and start making connections today!',
  'announcement',
  true,
  id
FROM profiles WHERE email = 'admin@rendezvous.com';

-- Another sample event
INSERT INTO events (title, description, start_time, end_time, location, price_eur, category, is_published, created_by)
SELECT 
  '🍷 Wine Tasting at Vineyard',
  'Experience the finest Mallorcan wines at our exclusive vineyard tasting event. Learn about local wine-making traditions and enjoy a curated selection of premium wines.',
  NOW() + INTERVAL '14 days',
  NOW() + INTERVAL '14 days' + INTERVAL '3 hours',
  'Son Prim Winery, Sencelles',
  35.00,
  'food',
  true,
  id
FROM profiles WHERE email = 'admin@rendezvous.com';

-- Free event
INSERT INTO events (title, description, start_time, end_time, location, price_eur, category, is_published, created_by)
SELECT 
  '🏖️ Beach Volleyball Meetup',
  'Join us for a fun and casual beach volleyball game! All skill levels welcome. Great way to meet other members and enjoy the beautiful Mallorcan coast.',
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '5 days' + INTERVAL '2 hours',
  'Playa de Palma',
  0.00,
  'sports',
  true,
  id
FROM profiles WHERE email = 'admin@rendezvous.com';

-- Sample gallery image
INSERT INTO gallery_images (title, description, image_url, is_featured, display_order, uploaded_by)
SELECT 
  'Sunset at Palma',
  'Beautiful sunset view from our last event',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  true,
  1,
  id
FROM profiles WHERE email = 'admin@rendezvous.com';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin user setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Login Credentials:';
  RAISE NOTICE '   Email: admin@rendezvous.com';
  RAISE NOTICE '   Password: Admin123!';
  RAISE NOTICE '';
  RAISE NOTICE '✨ Sample data created:';
  RAISE NOTICE '   - 3 events (2 paid, 1 free)';
  RAISE NOTICE '   - 1 announcement post';
  RAISE NOTICE '   - 1 gallery image';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to test at http://localhost:8081';
END $$;
