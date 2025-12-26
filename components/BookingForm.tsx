"use client";

import { useState, FormEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Service } from '@/data/services';
import { calculateCost, useBookingStore } from '@/lib/booking-store';

export function BookingForm({ service }: { service: Service }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const addBooking = useBookingStore((s) => s.addBooking);
  const [durationValue, setDurationValue] = useState(4);
  const [durationUnit, setDurationUnit] = useState<'hours' | 'days'>('hours');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [city, setCity] = useState('Dhaka');
  const [area, setArea] = useState('Gulshan');
  const [addressLine, setAddressLine] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalCost = calculateCost(service.pricePerHour, service.pricePerDay, durationValue, durationUnit);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!durationValue || durationValue <= 0) {
      setError('Please choose a valid duration.');
      return;
    }
    setSubmitting(true);
    const booking = addBooking({
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceName: service.name,
      durationValue,
      durationUnit,
      division,
      district,
      city,
      area,
      addressLine,
      totalCost,
      userEmail: session.user.email
    });

    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: session.user.email,
        subject: `Booking invoice - ${service.name}`,
        html: `<p>Hi ${session.user.name || ''},</p><p>Your booking for ${service.name} is received.</p><p>Total: $${totalCost}</p><p>Status: Pending</p>`
      })
    }).catch(() => {});

    setSubmitting(false);
    router.push('/my-bookings');
    return booking;
  };

  return (
    <form className="card flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="label">Duration value</span>
          <input
            className="input"
            type="number"
            min={1}
            value={durationValue}
            onChange={(e) => setDurationValue(Number(e.target.value))}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Unit</span>
          <select className="input" value={durationUnit} onChange={(e) => setDurationUnit(e.target.value as 'hours' | 'days')}>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="label">Division</span>
          <input className="input" value={division} onChange={(e) => setDivision(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">District</span>
          <input className="input" value={district} onChange={(e) => setDistrict(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">City</span>
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Area</span>
          <input className="input" value={area} onChange={(e) => setArea(e.target.value)} required />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="label">Address</span>
        <textarea
          className="input min-h-[80px]"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          placeholder="House, road, landmark"
          required
        />
      </label>

      <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <p className="font-semibold">Total cost</p>
        <p>${totalCost} ({durationValue} {durationUnit})</p>
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Saving...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
