-- Fix: allow place owner to delete their own place
-- (previous policy only allowed moderator/admin)

DROP POLICY IF EXISTS "places_mod_delete" ON places;

CREATE POLICY "places_owner_delete" ON places
  FOR DELETE USING (
    auth.uid() = submitted_by OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );
