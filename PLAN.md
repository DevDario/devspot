# DEVSPOT — Plan & Progress

## Stack
- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4
- **Map:** mapcn (MapLibre GL via shadcn/ui) — free CARTO tiles, no API key
- **Routing:** OSRM (router.project-osrm.org) — free, no key
- **Theme:** Dark/light via CSS variables + ThemeProvider context
- **i18n:** react-i18next + i18next-browser-languagedetector (pt default, en fallback)
- **UI:** shadcn/ui (Button, Map, MapMarker, MapRoute, etc.)
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Data Fetching:** TanStack Query (@tanstack/react-query) — caching, mutations, auto-refetch
- **Validation:** Zod (zod) — schema-based form validation
- **Icons:** Tabler Icons (@tabler/icons-react), lucide-react (shadcn dependency)
- **Font:** DotGothic16 (Google Fonts)

## Architecture Decisions

### Why not Next.js?
User requested Vite instead of Next.js. React Router v7 handles SPA routing.

### Map Strategy — mapcn (Maplibre GL)
mapcn shadcn/ui component wrapping Maplibre GL JS:
- Free CARTO basemaps (dark-matter / positron, theme-synced)
- Built-in controls (zoom, compass, locate, fullscreen)
- `<MapMarker>` with `<MarkerContent>` and `<MarkerTooltip>`
- `<MapRoute>` for OSRM route overlays
- `<MapClusterLayer>` for clustered markers
- No API key required

### Routing — OSRM
Public OSRM API at `router.project-osrm.org` for driving directions:
- Route geometry rendered as `<MapRoute>` on the map
- Distance/duration displayed in route info panel
- Browser Geolocation API for user origin

### Theme Strategy
- Dark theme default via `class="dark"` on `<html>`
- `.light` CSS class overrides shadcn variables + DevSpot custom colors
- `ThemeProvider` context with localStorage persistence
- Map basemap syncs automatically (CARTO dark-matter ↔ positron)

### i18n Strategy
- Portuguese (Angolan) default language, English fallback
- Language detection via localStorage → navigator
- All user-facing strings in `src/lib/i18n.ts`
- `LanguageSwitcher` in header toggles pt ↔ en
- All hardcoded English strings replaced with t() calls

### Data Fetching Strategy
- TanStack Query for all Supabase data operations
- `useQuery` for reads (places, reviews, profile)
- `useMutation` for writes (createPlace, createReview)
- Automatic cache invalidation on mutations
- staleTime: 15-30s for responsive UI

### Form Validation Strategy
- Zod schemas in `src/lib/schemas.ts` (placeSchema, reviewSchema)
- Real-time field validation on submit
- Error messages use i18n t() keys
- Address field with Nominatim autocomplete geocoding

### Address Input
- Text input with Nominatim OpenStreetMap API autocomplete
- 500ms debounce, 1 req/sec rate limit respected
- Country filter: Angola (ao)
- Lat/lng populated from selected address result
- Falls back to geolocation toggle for location

### State Management
TanStack Query for server state. React context for theme + auth. Local component state for forms and UI.

### CSS Strategy
Tailwind v4 for utility classes + custom `.ds-*` component classes. Shadcn CSS variables for system-level theming.

### Command Palette
Ctrl/Cmd+K opens overlay with 18 functional actions:
- Submit place, toggle language, toggle theme
- Switch view (split/map/list)
- Toggle filters (vibe, use case, type)
- Arrow key navigation, Enter to execute
- All labels use t() for i18n

## Progress Tracking

### Infrastructure
- [x] Project scaffold (Vite + React + TS + Tailwind)
- [x] Design tokens in Tailwind theme
- [x] Component CSS classes (ds-pill, ds-tag, ds-card, etc.)
- [x] TypeScript types (Place, PlaceWithRating, Review, User, Filters, etc.)
- [x] shadcn/ui + mapcn initialized
- [x] Supabase project created and linked (brdesbsngyoqixfdnfgd)
- [x] Database schema deployed (places, reviews, profiles, saves + RLS + storage)

### Auth & Data Layer
- [x] Auth context (signIn/signUp/signOut/Google OAuth)
- [x] Auth pages (SignInPage, SignUpPage)
- [x] Supabase data service (fetchPlaces, createPlace, uploadPhoto, etc.)
- [x] Photo upload to Supabase Storage (place-photos bucket)
- [x] Auth guard: submit requires login (redirects to /signin)

### Map & Routing
- [x] Map component (DevSpotMap with mapcn/MapLibre GL)
- [x] OSRM routing integration (route from user location to selected place)
- [x] Mapbox removed (no references, no types package)
- [x] Theme-synced map basemap (dark ↔ light CARTO)

### i18n
- [x] i18n setup (react-i18next, pt/en locales)
- [x] LanguageSwitcher in header
- [x] All components use useTranslation() — no hardcoded strings
- [x] Default language set to Portuguese
- [x] Complete PT ↔ EN translation coverage

### Theme
- [x] Dark theme default (class="dark" on html)
- [x] Light theme via .light CSS class
- [x] ThemeProvider with localStorage persistence
- [x] Map theme sync
- [x] Theme toggle button in header (sun/moon icon)

### Command Palette
- [x] Ctrl/Cmd+K overlay with keyboard navigation
- [x] i18n support for all labels and groups
- [x] Functional: submit, lang, theme toggle
- [x] Functional: view switch (split/map/list)
- [x] Functional: filter toggle (vibe, use, type)

### TanStack Query Integration
- [x] @tanstack/react-query installed
- [x] QueryClientProvider wrapping app
- [x] useQuery for places, reviews, profile data
- [x] useMutation for createPlace, createReview
- [x] Cache invalidation on mutations for auto-refresh

### Form Validation
- [x] Zod schemas (placeSchema, reviewSchema)
- [x] Validation errors displayed below fields
- [x] i18n error messages via t()
- [x] Submit disabled during mutation (loading state)

### Address Input
- [x] Address text field with Nominatim autocomplete
- [x] Geolocation toggle (ON/OFF) as alternative
- [x] Lat/lng populated from selected address
- [x] Validation: address required when location OFF

### Pages
- [x] Home (TanStack Query, real ratings, cmd palette, auth guard)
- [x] PlaceDetailPage (TanStack Query, real reviews, photos, single back button)
- [x] SignInPage (i18n)
- [x] SignUpPage (i18n)
- [x] ProfilePage (TanStack Query, real places with ratings)

### Remaining
- [ ] Seed data (sample places/reviews for Luanda)
- [ ] Code splitting for maplibre-gl (large chunk warning)
- [ ] Review display: show wifi/noise/power details
- [ ] Edit/delete own places and reviews
- [ ] Real-time updates via Supabase subscriptions

## Do's

- Keep component CSS classes matching the HTML prototype exactly
- Use Tabler Icons for all iconography (lucide-react only for shadcn internals)
- Follow the dark/light monospace, terminal-like aesthetic
- Portuguese default for Portuguese-speaking market (Luanda)
- Write clean, minimal code without comments
- Commit each file with a comprehensive message
- Build must pass before committing
- Use TanStack Query for all server data

## Don'ts

- Don't add comments to code
- Don't use emojis in code — use Tabler Icons
- Don't over-engineer state management
- Don't add features not in the PRD scope
- Don't hardcode strings — always use t()

## Current Status
Production-ready MVP with TanStack Query, Zod validation, real Supabase data, and responsive UI. mapcn/MapLibre GL map with theme-synced basemaps. OSRM routing. Full i18n (Portuguese default, English toggle) with no hardcoded strings. Command palette (Ctrl+K) with 18 actions and i18n labels. Dark/light theme with header toggle button and persistence. Auth with login/signup/Google OAuth. Photo uploads to Supabase Storage. Address input with Nominatim geocoding. Place ratings calculated from real reviews.

## Known Issues
- Chunk size warning for maplibre-gl (needs code splitting)
- Review display missing wifi/noise/power details (only rating + body shown)
- No edit/delete for own places/reviews
- No seed data for Luanda places in the database
