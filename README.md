# CABLELINE

The home of cable park wakeboarding — an interactive world map of cable parks,
the contest circuit with results and champions, and an Instagram-style social
feed where riders and fans post sessions, build profiles, and follow each other.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, an
interactive **Leaflet / OpenStreetMap** map, and **Supabase** (auth, Postgres,
storage) powering the social layer.

## Features

- **Animated hero** — a cable strung between towers with a carrier and rider
  that pops off a kicker, drifting water, and a kinetic headline.
- **Interactive park map** (`/map`) — every cable park on a dark world map.
  Search, filter by region, fly to a park, and tap through to its website.
- **Contests** (`/contests`) — upcoming events with registration links plus the
  last two seasons of results and verified podiums.
- **Social feed** (`/feed`, `/u/[username]`) — sign up, post photos with a
  caption and tagged park, like, comment, and follow other riders.

## Getting started

```bash
npm install
npm run dev
```

The map and contests pages work with no configuration. The social features need
Supabase.

### Wiring up Supabase (social features)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql). This
   creates the `profiles`, `posts`, `likes`, `comments`, and `follows` tables,
   row-level-security policies, the `posts` / `avatars` storage buckets, and a
   trigger that creates a profile on sign-up.
3. Copy `.env.example` to `.env.local` and fill in your project URL and anon key:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

4. Restart `npm run dev`. The feed, profiles, and following light up.

> Tip: for the smoothest demo, turn **off** email confirmation in
> Supabase → Authentication → Providers → Email, so new accounts sign in
> immediately.

## Data

Park and contest data live in plain TypeScript modules — the single source of
truth, easy to extend:

- [`src/data/parks.ts`](./src/data/parks.ts) — add a row to put a park on the map.
- [`src/data/contests.ts`](./src/data/contests.ts) — add events and results as
  each season unfolds.

Data was compiled from web research and verified against official sites where
possible; a handful of map coordinates are best-estimate (accurate to the
venue/lake), and contest winners are listed only where results were verifiable.
Coverage of South America and Africa is intentionally light and ready to grow.

## Project structure

```
src/
  app/            routes: /, /map, /contests, /feed, /login, /u/[username]
  components/     home (hero + teasers), map, social, shared (Nav, Footer)
  data/           parks.ts, contests.ts
  lib/            supabase clients, types, formatting helpers
  proxy.ts        refreshes the Supabase auth session
supabase/
  schema.sql      run this in your Supabase project
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — lint
