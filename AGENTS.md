# DevSpot — Agent Guide for AI Coding Assistants

## Project Overview

DevSpot is a community-driven map platform for developers in Luanda, Angola to discover and share places suitable for coding, remote work, meetings, and hackathons.

### Core Stack
- **Vite 8 + React 19** — Frontend framework (no SSR, pure SPA)
- **TypeScript** — End-to-end types
- **Tailwind CSS v4** — Styling with `@theme` custom properties
- **Supabase** — Backend (Postgres + Auth + Storage)
- **Mapcn** — Maplibre GL wrapper for shadcn/ui (free CARTO tiles, no API key)
- **OSRM** — Open Source Routing Machine (public API, free)
- **i18next + react-i18next** — Internationalization (pt default, en fallback)
- **Tabler Icons** — All iconography
- **DotGothic16** — Monospace font (Google Fonts)

## Design System

### Dark Theme (default)
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

### Light Theme (html.light overrides)
```css
--bg:       #f5f5f5
--surf:     #fafafa
--surf2:    #f0f0f0
--border:   rgba(0,0,0,0.08)
--txt:      #1a1a1a
--muted:    #888
--dim:      #bbb
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
| `.step-bar` | Multi-step progress bar |
| `.fld-lbl` | Form field label |

### Component Files
Every component lives in `src/components/` organized by domain.

### Icon Usage
Use `@tabler/icons-react` components exclusively. Never use emoji characters:
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
/                  → Home (map + list + command palette)
/place/:id         → PlaceDetailPage (Supabase data)
/profile/:username → ProfilePage
/signin            → SignInPage
/signup            → SignUpPage
```

## State Management
Simple React state with props. Theme context for dark/light toggle.

## Supabase Integration
- `src/lib/supabase/client.ts` — Browser client (`createClient`)
- `src/lib/supabase/auth.tsx` — Auth context (signIn, signUp, signOut, Google OAuth)
- `src/lib/supabase/places.ts` — Data service (fetchPlaces, fetchPlaceById, createPlace, uploadPhoto, etc.)
- RLS policies: public read, authenticated insert/update own content
- Storage buckets: `place-photos`, `review-photos`

## i18n
- Portuguese (Angolan) default, English fallback
- Detection: localStorage → navigator language
- All user-facing strings in `src/lib/i18n.ts`
- Use `useTranslation()` hook in components

## Theme
- `useTheme()` hook from `@/lib/hooks/useTheme`
- Dark default, toggle via command palette or theme switcher
- Map theme syncs automatically (CARTO dark-matter / positron basemaps)

## Command Palette
- Ctrl/Cmd+K opens overlay with functional actions:
  - Submit place, toggle language, toggle theme
  - Switch view (split/map/list)
  - Toggle filters (vibe, use case, type)
- Arrow key navigation, Enter to execute, Escape to close

## Key Conventions
1. **No comments** in code — let the code speak
2. **No emojis** — use Tabler Icons for all iconography
3. **TypeScript strict** mode, no `any` unless absolutely necessary
4. **Imports use `@/` path alias** (e.g., `@/types`, `@/components/ui/Pill`)
5. **Dark theme default**, light theme via `.light` class on `<html>`
6. **Portuguese default language** (targeting Luanda)
7. **Use `useTranslation()` for all visible strings**
8. **Commit rules**: commit each file with a comprehensive message describing what it implements/fixes/refactors. Build must pass before committing.

## Adding Features
When adding new features:

1. Update `PLAN.md` with the task
2. Create/update types in `src/types/index.ts`
3. Create the component in the appropriate directory
4. Wire it up in the relevant page
5. Update documentation if needed
6. Build and verify before committing
7. Commit each file/group with a comprehensive message

## Build & Run
```bash
pnpm dev        # Development server
pnpm build      # Production build
pnpm preview    # Preview production build
```
