# DevSpot — Agent Guide & Architecture Reference

DevSpot is a community-driven map platform for developers in Luanda, Angola to discover, review, and share spots suitable for coding, remote work, meetings, and hackathons.

---

## 1. Tech Stack Overview

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Vite 8 + React 19 | Pure SPA (Single Page Application, no SSR) |
| **Language** | TypeScript 5.x | Strict mode, explicit typing, no `any` |
| **Styling** | Tailwind CSS v4 | `@theme` custom properties + `@custom-variant dark` |
| **Map Engine** | MapLibre GL v5 via mapcn | Free CARTO basemaps (dark-matter / positron), zero API keys |
| **Routing / Directions** | OSRM (Open Source Routing Machine) | Public driving directions API (`router.project-osrm.org`) |
| **Geocoding** | Nominatim (OpenStreetMap) | Autocomplete for Angola (`countrycodes=ao`), 500ms debounce |
| **Data Fetching & Cache** | TanStack Query v5 (`@tanstack/react-query`) | Cached queries, optimistic/mutation invalidation |
| **Validation & Sanitization** | Zod + DOMPurify | Schema validation in `src/lib/schemas.ts`, HTML sanitization |
| **Backend & DB** | Supabase (Postgres 15 + PostGIS) | Row Level Security (RLS), Triggers, FTS |
| **Auth** | Supabase Auth | Email/Password + Google OAuth |
| **Storage** | Supabase Storage | `place-photos` and `review-photos` public buckets |
| **Internationalization** | react-i18next + i18next detector | Portuguese (Angola) default (`pt`), English fallback (`en`) |
| **Typography** | Google Fonts `DotGothic16` | Monospace retro/terminal aesthetic |
| **Iconography** | `@tabler/icons-react` | Exclusively used. **Zero emojis allowed** in UI or code |

---

## 2. Directory Structure

```
devspot/
├── public/                 # Static assets
├── supabase/
│   ├── config.toml         # Supabase CLI configuration
│   └── migrations/         # SQL schemas, RLS policies, DB triggers, storage buckets
├── src/
│   ├── assets/             # Logos, images
│   ├── components/
│   │   ├── cmd/            # Command Palette (⌘K / Ctrl+K overlay)
│   │   ├── filters/        # FilterBar, vibe/use/type pills
│   │   ├── layout/         # Header, LanguageSwitcher, BottomSheet
│   │   ├── map/            # DevSpotMap (MapLibre GL + OSRM routing layer)
│   │   ├── place/          # PlaceCard, PlaceStats, SubmitPlaceModal (multi-step)
│   │   ├── review/         # ReviewCard, StarRating, WifiBar, NoiseLevel, SubmitReviewForm
│   │   └── ui/             # Button, Map primitives (mapcn), Pill, Badges, LogoutOverlay
│   ├── lib/
│   │   ├── hooks/          # useTheme, useUserLocation
│   │   ├── supabase/       # Supabase client, AuthContext, database service (places.ts), types
│   │   ├── utils/          # filters.ts, geo.ts, osrm.ts
│   │   ├── i18n.ts         # Translations (PT default, EN fallback)
│   │   ├── schemas.ts      # Zod validation schemas (placeSchema, reviewSchema)
│   │   └── utils.ts        # shadcn cn() utility
│   ├── pages/
│   │   ├── Home.tsx            # Main view (Split / Map / List views, search, filters)
│   │   ├── PlaceDetailPage.tsx # Spot overview, reviews CRUD, routing, delete spot
│   │   ├── ProfilePage.tsx     # User profile, bio editing, user's spots and reviews
│   │   ├── SignInPage.tsx      # Email/Password + Google OAuth
│   │   ├── SignUpPage.tsx      # Sign up with username auto-profile creation
│   │   └── NotFound.tsx        # 404 terminal page
│   ├── types/
│   │   └── index.ts        # Core TypeScript domain entities & unions
│   ├── App.tsx             # Routes, QueryClientProvider, AuthProvider, ThemeProvider
│   ├── main.tsx            # Entry point
│   └── index.css           # Theme tokens, font import, component classes (.ds-*)
├── AGENTS.md               # Unified AI Agent context & guidelines (this file)
├── GEMINI.md               # Symlink to AGENTS.md for Antigravity / Gemini CLI
├── PLAN.md                 # Roadmap & implementation tracker
├── VIBE_CODING_BULLSHIT_FIXER.md # Historical bug log and lessons learned
├── vercel.json             # Security headers & Content-Security-Policy
└── package.json            # Scripts & dependencies
```

---

## 3. Design System & Theming

### Monospace Aesthetic
All typography uses Google Fonts `DotGothic16, monospace`.
- Labels & secondary metadata: `10px`
- Badges, pills, tags: `11px`
- Body text & form inputs: `12px`
- Card titles: `13px`
- Section headings: `15px`
- Page titles: `18px`

