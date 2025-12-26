"use client";

import { useState } from 'react';
import { Service } from '@/data/services';
import { calculateCost } from '@/lib/booking-store';
import { BookingStepper, StepperSummary } from './BookingStepper';

export function BookingStepSection({ service }: { service: Service }) {
  const [summary, setSummary] = useState<StepperSummary>({
    durationValue: 4,
    durationUnit: 'hours',
    totalCost: calculateCost(service.pricePerHour, service.pricePerDay, 4, 'hours')
  });

  const location = [summary.division, summary.district, summary.city, summary.area].filter(Boolean).join(' › ');

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
      <BookingStepper service={service} onSummaryChange={setSummary} />
      <div className="card hidden lg:block">
        <p className="badge">Order summary</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{service.name}</h3>
        <p className="text-sm text-slate-600">Duration: {summary.durationValue} {summary.durationUnit}</p>
        <p className="text-sm text-slate-600">Location: {location || 'Select a location'}</p>
        {summary.addressLine ? <p className="text-sm text-slate-600">Address: {summary.addressLine}</p> : null}
        <div className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <p className="font-semibold">Total: ${summary.totalCost}</p>
          <p className="text-xs text-blue-900/80">Hourly ${service.pricePerHour} • Daily ${service.pricePerDay}</p>
        </div>
      </div>
    </div>
  );
}
