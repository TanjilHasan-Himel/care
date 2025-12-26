"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { services } from '@/data/services';
import clsx from 'clsx';

export function QuickSearchBar() {
  const router = useRouter();
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? 'baby-care');
  const [durationUnit, setDurationUnit] = useState<'hours' | 'days'>('hours');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    setSubmitting(true);
    router.push(`/service/${serviceSlug}?duration=${durationUnit}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white shadow-soft sm:flex-row sm:items-center sm:gap-3"
    >
      <div className="flex-1">
        <label className="label">Service type</label>
        <select
          className="input"
          value={serviceSlug}
          onChange={(e) => setServiceSlug(e.target.value)}
          aria-label="Choose service type"
        >
          {services.map((svc) => (
            <option key={svc.slug} value={svc.slug}>
              {svc.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <span className="label">Duration</span>
        <div className="inline-flex w-full rounded-full border border-slate-200 bg-slate-50 p-1 shadow-inner sm:w-auto">
          {(['hours', 'days'] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => setDurationUnit(unit)}
              className={clsx(
                'flex-1 rounded-full px-4 py-2 text-sm font-semibold capitalize transition',
                durationUnit === unit
                  ? 'bg-primary text-white shadow'
                  : 'text-slate-700 hover:text-primary'
              )}
              aria-pressed={durationUnit === unit}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end sm:w-auto">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
          {submitting ? 'Loading...' : 'Find Care'}
        </button>
      </div>
    </form>
  );
}
