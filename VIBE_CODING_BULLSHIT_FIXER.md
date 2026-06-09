# VIBE_CODING_BULLSHIT_FIXER

Problems that looked right at first glance but were actually broken. Each entry documents what went wrong and why.

## Auth: username stored in user_metadata but never used

**What happened:** The profile link in Header used `user.user_metadata?.username` which was never populated for existing users who signed up before the `updateUser` call was added. The link pointed to `/profile/` (empty username) for everyone except newly-signed-up users.

**Fix:** Moved username source from `user_metadata` to the `profiles` table via a dedicated `profileUsername` field in the AuthContext. Fetched from DB on mount and user change.

**File:** `src/lib/supabase/auth.tsx:30-42`

## Auth: no sign-out option anywhere

**What happened:** After implementing sign-in and sign-up, there was no way to sign out. The auth context had a `signOut` function but no UI exposed it.

**Fix:** Added sign-out buttons to the mobile hamburger menu, the desktop navbar profile area, and the profile page (owner-only).

**Files:** `src/components/layout/Header.tsx`, `src/pages/ProfilePage.tsx`

## Sign-up: username race with DB trigger

**What happened:** The DB trigger `handle_new_user` auto-creates a profile with an email-derived username on `auth.users` insert. The client-side `createProfile` then tried to INSERT a profile with the user's chosen username — which failed with a duplicate key error because a row already existed for that user ID.

**Fix:** Changed `createProfile` from `.insert()` to `.upsert()`, so if the trigger already created a profile, the user's chosen username replaces it.

**File:** `src/lib/supabase/places.ts:191`

## Storage: bucket not created

**What happened:** The RLS migration set up policies on `place-photos` and `review-photos` buckets, but never created the buckets themselves. Uploading a photo returned HTTP 400 with no useful error message.

**Fix:** Added migration `20260609220000_create_storage_buckets.sql` that inserts the buckets into `storage.buckets`. Also switched from `Promise.all` to `Promise.allSettled` so a photo failure doesn't crash place creation.

**Files:** `supabase/migrations/20260609220000_create_storage_buckets.sql`, `src/pages/Home.tsx:82`

## RLS: place delete policy too restrictive

**What happened:** The `places_mod_delete` policy only allowed moderator/admin roles to delete places. The owner never could. The DELETE returned 204 with no error, but RLS silently skipped the row.

**Fix:** Migration `20260609230000_fix_place_delete_policy.sql` drops the old policy and creates `places_owner_delete` which also checks `auth.uid() = submitted_by`.

**File:** `supabase/migrations/20260609230000_fix_place_delete_policy.sql`

## Cache: deletePlace didn't invalidate ['places']

**What happened:** The `deletePlaceMutation.onSuccess` only called `navigate('/')` without invalidating the `['places']` query. The Home page still showed the deleted place until manual reload, even though TanStack Query was configured for caching.

**Fix:** Added `queryClient.invalidateQueries({ queryKey: ['places'] })` in the mutation's `onSuccess` callback.

**File:** `src/pages/PlaceDetailPage.tsx:133`

## PLAN.md: never updated

**What happened:** PLAN.md described the initial plan but was never updated as features were implemented, fixed, or changed. Remaining/Known Issues sections became stale and misleading.

**Fix:** PLAN.md is now kept in sync with actual project state. This file exists to track the things that drift when you don't update the plan.
