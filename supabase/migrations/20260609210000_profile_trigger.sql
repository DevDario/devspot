-- ============================================================
-- Auto-create profile on user signup
-- Run this in Supabase Dashboard SQL Editor to also reset data
-- ============================================================

-- === RESET DATA (run manually if needed) ===
-- DELETE FROM reviews;
-- DELETE FROM saves;
-- DELETE FROM places;
-- DELETE FROM profiles;
-- DELETE FROM auth.users;  -- requires superuser via Supabase dashboard

-- === AUTO-PROFILE TRIGGER ===
-- Creates a profile row automatically when a user signs up.
-- Username is derived from email (part before @).
-- If the username is taken, appends a random suffix.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
  suffix int := 0;
BEGIN
  base_username := split_part(NEW.email, '@', 1);
  final_username := base_username;

  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  END LOOP;

  INSERT INTO public.profiles (id, username, created_at)
  VALUES (NEW.id, final_username, now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
