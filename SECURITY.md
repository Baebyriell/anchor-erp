# Security Rules for Anchor ERP

How to avoid getting hacked. Read this before adding features, and go through
the **Pre-launch checklist** before every deploy.

Sources: two TikTok videos on securing "vibe-coded" apps
([@district_chronicles](https://www.tiktok.com/@district_chronicles/video/7612006606582123807),
[@millee.md](https://www.tiktok.com/@millee.md/video/7672563454489873684)),
plus standard web-app security practice.

---

## The core rules (from the videos)

### 1. API keys and secrets live on the server only
- Never put API keys (OpenAI, Claude, Stripe, Supabase service role, etc.)
  in front-end code. Anything in a `'use client'` file or a
  `NEXT_PUBLIC_*` variable is visible to anyone who opens the site.
- Store secrets in environment variables (`.env.local` on your machine,
  the hosting dashboard in production). `.env*` files are git-ignored —
  never commit them.
- Make third-party API calls from the server: Next.js route handlers /
  server actions, or Supabase Edge Functions.
- If a key ever gets committed or exposed, **rotate it immediately** —
  deleting the commit is not enough.

> Prompt: *"Move all API calls that use secret keys to server-side code and
> read the keys from environment variables. Make sure no secret is exposed
> to the browser."*

### 2. Validate and sanitize every input
- Treat everything a user types (forms, search boxes, CSV uploads, URL
  params) as hostile until checked.
- Validate on the **server** (shape, type, length, allowed values) — client
  checks are only for convenience.
- Use parameterized queries / the database client's query builder; never
  build SQL by string concatenation.
- Never render user input as raw HTML (`dangerouslySetInnerHTML`).

> Prompt: *"Sanitize all user inputs."*

### 3. Don't build your own authentication
- Don't hand-roll passwords, tokens or sessions. Use a proven provider:
  **Supabase Auth**, **Clerk**, **Firebase Auth** or **Auth0**.
- Every page and API route that touches business data must require a
  logged-in user, checked on the server.

### 4. Rate-limit your API routes
- Limit how many requests one user/IP can make per minute. This blocks
  brute-force logins, scraping, spam, AI-feature abuse and crashes.

> Prompt: *"Add rate limiting to my API routes."*

### 5. Nothing is 100% hack-proof
The goal is to make the app as hard to attack as possible, and to limit the
damage if something does get through (least privilege, backups, logging).

---

## How Anchor ERP is secured

- **Login required:** `proxy.ts` sends anyone not signed in to `/login`.
  Sign-in uses Supabase Auth (`app/actions/auth.ts`).
- **Data on the server:** all sheets are stored in the Supabase `sheets`
  table. The browser never talks to Supabase directly; every read and write
  goes through server actions in `app/actions/sheets.ts`, which check the
  signed-in user, validate the data with zod, and rate-limit saves
  (120 per minute per user).
- **Row Level Security:** each user can only read and write their own rows
  (`supabase/migrations/`).
- **Old browser data** from the local-only version is uploaded to the server
  the first time each page is opened, then removed from the browser.
- **Environment variables:** `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`,
  both server-only (see `.env.example`).
- **Session cookies** are `HttpOnly`, `Secure` (in production) and
  `SameSite=Lax` (`lib/supabase/cookies.ts`), so scripts in the page can't
  steal a login.
- **Proof that RLS works:** run `supabase/tests/rls_check.sql` in the
  Supabase SQL Editor — every check must say PASS.

The full, project-independent checklist is in
[`docs/SECURITY-PLAYBOOK.md`](docs/SECURITY-PLAYBOOK.md).

## Anchor ERP specific rules

- **Business data lives on the server, behind login.** Customer names,
  phone numbers, emails, sales and pricing must be stored in the server
  database, never only in the browser (`localStorage`), and never in a
  database table that can be read without logging in.
- **Row Level Security (RLS) on every table.** If using Supabase, enable RLS
  on every table and add policies so users only see their own
  organization's rows. A table without RLS is public.
- **The Supabase `service_role` key is server-only.** Only the
  `anon`/publishable key may appear in browser code.
- **This repository is public.** Never commit real customer data, exports,
  database dumps, screenshots with customer info, or `.env` files.
- **CSV import/export:** exported cells are escaped so spreadsheet formulas
  (`=`, `+`, `-`, `@`) can't execute; imported CSV must be validated on the
  server before saving.
- **Keep dependencies patched.** Run `npm audit` before each deploy and fix
  high/critical issues.
- **Security headers** are set in `next.config.js` — don't remove them.

---

## Pre-launch checklist

### Secrets and keys
- [ ] No API keys, passwords or tokens anywhere in the code or git history
- [ ] All secrets in environment variables, set in the hosting dashboard
- [ ] Only public-safe values use the `NEXT_PUBLIC_` prefix
- [ ] Any key that was ever exposed has been rotated

### Authentication and access
- [ ] Login uses an established provider (Supabase / Clerk / Firebase / Auth0)
- [ ] Every data page and API route checks the user on the server
- [ ] Users can only read/write their own organization's data
- [ ] Admin-only actions (wipe data, bulk import) check the user's role

### Database
- [ ] RLS enabled on every table, with policies tested
- [ ] No table readable or writable with only the public key
- [ ] Automatic backups turned on

### Input handling
- [ ] All inputs validated on the server (type, length, allowed values)
- [ ] No raw SQL string building; no raw HTML rendering of user input
- [ ] File uploads limited by type and size and validated server-side

### API protection
- [ ] Rate limiting on all API routes, stricter on login
- [ ] Error messages don't leak stack traces or internal details

### Dependencies and config
- [ ] `npm audit` shows no high/critical issues
- [ ] Security headers present (check with securityheaders.com)
- [ ] HTTPS only

### Repository
- [ ] `.env*` files git-ignored; no real customer data committed
- [ ] GitHub secret scanning and Dependabot alerts turned on
