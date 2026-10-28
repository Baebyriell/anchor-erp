# Anchor ERP

Next.js (App Router) ERP for a China-to-Ghana pre-order and ready-stock business.

## Security rules (always follow)

Read and follow `SECURITY.md` (this app) and `docs/SECURITY-PLAYBOOK.md`
(the full checklist for every project) for every change. In short:

- Secrets and API keys only on the server, in environment variables. Never in
  `'use client'` files or `NEXT_PUBLIC_*` variables. Never commit `.env` files.
- Business and customer data belongs in the server database behind login,
  not only in `localStorage`.
- Use an established auth provider; never hand-roll auth. Check the user on
  the server for every data route.
- Validate and sanitize all user input on the server. No raw SQL strings, no
  `dangerouslySetInnerHTML` with user data.
- Add rate limiting to API routes.
- If using Supabase: RLS on every table; the `service_role` key is server-only.
- This repo is public: never commit real customer data.
- Session cookies stay `HttpOnly`/`Secure` (`lib/supabase/cookies.ts`).
- After any database change, run `supabase/tests/rls_check.sql`; every line must say PASS.
- Run `npm run security` and `npm run build` before pushing.
