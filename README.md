# DevSpot

> **places devs actually go to** — A community-driven map for discovering and sharing developer-friendly spots in Luanda, Angola.

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## Why This Project?

**The problem:** Luanda has amazing cafés, coworking spaces, and esplanadas — but there's no curated way for developers to know which ones have good WiFi, quiet corners for coding, or power outlets that actually work. Google Maps doesn't capture these "dev signals."

**DevSpot solves this** with a community-driven map where tech folks share the spots that work for them. Think of it as "Wifi Coffee for Angolan devs" — but built properly.

### What I'm Learning

This project is designed to teach and demonstrate real-world full-stack development skills:

| Concept | How DevSpot Implements It |
|---------|--------------------------|
| **TypeScript end-to-end** | Shared types from DB schema → API → React components |
| **Auth + Authorization** | Supabase Auth with RLS policies at the database level |
| **Full-text search** | PostgreSQL `tsvector` for searching places and tags |
| **Community-driven content** | User-submitted places with moderation queue |
| **Geospatial features** | Location-based queries and map rendering |
| **File uploads** | Photo uploads via Supabase Storage |
| **Dark mode by default** | Monospace terminal aesthetic powered by Tailwind v4 |
| **SPA routing** | React Router for client-side navigation |
| **State management patterns** | Lifting state up, prop drilling, context when needed |
| **API design** | RESTful routes with Supabase as the backend |

**The key insight:** This isn't a toy project. It's solving a real problem for the Angolan tech community, and the architecture reflects production patterns. A recruiter looking at this will see someone who understands:

- Database schema design with proper constraints and RLS
- Clean separation of types, utilities, and components
- Responsive UI with a consistent design system
- Authentication flows
- Community/moderated content patterns

---

## Tech Stack

```
Frontend:  Vite 8 + React 19 + TypeScript + Tailwind CSS v4
Map:       SVG grid map (Mapbox-ready)
Icons:     Tabler Icons
Backend:   Supabase (Postgres + Auth + Storage + Realtime)
Auth:      Supabase Auth (email/password + Google OAuth)
Routing:   React Router v7
Hosting:   Vercel-ready
```

## Project Structure

```
devspot/
├── src/
│   ├── components/
│   │   ├── filters/       # Filter pills and filter bar
│   │   ├── layout/        # Header, Sidebar, BottomSheet
│   │   ├── map/           # DevSpotMap, MapPreview
│   │   ├── place/         # PlaceCard, PlaceStats, SubmitPlaceModal
│   │   ├── review/        # ReviewCard, SubmitReviewForm, StarRating
│   │   └── ui/            # PriceBar, badges, pills
│   ├── lib/
│   │   ├── supabase/      # Supabase client configuration
│   │   ├── mapbox/        # Mapbox config (ready when token provided)
│   │   └── utils/         # Geo utilities, filter logic
│   ├── pages/             # Route pages (Home, PlaceDetail, Profile)
│   ├── types/             # TypeScript types matching DB schema
│   ├── App.tsx            # Router setup
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles + Tailwind + component CSS
├── PLAN.md                # Agent tracking and decisions
├── AGENTS.md              # Instructions for AI coding agents
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A Supabase account (for backend features)
- A Mapbox token (for map tiles)

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
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### Database

Run the migration in `supabase/migrations/` to set up:

- `places` — with full-text search index
- `reviews` — one review per user per place
- `profiles` — extends Supabase auth.users
- `saves` — favorites/starred places
- RLS policies for public read / authenticated write

## Features (MVP)

- **Map view** — Dark SVG grid map centered on Luanda with type-colored markers
- **Filters** — Filter by vibe (calm/retro/modern), use case (coding/cowork/hackathon/etc.), and type
- **Search** — Full-text search on place names and tags
- **Submit place** — 3-step modal (place info → vibe check → dev notes)
- **Place detail** — Dedicated page with stats, tags, and reviews
- **Reviews** — Star ratings, WiFi quality, noise level, power outlet availability
- **Authentication** — Email/password + Google OAuth via Supabase
- **Profiles** — User profiles with submitted places and reviews

## Roadmap

### v1 (MVP)
- [x] Project scaffold and design system
- [x] Map view with markers and clustering
- [x] Filter and search
- [x] Place submission flow
- [x] Place detail page
- [ ] Supabase integration
- [ ] Auth (Supabase Auth)
- [ ] Reviews
- [ ] User profiles
- [ ] Photo uploads

### v2 (Post-MVP)
- AI vibe detection via Claude API
- "Open now" live filter
- Saved lists ("My spots")
- Place claiming for business owners
- Hackathon board
- Mobile app (React Native / Expo)
- Notifications
- Analytics dashboard

---

## Contributing

This is a vibecoding project, but contributions are welcome. Open an issue or PR!

## License

MIT
