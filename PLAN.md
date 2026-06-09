# DEVSPOT — Plan & Progress

## Stack
- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4
- **Map:** mapcn (MapLibre GL via shadcn/ui) — free CARTO tiles, no API key
- **Routing:** OSRM (router.project-osrm.org) — free, no key
- **Theme:** Dark/light via CSS variables + ThemeProvider context
- **i18n:** react-i18next + i18next-browser-languagedetector (pt default, en fallback)
- **UI:** shadcn/ui (Button, Map, MapMarker, MapRoute, etc.)
- **Backend:** Supabase (Postgres + Auth + Storage)
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

### State Management
Simple React state with props drilling. Theme + Auth via React context. No external state library.

### CSS Strategy
Tailwind v4 for utility classes + custom `.ds-*` component classes. Shadcn CSS variables for system-level theming.

### Command Palette
Ctrl/Cmd+K opens overlay with 18 functional actions:
- Submit place, toggle language, toggle theme
- Switch view (split/map/list)
- Toggle filters (vibe, use case, type)
- Arrow key navigation, Enter to execute

## Progress Tracking

### Infrastructure
- [x] Project scaffold (Vite + React + TS + Tailwind)
- [x] Design tokens in Tailwind theme
- [x] Component CSS classes (ds-pill, ds-tag, ds-card, etc.)
- [x] TypeScript types (Place, Review, User, Filters, etc.)
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
- [x] All components use useTranslation()
- [x] Default language set to Portuguese

### Theme
- [x] Dark theme default (class="dark" on html)
- [x] Light theme via .light CSS class
- [x] ThemeProvider with localStorage persistence
- [x] Map theme sync

### Command Palette
- [x] Ctrl/Cmd+K overlay with keyboard navigation
- [x] Functional: submit, lang, theme toggle
- [x] Functional: view switch (split/map/list)
- [x] Functional: filter toggle (vibe, use, type)

### UI/UX
- [x] Dev-focused empty states with action buttons
- [x] Loading spinners, error states with retry
- [x] Emoji-free (all icons from Tabler Icons)
- [x] ProfilePage

### Pages
- [x] Home (Supabase data, cmd palette, auth guard)
- [x] PlaceDetailPage (Supabase data, real reviews, photos)
- [x] SignInPage (i18n)
- [x] SignUpPage (i18n)
- [x] ProfilePage (i18n)

### Remaining
- [ ] Seed data (sample places/reviews for Luanda)
- [ ] PlaceCard link to detail page
- [ ] Review submission form
- [ ] Profile page with user's places/reviews
- [ ] Production build test and optimization

## Do's

- Keep component CSS classes matching the HTML prototype exactly
- Use Tabler Icons for all iconography (lucide-react only for shadcn internals)
- Follow the dark/light monospace, terminal-like aesthetic
- Portuguese default for Portuguese-speaking market (Luanda)
- Write clean, minimal code without comments
- Commit each file with a comprehensive message
- Build must pass before committing

## Don'ts

- Don't add comments to code
- Don't use emojis in code — use Tabler Icons
- Don't over-engineer state management
- Don't add features not in the PRD scope

## Current Status
Production-ready MVP with real Supabase data. mapcn/MapLibre GL map with theme-synced basemaps. OSRM routing. i18n (Portuguese default, English toggle). Command palette (Ctrl+K) with 18 actions. Dark/light theme with persistence. Auth with login/signup. Photo uploads to Supabase Storage.

## Known Issues
- PlaceCard doesn't link to detail page (needs PlaceCard update)
- No review submission form yet
- Profile page has no user data
- Chunk size warning for maplibre-gl (needs code splitting)
