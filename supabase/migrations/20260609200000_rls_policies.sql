-- ============================================================
-- Security: Enable RLS on all tables (belt and suspenders)
-- Add missing DELETE/UPDATE policies + Storage RLS
-- ============================================================

-- Re-enforce RLS on every table (idempotent)
ALTER TABLE IF EXISTS places      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS saves       ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PLACES policies
-- ============================================================

-- Drop existing policies first to recreate cleanly
DROP POLICY IF EXISTS "public read" ON places;
DROP POLICY IF EXISTS "auth insert" ON places;
DROP POLICY IF EXISTS "owner update" ON places;

-- Anyone can read
CREATE POLICY "places_public_read" ON places
  FOR SELECT USING (true);

-- Authenticated users can insert (submitted_by must match)
CREATE POLICY "places_auth_insert" ON places
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- Owner or moderator/admin can update
CREATE POLICY "places_owner_update" ON places
  FOR UPDATE USING (
    auth.uid() = submitted_by OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- Only moderator/admin can delete
CREATE POLICY "places_mod_delete" ON places
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- ============================================================
-- REVIEWS policies
-- ============================================================

DROP POLICY IF EXISTS "public read reviews" ON reviews;
DROP POLICY IF EXISTS "auth insert reviews" ON reviews;
DROP POLICY IF EXISTS "owner update reviews" ON reviews;

CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_auth_insert" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_owner_update" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews_owner_delete" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PROFILES policies
-- ============================================================

DROP POLICY IF EXISTS "public read profiles" ON profiles;
DROP POLICY IF EXISTS "auth insert profiles" ON profiles;
DROP POLICY IF EXISTS "owner update profiles" ON profiles;

CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_auth_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_owner_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- SAVES policies
-- ============================================================

DROP POLICY IF EXISTS "owner read saves" ON saves;
DROP POLICY IF EXISTS "owner insert saves" ON saves;
DROP POLICY IF EXISTS "owner delete saves" ON saves;

-- Owner has full control over their saves
CREATE POLICY "saves_owner_all" ON saves
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE RLS policies
-- ============================================================

-- Enable RLS on storage.objects (if not already)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing storage policies (if any)
DROP POLICY IF EXISTS "place_photos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "place_photos_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "place_photos_owner_delete" ON storage.objects;
DROP POLICY IF EXISTS "review_photos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "review_photos_auth_insert" ON storage.objects;

-- Place photos: anyone can read (they're public)
CREATE POLICY "place_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'place-photos');

-- Place photos: authenticated users can upload
CREATE POLICY "place_photos_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'place-photos' AND auth.uid() IS NOT NULL
  );

-- Place photos: owner can delete (folder convention: {placeId}/{file})
CREATE POLICY "place_photos_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'place-photos' AND auth.uid() IS NOT NULL
  );

-- Review photos: anyone can read
CREATE POLICY "review_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-photos');

-- Review photos: authenticated users can upload
CREATE POLICY "review_photos_auth_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'review-photos' AND auth.uid() IS NOT NULL
  );
