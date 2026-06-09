# DevSpot — Agent Guide for AI Coding Assistants

## Project Overview

DevSpot is a community-driven map platform for developers in Luanda, Angola to discover and share places suitable for coding, remote work, meetings, and hackathons.

### Core Stack
- **Vite 8 + React 19** — Frontend framework (no SSR, pure SPA)
- **TypeScript** — End-to-end types
- **Tailwind CSS v4** — Styling with `@theme` custom properties
- **Supabase** — Backend (Postgres + Auth + Storage)
- **Tabler Icons** — All iconography
- **DotGothic16** — Monospace font (Google Fonts)

## Design System

### Colors
```css
--bg:       #0d0d0d    (page background)
--surf:     #161616    (card/section surface)
--surf2:    #1e1e1e    (elevated surface, inputs)
--border:   rgba(255,255,255,0.07)
--txt:      #e8e8e8    (primary text)
--muted:    #777       (secondary text)
--dim:      #444       (tertiary text/labels)
--star:     #e8c84a    (rating stars)
--wifi:     #5bc8a0    (WiFi quality)
```

### Typography
- All text uses `DotGothic16`, monospace
- Sizes: 10px (labels/dim), 11px (pills/meta), 12px (body inputs), 13px (card titles), 15px (headings), 18px (page titles)

### Component Classes
These CSS classes are defined in `src/index.css` and should be used for consistency:

| Class | Purpose |
|-------|---------|
| `.ds-pill` | Filter/selection pill button |
| `.ds-pill.on-a` | Active state — variant A (vibe) |
| `.ds-pill.on-g` | Active state — variant G (use) |
| `.ds-pill.on-s` | Active state — variant S (price) |
| `.ds-tag` | Small info tag |
| `.ds-tag.use` | Use case tag variant |
| `.ds-card` | Clickable card with hover effect |
| `.map-bg` | SVG grid background for maps |
| `.step-bar` | Multi-step progress bar |
| `.fld-lbl` | Form field label |

### Component Files
Every component lives in `src/components/` organized by domain.

### Icon Usage
Use `@tabler/icons-react` components. Import only what's needed:
```tsx
import { IconCoffee, IconBuilding } from '@tabler/icons-react'
```

### Place Type → Icon Mapping
```ts
café:      IconCoffee
cowork:    IconBuilding
esplanada: IconCoffee   (or IconPlant when needed)
restaurant: IconCoffee
library:   IconCoffee
other:     IconCoffee
```

### Place Type → Color
```ts
café:      #b0b0b0
cowork:    #888
esplanada: #666
restaurant:#888
library:   #888
```

## Routing
React Router v7 (BrowserRouter):
```
/                  → Home (map + list)
/place/:id         → PlaceDetailPage
/profile/:username → ProfilePage (not yet implemented)
```

## State Management
Simple React state with props. No external state library.

## Supabase Integration
- `src/lib/supabase/client.ts` — Browser client (`createClient`)
- Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
- RLS policies: public read, authenticated insert/update own content

## Key Conventions
1. **No comments** in code — let the code speak
2. **No emojis** in code (only in user-facing rendered content)
3. **TypeScript strict** mode, no `any` unless absolutely necessary
4. **Imports use `@/` path alias** (e.g., `@/types`, `@/components/ui/Pill`)
5. **Dark theme only** — no light mode
6. **Portuguese labels** where appropriate (the app targets Luanda)
7. **Mock data** in pages for development — replace with Supabase queries in production

## Adding Features
When adding new features:

1. Update `PLAN.md` with the task
2. Create/update types in `src/types/index.ts`
3. Create the component in the appropriate directory
4. Wire it up in the relevant page
5. Update documentation if needed

## Build & Run
```bash
pnpm dev        # Development server
pnpm build      # Production build
pnpm preview    # Preview production build
```
