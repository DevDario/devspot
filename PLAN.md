# DEVSPOT — Plan & Progress

## Stack
- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4
- **Map:** SVG-based geo map (Mapbox GL JS ready for token)
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Icons:** Tabler Icons (@tabler/icons-react)
- **Font:** DotGothic16 (Google Fonts)

## Architecture Decisions

### Why not Next.js?
User requested Vite instead of Next.js. React Router v6 handles SPA routing.

### Map Strategy
Using an SVG grid-based map matching the HTML prototype's design. This gives us:
- Zero external dependency for the map itself
- Consistent dark aesthetic
- Mapbox GL JS can be swapped in when a token is configured

### State Management
Simple React state with props drilling. No external state library needed at this scale.

### CSS Strategy
Tailwind v4 for utility classes + custom `.ds-*` component classes that match the HTML prototype's exact design language.

## Progress Tracking

- [x] Project scaffold (Vite + React + TS + Tailwind)
- [x] Design tokens in Tailwind theme
- [x] Component CSS classes (ds-pill, ds-tag, ds-card, map-bg, etc.)
- [x] TypeScript types (Place, Review, User, Filters, etc.)
- [x] Foundational lib files (Supabase client, geo utils, filters)
- [x] UI components (PriceBar, StarRating, Pill, badges)
- [x] Layout components (Header, FilterBar)
- [x] Map component (DevSpotMap with SVG grid)
- [x] Place components (PlaceCard, SubmitPlaceModal)
- [x] Review components (ReviewCard, SubmitReviewForm)
- [x] Pages (Home, PlaceDetailPage)
- [x] Router setup (App.tsx with BrowserRouter)
- [ ] Supabase CLI install and project init
- [ ] Supabase database schema migration
- [ ] Auth pages (login/signup)
- [ ] Profile page
- [ ] API routes
- [ ] Photo upload (Supabase Storage)
- [ ] Mapbox integration
- [ ] Seed data
- [ ] Production build test

## Do's

- Keep component CSS classes matching the HTML prototype exactly
- Use Tabler Icons for all iconography
- Follow the dark, monospace, terminal-like aesthetic
- Portuguese labels for Portuguese-speaking market (Luanda)
- Write clean, minimal code without comments

## Don'ts

- Don't add comments to code
- Don't use emojis in code
- Don't over-engineer state management
- Don't add features not in the PRD scope

## Current Status
Working MVP with mock data. Submit place modal functional. Filter and search working. Map with markers and selection working. Place detail page wired up.

## Known Issues
- PlaceCard onClick typing needs e.stopPropagation fix
- PlaceDetailPage uses hardcoded data (needs real API)
- No auth flow yet
- No Supabase integration yet
