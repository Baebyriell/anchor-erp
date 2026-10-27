import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Server-only Supabase client. The browser never talks to Supabase directly:
// every read and write goes through server actions using the user's session cookie.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component; the proxy refreshes the session instead.
        }
      },
    },
  });
}

// Returns the signed-in user, verified with Supabase Auth (not just the cookie).
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Not signed in');
  return { supabase, user: data.user };
}
