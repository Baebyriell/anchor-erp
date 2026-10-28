# Security Playbook — for every app, website and automation

A reusable checklist for building things that can't be hacked easily and
don't leak data. Use it on **every** project: copy this file into new repos,
and hand it to Claude with *"Go through docs/SECURITY-PLAYBOOK.md and fix
anything this project doesn't do yet."*

Nothing is 100% hack-proof. The goal is to make attacks as hard as possible
and to limit the damage if one gets through.

Compiled from six videos (links at the bottom) plus standard practice.
Copy-paste prompts are in *italics*.

---

## 1. Secrets and keys

| # | Rule | Prompt |
|---|------|--------|
| 1.1 | API keys (OpenAI, Claude, Gemini, Stripe, …) live **only on the server**, never in front-end code. | *"Move every API call that uses a secret key to server-side code and read keys from environment variables."* |
| 1.2 | Store secrets in environment variables; `.env*` files are git-ignored. | *"Check my env variables and make sure no .env file is committed."* |
| 1.3 | The front end only ever uses the **public, limited** key (e.g. Supabase publishable/anon key). The **admin / service-role key stays server-side** — exposing it bypasses Row Level Security completely. | *"Make sure the frontend only ever uses my public limited key and keep the admin key server side."* |
| 1.4 | Check **git history** for keys, not just current files. Deleting a file doesn't remove it from history. | *"Scan the git history for leaked secrets."* |
| 1.5 | If a key ever leaked: **rotate it immediately** (make a new one, delete the old one), then purge it from git. | *"Purge git secrets."* |
| 1.6 | Set a **spend cap** on every paid API and cloud account so a leaked key or abuse can't run up a huge bill. | (do this in each provider's billing dashboard) |

## 2. Login and access control

| # | Rule | Prompt |
|---|------|--------|
| 2.1 | Never build your own login. Use **Supabase Auth, Clerk, Firebase Auth or Auth0** — they hash passwords and handle sessions for you. | |
| 2.2 | Enforce auth **on the server** for every page, API route and action. Front-end checks alone are not security. | *"Enforce server-side auth on every route."* |
| 2.3 | **Broken access control:** a logged-in user must never be able to load another user's data by changing an ID. | *"Check that the logged-in user actually owns the data before handing anything back."* · *"Audit my auth flow."* |
| 2.4 | Protect **admin routes** and check **user permissions/roles** for admin-only actions. | *"Protect admin routes and check user permissions."* |
| 2.5 | **Block field tampering:** never trust IDs, prices, roles or `owner_id` sent from the browser — set them on the server. | *"Make sure users can't change fields like owner, role or price by editing the request."* |
| 2.6 | **Rate-limit login** and add **bot protection** (CAPTCHA such as Cloudflare Turnstile) to sign-in/sign-up forms. | *"Rate limit login and add bot protection."* |
| 2.7 | Turn off public sign-ups for internal tools; invite users instead. | |

## 3. Database

| # | Rule | Prompt |
|---|------|--------|
| 3.1 | **Row Level Security ON for every table.** Without it, anyone with the public key can run `db.from('users').select('*')` from DevTools and download everything. | *"Enable row-level security on every table."* |
| 3.2 | Write policies for **both read AND write** (select, insert, update, delete). | |
| 3.3 | **Test as another user:** log in as user B, try to read user A's rows — you must get **0 rows**. | *"Write a test that logs in as a second user and proves they can't see the first user's data."* |
| 3.4 | **Parameterize every query** (SQL injection). | *"Parameterize every query so whatever people type into my forms is treated as data, not code."* |
| 3.5 | **Encrypt sensitive data** (at rest is default on Supabase/Firebase; encrypt extra-sensitive fields like ID numbers yourself). | |
| 3.6 | Turn on automatic **backups**. | |

Example Supabase policy:
```sql
alter table messages enable row level security;
create policy "own rows" on messages for select using (auth.uid() = user_id);
```

## 4. Input and output

| # | Rule | Prompt |
|---|------|--------|
| 4.1 | **Validate all input on the server** (type, length, allowed values) — e.g. with zod. | *"Sanitize all user inputs."* · *"Validate all input."* |
| 4.2 | **Escape user content** when displaying it (XSS). Never put user data into `dangerouslySetInnerHTML` / `innerHTML`. | *"Protect against XSS and escape user content."* |
| 4.3 | **Secure file uploads:** limit type and size, scan/validate on the server, store outside the web root. | *"Restrict and secure file uploads."* |
| 4.4 | **Trim API responses:** only return the fields the screen needs — never whole user records, password hashes or internal IDs. | *"Trim API responses to only the fields the frontend uses."* |
| 4.5 | CSV exports: neutralise formulas (`=`, `+`, `-`, `@`) so files can't run code in Excel. | |

## 5. API and traffic protection

| # | Rule | Prompt |
|---|------|--------|
| 5.1 | **Rate-limit every API route** (blocks spam, scraping, brute force, AI-cost abuse, crashes). | *"Add rate limiting to my API routes."* |
| 5.2 | **CSRF protection** for any form or endpoint that changes data (Next.js server actions check the origin automatically). | *"Add CSRF protection."* |
| 5.3 | **CORS:** only allow your own domains, never `*` on authenticated APIs. | *"Check my CORS settings."* |
| 5.4 | Error messages must not leak stack traces or internal details. | |

## 6. Browser and transport

| # | Rule | Prompt |
|---|------|--------|
| 6.1 | **HTTPS only** (HSTS header). | *"Force HTTPS."* |
| 6.2 | **Security headers:** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, ideally a Content-Security-Policy. Check at securityheaders.com. | *"Add security headers."* |
| 6.3 | **Secure session cookies:** `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict). | *"Secure session cookies."* |

## 7. Production readiness

| # | Rule | Prompt |
|---|------|--------|
| 7.1 | **Disable debug mode**, dev tools and verbose logging in production. | *"Disable debug mode and check prod settings."* |
| 7.2 | **Scan dependencies** (`npm audit`) and fix high/critical issues before every launch; turn on GitHub Dependabot and secret scanning. | *"Scan dependencies."* |
| 7.3 | Run your database provider's security advisor (Supabase → Advisors) after every schema change. | |

---

## One-shot pre-launch prompt

> *"Before launch, go through docs/SECURITY-PLAYBOOK.md item by item. For each
> one, say whether this project already does it (with the file that proves it),
> fix it if not, and list anything only I can do in a dashboard."*

## Sources

- [@district_chronicles — How to not get hacked when vibe coding](https://www.tiktok.com/@district_chronicles/video/7612006606582123807)
- [@millee.md — All 30 major security holes](https://www.tiktok.com/@millee.md/video/7672563454489873684)
- [@millee.md — Securitymaxxing your vibecoded app pt.2](https://www.tiktok.com/@millee.md/video/7667762464045681941)
- [@millee.md — 20 things to have Claude do before launching](https://www.tiktok.com/@millee.md/video/7673301891551448341)
- [@yatesvids — 20 essential website security checks](https://www.tiktok.com/@yatesvids/video/7675613491977342216)
- [@9jabestwebdev — Row Level Security explained](https://www.tiktok.com/@9jabestwebdev/video/7701012886558182677)
