-- Rendezvous Social Club - Local Development Seed Data
-- This file creates dummy users, events, posts, and other data for local testing

-- ============================================
-- STEP 1: Create Auth Users
-- ============================================

-- Admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'admin@local.dev',
  '$2a$10$kFvT.qLEy8v7qE4VxGRqcOj.sHvT0LOa0FOvQNJOLG46p/eS72Z/u', -- admin123
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Regular user 1: Alice
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'alice@local.dev',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- alice123
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Alice Johnson"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Regular user 2: Bob
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'bob@local.dev',
  '$2a$10$xNb9jMvQ0EqQ6u9F5K7V9.nQV9a5q5p7H2q4jH5j5q7H2q4jH5j5q', -- bob123
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Bob Smith"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Regular user 3: Carol
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '44444444-4444-4444-4444-444444444444',
  'authenticated',
  'authenticated',
  'carol@local.dev',
  '$2a$10$qH5j5q7H2q4jH5j5qxNb9jMvQ0EqQ6u9F5K7V9.nQV9a5q5p7H2q', -- carol123
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Carol Davis"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Regular user 4: David
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '55555555-5555-5555-5555-555555555555',
  'authenticated',
  'authenticated',
  'david@local.dev',
  '$2a$10$7H2q4jH5j5qxNb9jMvQ0EqQ6u9F5K7V9.nQV9a5q5p7H2qH5j5q', -- david123
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"David Wilson"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Create Profiles
-- ============================================

