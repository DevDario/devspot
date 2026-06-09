# DEVSPOT — Plan & Progress

## Stack
- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4
- **Map:** mapcn (MapLibre GL via shadcn/ui) — free CARTO tiles, no API key
- **Routing:** OSRM (router.project-osrm.org) — free, no key
- **i18n:** react-i18next + i18next-browser-languagedetector (pt default, en fallback)
- **UI:** shadcn/ui (Button, Map, MapMarker, MapRoute, etc.)
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Icons:** Tabler Icons (@tabler/icons-react), lucide-react (shadcn dependency)
- **Font:** DotGothic16 (Google Fonts)

## Architecture Decisions

### Why not Next.js?
User requested Vite instead of Next.js. React Router v7 handles SPA routing.

### Map Strategy — mapcn (Maplibre GL)
Replaced SVG grid fallback with mapcn, a shadcn/ui component wrapping Maplibre GL JS:
- Free CARTO basemaps (dark-matter / positron auto-theme)
- Built-in controls (zoom, compass, locate, fullscreen)
- `<MapMarker>` with `<MarkerContent>` and `<MarkerTooltip>`
- `<MapRoute>` for OSRM route overlays
- `<MapClusterLayer>` for clustered markers
- No API key required

### Routing — OSRM
Public OSRM API at `router.project-osrm.org` for driving directions:
- Route geometry rendered as `<MapRoute>` on the map
- Distance/duration displayed below the route button
- Browser Geolocation API for user origin

### i18n Strategy
- Portuguese (Angolan) default language, English fallback
- Language detection via localStorage → navigator
- All user-facing strings in `src/lib/i18n.ts`
- `LanguageSwitcher` in header toggles pt ↔ en

### State Management
Simple React state with props drilling. No external state library needed at this scale.

### CSS Strategy
Tailwind v4 for utility classes + custom `.ds-*` component classes that match the HTML prototype's exact design language.

## Progress Tracking

- [x] Project scaffold (Vite + React + TS + Tailwind)
- [x] Design tokens in Tailwind theme
- [x] Component CSS classes (ds-pill, ds-tag, ds-card, etc.)
- [x] TypeScript types (Place, Review, User, Filters, etc.)
- [x] Foundational lib files (Supabase client, geo utils, filters)
- [x] UI components (PriceBar, StarRating, Pill, badges)
- [x] Layout components (Header, FilterBar, LanguageSwitcher)
- [x] Map component (DevSpotMap with mapcn/MapLibre GL)
- [x] Place components (PlaceCard, SubmitPlaceModal)
- [x] Review components (ReviewCard, SubmitReviewForm)
- [x] Pages (Home, PlaceDetailPage, SignInPage, SignUpPage, ProfilePage)
- [x] Router setup (App.tsx with BrowserRouter)
- [x] Supabase project created and linked (brdesbsngyoqixfdnfgd)
- [x] Database schema deployed (places, reviews, profiles, saves + RLS + storage)
- [x] Auth context (signIn/signUp/signOut/Google OAuth)
- [x] shadcn/ui + mapcn initialized
- [x] i18n setup (react-i18next, pt/en locales, language switcher)
- [x] OSRM routing integration (route from user location to selected place)
- [x] Mapbox removed (no references, no types package)
- [ ] API routes (Supabase queries replacing mock data)
- [ ] Photo upload (Supabase Storage)
- [ ] Seed data
- [ ] Production build test

## Do's

- Keep component CSS classes matching the HTML prototype exactly
- Use Tabler Icons for all iconography (lucide-react only for shadcn internals)
- Follow the dark, monospace, terminal-like aesthetic
- Portuguese labels for Portuguese-speaking market (Luanda)
- Write clean, minimal code without comments

## Don'ts

- Don't add comments to code
- Don't use emojis in code
- Don't over-engineer state management
- Don't add features not in the PRD scope

## Current Status
Working MVP with mock data. mapcn/MapLibre GL map with interactive markers. OSRM routing from user location to selected place. Place detail page with embedded map. i18n (Portuguese default, English toggle). Auth pages (login/signup). Profile page. Supabase project + schema live.

## Known Issues
- PlaceDetailPage uses hardcoded data (needs real API)
- No Supabase queries replacing mock data yet
- Route button needs user location — shows hint if not yet obtained
