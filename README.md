# Solu Admin

The Solu team's dashboard: analytics, members (suspend, reactivate, roles, delete), notifications
to members, the content library (recommendations, Did You Know, cycle-day lines, articles,
insights and journal prompts, spreadsheet import), community moderation (posts, comments,
groups, hangouts) and an audit log of every change.

Next.js 16 (App Router), Tailwind 4, shadcn on Base UI, glass theme matching the app. It talks
to the Solu API (`../Solu`) only from the server, with the admin's token kept in httpOnly
cookies; nothing in the browser calls the API directly.

Private Health data, journal text and AI chats are never shown here (counts only).

## Run locally

1. Start the API (`../Solu`). The dashboard needs the admin tables, so after pulling run this
   **in the API folder** (this folder has no Prisma; `npx prisma` here downloads an unrelated
   version):

   ```bash
   cd ../Solu
   npx prisma db push      # uses DATABASE_URL from ../Solu/.env (your local database)
   ```
2. Create an admin (an existing app account becomes admin, or a new one is made):

   ```bash
   cd ../Solu
   npm run admin:create -- you@example.com              # random password, printed once
   npm run admin:create -- you@example.com --password '...'
   npm run admin:create -- you@example.com --revoke     # removes admin access
   ```

3. Start the dashboard:

   ```bash
   npm install
   SOLU_API_URL=http://localhost:5010/graphql npm run dev
   ```

After changing the API's schema, restart the API (it rewrites `../Solu/schema.gql`) and run
`npm run codegen` here. `npm run typecheck` and `npm run lint` should both pass.

## Environment

| Variable | Required | What it is |
| --- | --- | --- |
| `SOLU_API_URL` | yes | The API's GraphQL URL, e.g. `https://api.solu.ae/graphql`. The spreadsheet import posts to `/v1/admin/content/import` on the same host. |
| `NEXT_PUBLIC_ADMIN_TIME_ZONE` | no | Time zone for every date shown and for scheduling (default `Asia/Dubai`). |

## Deploy (Vercel)

A second Vercel project, separate from the API:

1. Import this folder as a new project (framework: Next.js; build and output settings as detected).
2. Set `SOLU_API_URL` (and `NEXT_PUBLIC_ADMIN_TIME_ZONE` if not Dubai) for Production.
3. On the API's database (Neon), from `../Solu`, with the production `DATABASE_URL` set for the
   session only (a variable set in the shell wins over `.env`). Use Neon's **direct** connection
   string (host without `-pooler`) for schema changes:

   ```powershell
   cd ..\Solu
   $env:DATABASE_URL = "postgresql://...neon.tech/...?sslmode=require"
   npx prisma db push                       # read any data-loss warning before accepting
   npm run admin:create -- you@example.com  # your dashboard sign-in on production
   Remove-Item Env:DATABASE_URL             # back to the local database
   ```
4. Deploy the API too: the dashboard needs the API's admin module, and scheduled notifications
   are sent by the API's cron (every 30 minutes on Vercel, through the reminders schedule).

Sessions last 7 days of activity; suspending an admin or removing the role signs them out
everywhere. Sign-in is limited to 5 attempts a minute per caller IP. Deployed, every sign-in
reaches the API from the dashboard's server, so that limit is shared by everyone using the
dashboard: fine for a small team, but repeated bad attempts on the login page can hold admins out
for a minute at a time. (A follow-up would be limiting per email instead.)

## Things to know

- **Spreadsheet import** treats each file as the source of truth: cards and cycle-day lines
  missing from a file are deleted and missing facts leave the rotation. Checking a file first
  lists exactly what would go, including anything added in the dashboard.
- **Blog sync** (`npm run db:sync-blog` in the API) resets article tags and visibility from the
  tagging spreadsheet.
- **Notifications** respect each member's "News from Solu" switch and quiet hours (22:00 to
  07:00 in their time zone; pushes wait until 07:00). They always land in the in-app inbox
  unless the member turned the inbox off for them.
- **Hiding a post** removes it from every feed, link and saved list; its author still sees it.
