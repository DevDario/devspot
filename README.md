# DevSpot

> **places devs actually go to** — A community-driven map for discovering and sharing developer-friendly spots in Luanda, Angola.

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## Problem

Luanda has amazing cafés, coworking spaces, and esplanadas — but there's no curated way for developers to know which ones have good WiFi, quiet corners for coding, or power outlets that actually work. Google Maps doesn't capture these "dev signals."

DevSpot solves this with a community-driven map where tech folks share the spots that work for them.

---

## Tech Stack

```
Frontend:  Vite 8 + React 19 + TypeScript + Tailwind CSS v4
Map:       MapLibre GL via mapcn (free CARTO tiles, no API key)
Icons:     Tabler Icons
Routing:   React Router v7
Caching:   TanStack Query
Validation: Zod
i18n:      react-i18next (PT default, EN fallback)
Backend:   Supabase (Postgres + Auth + Storage)
Auth:      Supabase Auth (email/password + Google OAuth)
Routing:   OSRM public API (free)
```

## Project Structure

```
devspot/
├── src/
│   ├── components/
│   │   ├── cmd/           # Command palette (⌘K)
│   │   ├── filters/       # Filter pills and filter bar
│   │   ├── layout/        # Header, Sidebar, BottomSheet
│   │   ├── map/           # Map components
│   │   ├── place/         # PlaceCard, SubmitPlaceModal
│   │   ├── review/        # SubmitReviewForm, StarRating
│   │   └── ui/            # PriceBar, badges, pills
│   ├── lib/
│   │   ├── supabase/      # Client, auth context, data service, DB types
│   │   └── hooks/         # useTheme
│   ├── pages/             # Home, PlaceDetail, Profile, SignIn, SignUp, NotFound
│   ├── App.tsx            # Router + providers
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles (DevSpot theme + shadcn CSS vars)
├── public/
├── README.md
├── AGENTS.md              # Instructions for AI coding agents
└── PLAN.md                # Agent tracking and decisions
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A Supabase account

### Setup

```bash
pnpm install
cp .env.example .env  # Add your keys
pnpm dev              # http://localhost:5173
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

No Mapbox token required — maps use free CARTO tiles via Maplibre GL.

## Features

- **Map view** — Dark/light MapLibre GL map centered on Luanda with type-colored markers
- **Command palette** — ⌘K to quickly submit places, toggle language, toggle theme, switch views, filter
- **Filters** — Filter by vibe (calm/retro/modern), use case (coding/cowork/hackathon/etc.), and type
- **Search** — Full-text search on place names and tags
- **Submit place** — 3-step modal with address autocomplete (Nominatim) and geolocation
- **Place detail** — Dedicated page with stats, tags, reviews, photos, route to spot
- **Reviews** — Star ratings, WiFi quality, noise level, power outlet availability
- **Photo uploads** — Upload place photos via Supabase Storage
- **Routing** — OSRM-based directions from your location to any spot
- **Authentication** — Email/password + Google OAuth via Supabase
- **Profiles** — User profiles with submitted places and reviews
- **i18n** — Portuguese (default) and English
- **Theme toggle** — Dark mode (default) / light mode with localStorage persistence
- **Responsive** — Mobile-first, works on all screen sizes

## Roadmap

### v1 (MVP)
- [x] Project scaffold and design system
- [x] Map view (MapLibre GL via mapcn)
- [x] Filter and search
- [x] Place submission flow
- [x] Place detail page
- [x] Supabase integration
- [x] Auth (Supabase Auth)
- [x] Reviews
- [x] User profiles
- [x] Photo uploads
- [x] Routing (OSRM)
- [x] i18n (PT/EN)
- [x] Command palette
- [x] Theme toggle
- [x] Responsive design

### v2 (Post-MVP)
- AI vibe detection via Claude API
- "Open now" live filter
- Saved lists ("My spots")
- Place claiming for business owners
- Hackathon board
- Notifications
- Analytics dashboard

---

## License

MIT
