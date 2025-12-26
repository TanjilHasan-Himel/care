"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useBookingStore } from '@/lib/booking-store';
import { useMemo, useState } from 'react';
import type { BookingStatus } from '@/lib/booking-store';

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const userBookings = useMemo(() => {
    if (!session?.user?.email) return [];
    return bookings.filter((b) => b.userEmail === session.user?.email);
  }, [bookings, session?.user?.email]);

  const filteredBookings = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return userBookings.filter((b) => {
      const statusOk = statusFilter === 'All' || b.status === statusFilter;
      const text = `${b.serviceName} ${b.addressLine} ${b.division} ${b.district} ${b.city} ${b.area}`.toLowerCase();
      const queryOk = needle ? text.includes(needle) : true;
      return statusOk && queryOk;
    });
  }, [userBookings, statusFilter, query]);

  if (status === 'loading') {
    return (
      <div className="container flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-56 rounded bg-slate-200" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-20 rounded bg-slate-200" />
              <div className="h-6 w-14 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container card">
        <p className="text-lg font-semibold text-slate-900">Login required</p>
        <p className="text-slate-600">Please login to view your bookings.</p>
        <Link className="btn-primary mt-3 w-fit" href="/login?callbackUrl=/my-bookings">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="container flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">My Bookings</h1>
          <p className="text-slate-600">Track status and details of all your bookings.</p>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-48"
            placeholder="Search bookings"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((statusKey) => (
          <button
            key={statusKey}
            className={
              statusFilter === statusKey
                ? 'rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white'
                : 'rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700'
            }
            onClick={() => setStatusFilter(statusKey as BookingStatus | 'All')}
          >
            {statusKey}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card">
          <p className="text-slate-700">No bookings found.</p>
          <Link href="/" className="text-primary">
            Browse services
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{booking.serviceName}</p>
                  <p className="text-sm text-slate-500">{new Date(booking.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {booking.durationValue} {booking.durationUnit} • {booking.division}, {booking.district}, {booking.city}, {booking.area}
                  </p>
                  <p className="text-sm text-slate-600">Address: {booking.addressLine}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Total: ${booking.totalCost}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={statusBadgeClass(booking.status)}>{booking.status}</span>
                  <button
                    className="text-sm text-red-600"
                    onClick={() => cancelBooking(booking.id)}
                    disabled={booking.status === 'Cancelled'}
                  >
                    Cancel Booking
                  </button>
                  <Link href={`/service/${booking.serviceSlug}`} className="text-primary text-sm">
                    View service
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function statusBadgeClass(status: BookingStatus) {
  const map: Record<BookingStatus, string> = {
    Pending: 'badge bg-amber-50 text-amber-700',
    Confirmed: 'badge bg-emerald-50 text-emerald-700',
    Completed: 'badge bg-blue-50 text-blue-700',
    Cancelled: 'badge bg-rose-50 text-rose-700'
  };
  return map[status];
}
