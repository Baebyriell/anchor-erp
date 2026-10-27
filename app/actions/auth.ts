'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(200),
});

// Sign-in is handled by Supabase Auth, which also rate-limits login attempts.
export async function signIn(_prev: string | null, formData: FormData): Promise<string | null> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return 'Enter a valid email and a password of at least 8 characters.';

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Same message for every failure so attackers can't tell which emails exist.
  if (error) return 'Incorrect email or password.';

  redirect('/');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
