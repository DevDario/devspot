-- Create storage buckets for place and review photos
-- Must be run after RLS policies migration

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('place-photos', 'place-photos', true),
  ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;
