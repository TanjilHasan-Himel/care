"use client";

import { FormEvent, Suspense, useMemo, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const router = useRouter();
  const { status } = useSession();
  const [form, setForm] = useState({
    nid: '',
    name: '',
    email: '',
    contact: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 8,
      upper: /[A-Z]/.test(form.password),
      lower: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password)
    }),
    [form.password]
  );

  const checklistComplete = Object.values(passwordChecks).every(Boolean);
  const canSubmit = checklistComplete && Object.values(form).every((v) => v.trim().length > 0) && !loading;

  if (status === 'authenticated') {
    router.replace(callbackUrl);
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!checklistComplete) {
      setError('Please meet all password requirements.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || 'Registration failed');
      setLoading(false);
      return;
    }
    await signIn('credentials', { redirect: false, email: form.email, password: form.password, callbackUrl });
    router.push(callbackUrl);
  };

  return (
    <div className="container flex max-w-lg flex-col gap-6">
      <h1 className="text-3xl font-semibold text-slate-900">Create your account</h1>
      <p className="text-slate-600">Register to book services.</p>
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <label className="flex flex-col gap-1">
          <span className="label">NID Number</span>
          <input className="input" required value={form.nid} onChange={(e) => setForm({ ...form, nid: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Full Name</span>
          <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Email</span>
          <input
            className="input"
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Contact</span>
          <input className="input" required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Password</span>
          <input
            className="input"
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 8 chars, mix case, number"
          />
        </label>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <p className="font-semibold text-slate-800">Password must include:</p>
          <ul className="mt-2 space-y-1">
            <li className={passwordChecks.length ? 'text-emerald-700' : 'text-slate-500'}>• At least 8 characters</li>
            <li className={passwordChecks.upper ? 'text-emerald-700' : 'text-slate-500'}>• One uppercase letter</li>
            <li className={passwordChecks.lower ? 'text-emerald-700' : 'text-slate-500'}>• One lowercase letter</li>
            <li className={passwordChecks.number ? 'text-emerald-700' : 'text-slate-500'}>• One number</li>
          </ul>
        </div>
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {loading ? 'Creating account...' : 'Register & Continue'}
        </button>
        <p className="text-sm text-slate-600">
          Already have an account? <Link className="text-primary" href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <RegisterPageInner />
    </Suspense>
  );
}