### Color Tokens
Theme is toggled via `class="dark"` or `class="light"` on the `<html>` root element.

#### Dark Mode (Default)
- `--bg`: `#0d0d0d` (Page background)
- `--surf`: `#161616` (Card and modal surfaces)
- `--surf2`: `#1e1e1e` (Inputs, filter pill backgrounds)
- `--border`: `rgba(255, 255, 255, 0.07)`
- `--txt`: `#e8e8e8` (Primary text)
- `--muted`: `#777777` (Muted labels)
- `--dim`: `#444444` (Inactive/faint text)
- `--star`: `#e8c84a` (Rating stars)
- `--wifi`: `#5bc8a0` (WiFi indicators)

#### Light Mode (`html.light`)
- `--bg`: `#f5f5f5`
- `--surf`: `#fafafa`
- `--surf2`: `#f0f0f0`
- `--border`: `rgba(0, 0, 0, 0.08)`
- `--txt`: `#1a1a1a`
- `--muted`: `#888888`
- `--dim`: `#bbbbbb`

### Custom Component CSS Classes (`src/index.css`)
| Class | Description |
|---|---|
| `.ds-pill` | Filter and selection button base |
| `.ds-pill.on-a` | Active state for Vibe filters |
| `.ds-pill.on-g` | Active state for Use-Case filters |
| `.ds-pill.on-s` | Active state for Price filters |
| `.ds-tag` | Tag badge |
| `.ds-tag.use` | Use-case badge variant |
| `.ds-card` | Clickable card surface with hover effect |
| `.step-bar` | Step progress indicator bar |
| `.fld-lbl` | Form field label (`10px`, uppercase, letter-spaced) |

### Icon Mapping (`@tabler/icons-react`)
Never use emoji characters. Use Tabler Icons:
- `café`: `IconCoffee` (marker color: `#b0b0b0`)
- `cowork`: `IconBuilding` (marker color: `#888888`)
- `esplanada`: `IconCoffee` / `IconPlant` (marker color: `#666666`)
- `restaurant`: `IconCoffee` (marker color: `#888888`)
- `library`: `IconCoffee` (marker color: `#888888`)
- `other`: `IconCoffee` (marker color: `#888888`)

---

## 4. Routing & Pages (React Router v7)

- `/` — `Home`: Search, filter pills, split/map/list view modes, interactive map markers, OSRM routing overlay.
- `/place/:id` — `PlaceDetailPage`: Detailed spot metrics, full-size photos, review list, review create/update/delete modal, place owner delete action.
- `/profile/:username` — `ProfilePage`: User statistics, bio editing (inline for profile owner), list of submitted spots and reviews.
- `/signin` — `SignInPage`: Email/Password auth + Google OAuth.
- `/signup` — `SignUpPage`: Account creation with unique username validation (`/^[a-zA-Z0-9_]{3,20}$/`).
- `*` — `NotFound`: Custom 404 page.

---

## 5. State Management & Data Fetching

### TanStack Query Architecture
All Supabase reads and writes use TanStack Query. Caching and invalidation must follow these exact query keys:

| Query Key | Query Function | Invalidation Triggers |
|---|---|---|
| `['places']` | `fetchPlacesWithRatings` | `createPlace`, `deletePlace`, `createReview`, `updateReview`, `deleteReview` |
| `['place', id]` | `fetchPlaceById` | `updatePlace` |
| `['reviews', placeId]` | `fetchReviewsForPlace` | `createReview`, `updateReview`, `deleteReview` |
| `['profile', username]` | `fetchProfileByUsername` | `updateProfile` |
| `['profile-places', userId]` | `fetchPlacesByUserId` | `createPlace`, `deletePlace` |
| `['profile-reviews', userId]` | `fetchReviewsByUserId` | `createReview`, `deleteReview` |

### Query Configuration (`src/App.tsx`)
```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 2 },
    mutations: { retry: 0 },
  },
})
```

---

## 6. Database Schema & RLS Policies

### Tables
1. **`places`**: Spots submitted by users.
   - Types: `'café' | 'cowork' | 'esplanada' | 'restaurant' | 'library' | 'other'`
   - Vibes: `'calm' | 'retro' | 'modern'`
   - Use Cases: `ARRAY['coding', 'cowork', 'meetings', 'hackathon', 'chill']`
   - Price range: `1 | 2 | 3`
   - Coordinates: `lat` (double precision), `lng` (double precision)
   - Search: Trigger-updated `fts` (PostgreSQL `tsvector` with Portuguese dictionary)
2. **`reviews`**: One review per user per place (enforced by `UNIQUE(place_id, user_id)`).
   - Fields: `rating` (1-5), `wifi_quality` (1-3), `noise_level` (`'quiet'|'moderate'|'loud'`), `power_outlets` (boolean), `photos` (text[]), `body` (text).
