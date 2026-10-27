'use client';
import React, { useActionState } from 'react';
import { signIn } from '../actions/auth';

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-mono flex items-center justify-center">
      <form action={formAction} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <header>
          <h1 className="text-2xl font-black text-amber-400 tracking-tight">⚓ ANCHOR CORE ERP</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to access your business data.</p>
        </header>

        <label className="block space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Email</span>
          <input name="email" type="email" autoComplete="email" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200" />
        </label>

        <label className="block space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Password</span>
          <input name="password" type="password" autoComplete="current-password" required minLength={8} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200" />
        </label>

        {error && (
          <p className="text-xs text-rose-400 font-bold" role="alert">{error}</p>
        )}

        <button type="submit" disabled={pending} className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition uppercase tracking-wider">
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
