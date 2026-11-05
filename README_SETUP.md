# W02 Sacrament Meeting Planner — Setup Notes

## 1. Scaffold the Next.js project

```bash
mkdir sacrament-meetings
cd sacrament-meetings
npx create-next-app@latest . --typescript --tailwind --app
```

When prompted:
- ESLint: Yes
- src/ directory: No
- import alias: Yes (keep default @/*)

## 2. Copy in these files

After the scaffold completes, copy the files from this zip into their matching locations.
These files REPLACE the scaffold's versions where filenames overlap:
- app/globals.css
- app/layout.tsx
- app/page.tsx
- tailwind.config.ts
- tsconfig.json
- next.config.ts

These are NEW files (the scaffold doesn't create them):
- lib/types.ts
- lib/meetings-db.ts
- components/Header.tsx
- components/Footer.tsx
- components/NavLinks.tsx
- components/MeetingCard.tsx
- components/MeetingDetail.tsx
- app/meetings/layout.tsx
- app/meetings/loading.tsx
- app/meetings/page.tsx
- app/meetings/current/page.tsx
- app/meetings/[id]/page.tsx
- app/api/meetings/route.ts
- app/api/meetings/[id]/route.ts

## 3. Add a placeholder image

The home page references /public/chapel.jpg.
Add any church/chapel image as public/chapel.jpg, or remove the Image block from app/page.tsx.
Free option: download from https://unsplash.com/s/photos/chapel

## 4. Run and verify

```bash
npm run dev
```

Check these routes in browser:
- http://localhost:3000/
- http://localhost:3000/meetings
- http://localhost:3000/meetings/1
- http://localhost:3000/meetings/current  (should redirect to meeting 1)
- http://localhost:3000/api/meetings
- http://localhost:3000/api/meetings?date=2026-11-02
- http://localhost:3000/api/meetings/1
- http://localhost:3000/api/meetings/abc  (should return 400)

```bash
npm run lint
npm run build
```

## 5. Git setup

```bash
git init
git add .
git commit -m "Initial Next.js scaffold"
git branch -M main
git remote add origin https://github.com/Jgallardo613/sacrament-meetings.git
git push -u origin main

git checkout -b peer-code-review
# (you're already on peer-code-review — do your work here)
git add .
git commit -m "Sacrament meeting planner assignment"
git push -u origin peer-code-review
```

## 6. Vercel

- Import the sacrament-meetings repo as a NEW project (not the portfolio one)
- Framework: Next.js (auto-detected)
- After deploying main, Settings → Deployment Protection → turn OFF Vercel Authentication
- Find the peer-code-review preview URL under Deployments, filtered by branch

## 7. Submission text (Canvas)

Paste in:
1. GitHub repo URL: https://github.com/Jgallardo613/sacrament-meetings
2. Pull Request URL: https://github.com/Jgallardo613/sacrament-meetings/pull/1
3. Vercel preview URL: (copy from Vercel dashboard, tagged "peer-code-review")

**Reflection:**
I chose to colocate data-fetching inside each Server Component page (app/meetings/page.tsx and app/meetings/[id]/page.tsx) rather than fetching at the layout level and passing data down via props. The alternative was a single top-level fetch with prop drilling through the meetings layout, but that would have tightly coupled the layout to the data shape. By fetching at the page level, each route is independently cacheable and the layout stays focused on composition. The tradeoff is a small amount of repeated fetch logic, which I accepted because the in-memory API is fast and the pattern will scale cleanly when a real database is added.

**Challenge Summary:**
The main challenge was handling the params object in Next.js App Router — in the latest versions, params is a Promise and must be awaited rather than destructured directly. This caused a type error on the first build that required reading the Next.js 15 migration notes to resolve. I also had to handle the timezone issue in getCurrentMeeting() to avoid off-by-one day errors when constructing the "last Sunday" date using getDay().

**AI Summary:**
I used Claude to generate the initial project structure, type definitions, and in-memory data module. I reviewed every file for correctness, type safety, and alignment with the assignment spec. I asked Claude to explain the Promise<params> behavior in Next.js 15 and to verify the getMeetings sort logic. All code was tested manually in the browser and against the route checklist in the assignment.
