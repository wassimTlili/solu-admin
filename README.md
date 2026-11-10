# Solu Admin

The Solu team's dashboard: analytics, members (suspend, reactivate, roles, delete), notifications
to members, the content library (recommendations, Did You Know, cycle-day lines, articles,
insights and journal prompts, spreadsheet import), community moderation (posts, comments,
groups, hangouts) and an audit log of every change.

Next.js 16 (App Router), Tailwind 4, shadcn on Base UI, glass theme matching the app. It talks
to the Solu API (`../Solu`) only from the server, with the admin's token kept in httpOnly
cookies; nothing in the browser calls the API directly.

Private Health data, journal text and AI chats are never shown here (counts only).

## Sign-in

Admins sign in with **Google or Apple**, like the app, through the same Clerk app (same
publishable key as `solu-mobile`). Clerk proves who the person is; the API
(`adminLoginWithClerk`) then finds her Solu account (by Clerk user id, then by email) and opens
a dashboard session only if the account is an active **admin**. Anyone else sees "This Google or
Apple account doesn't have access to the Solu admin dashboard", and nothing is created or
changed for them. The Clerk session is signed out right after, so only the dashboard's own
httpOnly cookies remain.

Email + password is kept for local development and tests only (a folded "Email and password"
section on the sign-in page in development builds). The API refuses it in production unless
`ADMIN_PASSWORD_LOGIN=true` is set on the API.

## Run locally

1. Start the API (`../Solu`). The dashboard needs the admin tables, so after pulling run this
   **in the API folder** (this folder has no Prisma; `npx prisma` here downloads an unrelated
   version):

   ```bash
   cd ../Solu
   npx prisma db push      # uses DATABASE_URL from ../Solu/.env (your local database)
   ```
2. Make someone an admin (an existing app account becomes admin, or a new one is made), then
   they sign in with the Google or Apple account on that email:

   ```bash
   cd ../Solu
   npm run admin:create -- you@example.com                    # admin, no password
   npm run admin:create -- you@example.com --password         # + local dev password, printed once
   npm run admin:create -- you@example.com --password '...'   # + your own (12+ characters)
   npm run admin:create -- you@example.com --revoke           # removes admin access
   ```

   An admin who signs in to the app with Apple's "Hide My Email" is matched by her Clerk account,
   so she must use that same Apple ID here.

3. Start the dashboard. `.env.local` holds `SOLU_API_URL` and
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (copy `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` from
   `solu-mobile/.env.local`); the API needs `CLERK_SECRET_KEY` from the same Clerk app:

   ```bash
   npm install
   npm run dev
   ```

After changing the API's schema, restart the API (it rewrites `../Solu/schema.gql`) and run
`npm run codegen` here. `npm run typecheck` and `npm run lint` should both pass.

## Environment

| Variable | Required | What it is |
| --- | --- | --- |
| `SOLU_API_URL` | yes | The API's GraphQL URL, e.g. `https://api.solu.ae/graphql`. The spreadsheet import posts to `/v1/admin/content/import` on the same host. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | yes | The app's Clerk publishable key (the same as `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in the mobile app). Without it the sign-in page explains what is missing. |
| `NEXT_PUBLIC_ADMIN_TIME_ZONE` | no | Time zone for every date shown and for scheduling (default `Asia/Dubai`). |

The API side of sign-in uses the API's existing `CLERK_SECRET_KEY` (same Clerk app) and the
optional `ADMIN_PASSWORD_LOGIN` (see Sign-in).

## Deploy (Vercel)

A second Vercel project, separate from the API:

1. Import this folder as a new project (framework: Next.js; build and output settings as detected).
2. Set `SOLU_API_URL` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (and `NEXT_PUBLIC_ADMIN_TIME_ZONE`
   if not Dubai) for Production.
3. In Clerk, allow the dashboard's address: a **production** Clerk instance only works on its own
   domain and its subdomains, so host the dashboard on one (for example `admin.solu.ae`) and add it
   under the instance's domains / allowed origins. Google and Apple must be enabled as social
   connections with Solu's own credentials (the same ones the app uses). A development instance
   (`pk_test_…`) works on `localhost` as is.
4. On the API's database (Neon), from `../Solu`, with the production `DATABASE_URL` set for the
   session only (a variable set in the shell wins over `.env`). Use Neon's **direct** connection
   string (host without `-pooler`) for schema changes:

   ```powershell
   cd ..\Solu
   $env:DATABASE_URL = "postgresql://...neon.tech/...?sslmode=require"
   npx prisma db push                       # read any data-loss warning before accepting
   npm run admin:create -- you@example.com  # makes you an admin on production
   Remove-Item Env:DATABASE_URL             # back to the local database
   ```
5. Deploy the API too: the dashboard needs the API's admin module, and scheduled notifications
   are sent by the API's cron (every 30 minutes on Vercel, through the reminders schedule).

Sessions last 7 days of activity; suspending an admin or removing the role signs them out
everywhere. Google / Apple sign-in is limited to 10 attempts a minute per caller IP (5 for the
development password sign-in). Deployed, every sign-in reaches the API from the dashboard's
server, so that limit is shared by everyone using the dashboard: fine for a small team.

## Things to know

- **Spreadsheet import** is the "Import from Excel" button on each content page:
  Recommendations (Set A / Set B), Did You Know (facts) and Cycle-day lines (the 88 rows); a file
  of another kind is refused with the page to use. It treats each file as the source of truth:
  cards and cycle-day lines missing from a file are deleted and missing facts leave the rotation.
  Checking a file first lists exactly what would go, including anything added in the dashboard.
- **Ids are never typed.** A new card gets the next number in its slot (`M-E-MOR-06`), a new fact
  the next in its category (`DYK-CAB-17`), a new cycle-day line the next variation (`MEN-E-09`).
  A card's set, phase, position and time of day are fixed once it exists.
- **Blog sync** (`npm run db:sync-blog` in the API) resets article tags and visibility from the
  tagging spreadsheet.
- **Notifications** respect each member's "News from Solu" switch and quiet hours (22:00 to
  07:00 in their time zone; pushes wait until 07:00). They always land in the in-app inbox
  unless the member turned the inbox off for them.
- **Hiding a post** removes it from every feed, link and saved list; its author still sees it.
