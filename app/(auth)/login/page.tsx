"use client";

import { FormEvent, Suspense, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function LoginPageInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('demo@care.xyz');
  const [password, setPassword] = useState('DemoPass1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (status === 'authenticated') {
    router.replace(callbackUrl);
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push(callbackUrl);
  };

  return (
    <div className="container flex max-w-lg flex-col gap-6">
      <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
      <p className="text-slate-600">Login with your email/password or use Google.</p>
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <label className="flex flex-col gap-1">
          <span className="label">Email</span>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Password</span>
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <button
          type="button"
          className="btn-primary bg-secondary hover:bg-sky-500"
          onClick={() => signIn('google', { callbackUrl })}
        >
          Continue with Google
        </button>
        <p className="text-sm text-slate-600">
          New here? <Link className="text-primary" href="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
