# Sacrament Meeting Planner (W04)

Next.js 16 (App Router) + Neon Postgres + Tailwind CSS v4 + Zod.

## Setup

1. `npm install`
2. Create `.env.local` (git-ignored, never commit it):
   ```
   DATABASE_URL=postgres://...your Neon connection string...
   ```
   Add the same variable in Vercel → Project → Settings → Environment Variables.
3. Create and seed the tables: paste `lib/schema.sql` into the Neon SQL Editor,
   or run `psql "$DATABASE_URL" -f lib/schema.sql`. Re-running it resets the data.
4. `npm run dev`

## Routes

| Route | Notes |
| --- | --- |
| `/meetings?query=&page=` | List, newest first, 5 per page. Search + page live in the URL. |
| `/meetings/[id]` | Meeting detail with program. Invalid/unknown id → 404 page. |
| `/meetings/[id]/edit` | Edit form (server action `updateMeeting`). Missing meeting → not-found page. |
| `/meetings/current` | Redirects to this week's meeting (ward time zone). |
| `/admin/meetings/new` | Create form (server action `createMeeting`). |
| `GET /api/meetings?query=&page=&date=` | `{ meetings, total, page, totalPages }`. Bad `page`/`date` → 400. |
| `GET /api/meetings/[id]` | `{ meeting, speakers }`. Bad id → 400, unknown → 404. |
| `POST /api/meetings`, `PUT`/`DELETE /api/meetings/[id]` | **Stubs** — return 501. Writes go through the server actions instead. |

## Project layout

- `app/(public)/` — public site (header/footer layout, home, meetings pages)
- `app/(admin)/` — admin area with its own layout (`/admin/...`)
- `lib/db.ts` — Neon client (reads `DATABASE_URL`)
- `lib/meetings-db.ts` — all SQL: reads (ILIKE search, pagination, current meeting) and create/update/delete
- `lib/actions.ts` — server actions with Zod validation (`createMeeting`, `updateMeeting`, `deleteMeeting`)
- `components/MeetingFormFields.tsx` — shared, accessible form fields; `CreateMeetingForm` / `EditMeetingForm` wrap it with `useActionState`
- `components/DeleteMeetingButton.tsx` — per-row delete form with a confirm prompt
- `lib/schema.sql` — `meetings` + `speakers` tables and seed data
- `components/MeetingSearch.tsx` — debounced (use-debounce) search input, URL-only state
- `components/Pagination.tsx` — page links that keep the search query

## Simulated, hardcoded, or placeholder

- **Seed data is fictional.** All 10 meetings, names, and announcements in `lib/schema.sql` are sample records.
- **Ward name** "Rexburg 4th Ward" is hardcoded in `lib/site.ts`.
- **Ward time zone** `America/Denver` is hardcoded in `lib/meetings-db.ts` (decides "this week").
- **Login is a placeholder.** The only account (`admin@example.com` / `admin1234`) is hardcoded in `auth.ts`. `AUTH_SECRET` and `NEXT_PUBLIC_BASE_URL` must be set to real values in production.
- **JSON API writes** (`POST`/`PUT`/`DELETE`) are stubs returning `501 Not Implemented`.