3. **`profiles`**: Extends `auth.users`.
   - Fields: `id` (uuid -> auth.users), `username` (unique), `avatar_url`, `bio`, `role` (`'user'|'moderator'|'admin'`).
4. **`saves`**: Bookmarked spots.
   - Composite PK: `(user_id, place_id)`.

### RLS Policies
- **Read**: Public for `places`, `reviews`, and `profiles`.
- **Insert**: Authenticated users can insert `places` (`submitted_by = auth.uid()`), `reviews` (`user_id = auth.uid()`), and `saves`.
- **Update**: Owner or moderator/admin can update `places`. Owner can update `reviews` and `profiles`.
- **Delete**: Owner or moderator/admin can delete `places` (`places_owner_delete`). Owner can delete `reviews` and `saves`.

---

## 7. Critical Architecture Patterns & Gotchas

### ⚠️ Gotcha 1: Usernames and DB Trigger Race Condition
- A Postgres trigger (`handle_new_user`) executes on `auth.users` insert and automatically creates a default profile row using the email prefix.
- Therefore, client-side profile creation in `SignUpPage` (`createProfile`) **MUST use `.upsert()`**, never `.insert()`. Otherwise, a duplicate primary key error (`23505`) occurs.

### ⚠️ Gotcha 2: Profile Username vs `user_metadata`
- Do **NOT** rely on `user.user_metadata?.username`. It is not reliably set for existing email users or OAuth users.
- Always use `profileUsername` from `useAuth()`, which fetches directly from the `profiles` table upon session initialization.

### ⚠️ Gotcha 3: Storage Photo Uploads & Batch Resilience
- Buckets: `place-photos` and `review-photos`.
- File validation: Max 5MB (`5 * 1024 * 1024`), allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
- When uploading multiple photos, **always use `Promise.allSettled`** (see `src/pages/Home.tsx`). A single failed photo upload must never crash or abort place creation.

### ⚠️ Gotcha 4: Nominatim Geocoding API
- Nominatim requires a custom `User-Agent` header (`DevSpot/1.0`).
- Always apply a 500ms debounce before querying Nominatim.
- Always include `countrycodes=ao` to constrain results to Angola.

### ⚠️ Gotcha 5: OSRM Routing Coordinates
- OSRM expects coordinates in **`[longitude, latitude]`** format (GeoJSON standard), NOT `[latitude, longitude]`.
- Use the helper `fetchRoute(from: [lng, lat], to: [lng, lat])` in `src/lib/utils/osrm.ts`.

### ⚠️ Gotcha 6: TanStack Mutation Cache Invalidation
- When deleting a place, `invalidateQueries({ queryKey: ['places'] })` must be called before or alongside navigation to `/`.
- When modifying reviews, both `['reviews', placeId]` and `['places']` must be invalidated so average ratings update across cards and map markers.

### ⚠️ Gotcha 7: Content Security Policy (CSP) in `vercel.json`
- Map tiles are fetched from CARTO. Both the bare domain `https://basemaps.cartocdn.com` AND the wildcard `https://*.basemaps.cartocdn.com` must remain in `connect-src` and `img-src`.
- Web workers require `worker-src 'self' blob:`.

---

## 8. Internationalization (i18n) Rules

1. **Default Locale**: Portuguese (`pt`). Target audience is Luanda, Angola.
2. **Fallback**: English (`en`).
3. **Storage & Detection**: Detected from `localStorage` key `'i18nextLng'` or browser language.
4. **Usage**:
   - Every user-facing string must use `useTranslation()`:
     ```tsx
     const { t } = useTranslation()
     return <span>{t('place.reviews')}</span>
     ```
   - All translation keys are organized under namespaces in `src/lib/i18n.ts`: `nav`, `cmd`, `filters`, `place`, `submit`, `review`, `auth`, `profile`, `map`, `view`, `place_type`, `not_found`.
   - **Never introduce hardcoded strings** into components.

---

## 9. Key Conventions for AI Coding Agents

1. **No Code Comments**: Write clean, expressive, self-documenting code. Do not add comments unless explaining an obscure browser or engine bug.
2. **No Emojis**: Strictly forbidden. Use Tabler icons for all iconography.
3. **Strict Typing**: No `any`. Define explicit types or interfaces in `src/types/index.ts` or reuse Supabase database types.
4. **Path Aliases**: Always use `@/` to import from `src/` (e.g., `@/types`, `@/components/ui/Pill`, `@/lib/supabase/client`).
5. **Security**:
   - Never expose `service_role` keys on the client.
   - Always sanitize text inputs using `DOMPurify` before storing.
   - Enforce Zod schemas for all form submissions (`src/lib/schemas.ts`).

---

## 10. Development & Build Commands

```bash
# Start local development server
pnpm dev

# Typecheck and build production bundle
pnpm build

# Run ESLint across codebase
pnpm lint

# Preview production build locally
pnpm preview
```