INSERT INTO profiles (id, email, username, full_name, bio, is_admin, onboarding_completed, avatar_url, events_attended, friends_count) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@local.dev', 'admin', 'Admin User', 'Administrator of Rendezvous Social Club', true, true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 0, 0),
('22222222-2222-2222-2222-222222222222', 'alice@local.dev', 'alice', 'Alice Johnson', 'Event enthusiast and party lover! 🎉 Always up for new adventures.', false, true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice', 2, 2),
('33333333-3333-3333-3333-333333333333', 'bob@local.dev', 'bob', 'Bob Smith', 'Wine connoisseur and foodie 🍷🍕 Love exploring Mallorca''s culinary scene.', false, true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', 2, 2),
('44444444-4444-4444-4444-444444444444', 'carol@local.dev', 'carol', 'Carol Davis', 'Sports and fitness enthusiast! 🏐⚽ Beach volleyball is my passion.', false, true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol', 1, 2),
('55555555-5555-5555-5555-555555555555', 'david@local.dev', 'david', 'David Wilson', 'Music lover and nightlife explorer 🎵🌃 Jazz is life!', false, true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', 1, 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 3: Create Events
-- ============================================

INSERT INTO events (id, title, description, start_time, end_time, location, price_eur, category, is_published, created_by, rsvp_count_interested, rsvp_count_attending, image_url) VALUES
(
  'e1111111-1111-1111-1111-111111111111',
  '🎉 Beach Party at Sunset',
  'Join us for an unforgettable evening at Mallorca''s most beautiful beach! Enjoy sunset cocktails, live DJ, and great company. Dress code: Beach chic.',
  NOW() + INTERVAL '6 hours',
  NOW() + INTERVAL '10 hours',
  'Playa de Palma Beach Club',
  25.00,
  'party',
  true,
  '11111111-1111-1111-1111-111111111111',
  0,
  2,
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800'
),
(
  'e2222222-2222-2222-2222-222222222222',
  '🍷 Wine Tasting at Vineyard',
  'Experience the finest Mallorcan wines at our exclusive vineyard event. Tour the facilities, meet the winemaker, and enjoy a curated tasting of 6 premium wines paired with local cheeses and charcuterie.',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day' + INTERVAL '3 hours',
  'Son Prim Winery, Sencelles',
  35.00,
  'food',
  true,
  '11111111-1111-1111-1111-111111111111',
  0,
  1,
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800'
),
(
  'e3333333-3333-3333-3333-333333333333',
  '🏐 Beach Volleyball Tournament',
  'Calling all volleyball enthusiasts! Join our friendly tournament at the beach. All skill levels welcome. Teams will be formed on the spot. Bring your energy and competitive spirit!',
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days' + INTERVAL '3 hours',
  'Playa de Palma',
  0.00,
  'sports',
  true,
  '11111111-1111-1111-1111-111111111111',
  2,
  0,
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800'
),
(
  'e4444444-4444-4444-4444-444444444444',
  '🎵 Jazz Night at La Cantina',
  'Intimate evening of live jazz music featuring local and international artists. Enjoy craft cocktails and tapas while soaking in the smooth sounds. Limited seating - book now!',
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '5 days' + INTERVAL '4 hours',
  'La Cantina Jazz Club, Palma',
  20.00,
  'music',
  true,
  '11111111-1111-1111-1111-111111111111',
  0,
  2,
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800'
),
(
  'e5555555-5555-5555-5555-555555555555',
  '🍕 Italian Pizza Making Class',
  'Learn the art of authentic Italian pizza from Chef Marco! Hands-on class includes making your own dough, selecting toppings, and enjoying your creations. Wine included!',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '7 days' + INTERVAL '3 hours',
  'Cucina Italiana Cooking School',
  40.00,
  'food',
  true,
  '11111111-1111-1111-1111-111111111111',
  2,
  0,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'
),
(
  'e6666666-6666-6666-6666-666666666666',
  '🌅 Sunrise Yoga & Meditation',
  'Start your day with peace and mindfulness. Join our certified instructor for an hour of gentle yoga followed by guided meditation on the beach. All levels welcome. Mats provided.',
  NOW() + INTERVAL '10 days',
  NOW() + INTERVAL '10 days' + INTERVAL '2 hours',
  'Es Trenc Beach',
  0.00,
  'wellness',
  true,
  '11111111-1111-1111-1111-111111111111',
  0,
  1,
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 4: Create Event RSVPs
-- ============================================

INSERT INTO event_rsvps (event_id, user_id, status) VALUES
-- Beach Party (Alice and Bob attending)
('e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'attending_confirmed'),
('e1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'attending_confirmed'),

-- Wine Tasting (Bob attending)
('e2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'attending_confirmed'),

-- Volleyball (Carol and David interested)
('e3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'interested'),
('e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'interested'),

-- Jazz Night (David and Alice attending)
('e4444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'attending_confirmed'),
('e4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'attending_confirmed'),

-- Pizza Class (Bob and Carol interested)
('e5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'interested'),
('e5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'interested'),

-- Yoga (Carol attending)
('e6666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'attending_confirmed')
ON CONFLICT (event_id, user_id) DO NOTHING;

-- ============================================
-- STEP 5: Create Posts (Newsfeed)
-- ============================================

INSERT INTO posts (id, title, content, post_type, is_published, created_by, image_url) VALUES
(
  'p1111111-1111-1111-1111-111111111111',
  '🎉 Welcome to Rendezvous Social Club!',
  'We''re thrilled to have you join our exclusive community in beautiful Mallorca! 🏝️

Connect with like-minded individuals, discover amazing events, and create unforgettable memories. 

Our community is built on respect, friendship, and the joy of shared experiences. Check out our upcoming events and start making connections today!

¡Bienvenidos! 🌟',
  'announcement',
  true,
  '11111111-1111-1111-1111-111111111111',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
),
(
  'p2222222-2222-2222-2222-222222222222',
  '🔥 This Week''s Events - Don''t Miss Out!',
  'Hey everyone! 👋

We have an incredible lineup this week:

🎉 Tonight: Beach Party at Sunset
🍷 Tomorrow: Wine Tasting
🏐 Weekend: Volleyball Tournament

All events have limited capacity, so RSVP soon! See you there! 🌊',
  'event_promo',
  true,
  '11111111-1111-1111-1111-111111111111',
  NULL
),
(
  'p3333333-3333-3333-3333-333333333333',
  '📖 Community Guidelines Reminder',
  'A friendly reminder about our community values:

✨ Respect everyone
🤝 Be inclusive and welcoming
📸 Ask before sharing photos
🎯 RSVP responsibly
💬 Communicate openly

Together we create an amazing community! Thank you for being part of it. 🙏',
  'announcement',
  true,
  '11111111-1111-1111-1111-111111111111',
  NULL
),
(
  'p4444444-4444-4444-4444-444444444444',
  '⭐ Member Spotlight: Alice J.',
  'This week we''re featuring Alice, one of our most active members! 🌟

Alice has attended over 15 events and is always the life of the party. Her enthusiasm is contagious!

"I love the diversity of events and the amazing people I''ve met through Rendezvous. It''s like having a second family in Mallorca!" - Alice

Keep being awesome, Alice! 🎉',
  'member_feature',
  true,
  '11111111-1111-1111-1111-111111111111',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 6: Create Friend Requests
-- ============================================

INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES
-- Alice and Bob are friends
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'accepted'),
-- Bob and Carol are friends
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'accepted'),
-- Carol and David are friends
('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'accepted'),
-- Alice sent request to David (pending)
('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'pending')
ON CONFLICT (sender_id, receiver_id) DO NOTHING;

-- Update friends counts
UPDATE profiles SET friends_count = 2 WHERE id IN ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');
UPDATE profiles SET friends_count = 1 WHERE id = '55555555-5555-5555-5555-555555555555';

-- ============================================
-- STEP 7: Create Notifications
-- ============================================

INSERT INTO notifications (recipient_id, sender_id, type, title, body, is_read) VALUES
-- Friend request notification for David
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'friend_request', 'New Friend Request', 'Alice Johnson sent you a friend request', false),

-- Friend accepted notifications
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'friend_accepted', 'Friend Request Accepted', 'Alice Johnson accepted your friend request', true),
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'friend_accepted', 'Friend Request Accepted', 'Bob Smith accepted your friend request', true),

-- Event attendance notifications
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'friend_attending_event', 'Friend Attending Event', 'Alice Johnson is attending Beach Party at Sunset', false),
('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'friend_attending_event', 'Friend Attending Event', 'David Wilson is attending Jazz Night at La Cantina', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 8: Create Gallery Images
-- ============================================

INSERT INTO gallery_images (id, title, description, image_url, is_featured, display_order, uploaded_by) VALUES
(
  'g1111111-1111-1111-1111-111111111111',
  'Mallorca Sunset',
  'Beautiful sunset over the Mediterranean',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  true,
  1,
  '11111111-1111-1111-1111-111111111111'
),
(
  'g2222222-2222-2222-2222-222222222222',
  'Beach Party Vibes',
  'Last month''s epic beach party',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
  true,
  2,
  '11111111-1111-1111-1111-111111111111'
),
(
  'g3333333-3333-3333-3333-333333333333',
  'Wine Tasting Excellence',
  'Premium local wines',
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
  false,
  3,
  '11111111-1111-1111-1111-111111111111'
),
(
  'g4444444-4444-4444-4444-444444444444',
  'Volleyball Action',
  'Community sports event',
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
  false,
  4,
  '11111111-1111-1111-1111-111111111111'
),
(
  'g5555555-5555-5555-5555-555555555555',
  'Jazz Night Magic',
  'Live music at its finest',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
  true,
  5,
  '11111111-1111-1111-1111-111111111111'
),
(
  'g6666666-6666-6666-6666-666666666666',
  'Palma Old Town',
  'Exploring the historic streets',
  'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800',
  false,
  6,
  '11111111-1111-1111-1111-111111111111'
),
(
  'g7777777-7777-7777-7777-777777777777',
  'Coastal Views',
  'The stunning Mallorca coastline',
  'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800',
  false,
  7,
  '11111111-1111-1111-1111-111111111111'
),
(
  'g8888888-8888-8888-8888-888888888888',
  'Group Photo',
  'Our amazing community at last week''s meetup',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
  true,
  8,
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 9: Create Terms Acceptances
-- ============================================

INSERT INTO terms_acceptances (user_id, version) VALUES
('11111111-1111-1111-1111-111111111111', '2026-01-01'),
('22222222-2222-2222-2222-222222222222', '2026-01-01'),
('33333333-3333-3333-3333-333333333333', '2026-01-01'),
('44444444-4444-4444-4444-444444444444', '2026-01-01'),
('55555555-5555-5555-5555-555555555555', '2026-01-01')
ON CONFLICT DO NOTHING;

-- ============================================
-- Success Message
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Local database seeded successfully!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '👥 5 Users Created:';
  RAISE NOTICE '   • admin@local.dev / admin123 (Admin)';
  RAISE NOTICE '   • alice@local.dev / alice123';
  RAISE NOTICE '   • bob@local.dev / bob123';
  RAISE NOTICE '   • carol@local.dev / carol123';
  RAISE NOTICE '   • david@local.dev / david123';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 6 Events Created (with RSVPs)';
  RAISE NOTICE '📝 4 Posts Created';
  RAISE NOTICE '🖼️  8 Gallery Images Created';
  RAISE NOTICE '👫 4 Friend Connections Created';
  RAISE NOTICE '🔔 4 Notifications Created';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to test at http://localhost:8081';
  RAISE NOTICE '';
END $$;
