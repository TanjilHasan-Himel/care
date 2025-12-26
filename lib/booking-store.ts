"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export type Booking = {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  durationValue: number;
  durationUnit: 'hours' | 'days';
  division: string;
  district: string;
  city: string;
  area: string;
  addressLine: string;
  totalCost: number;
  status: BookingStatus;
  createdAt: string;
  userEmail: string;
};

type State = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Booking;
  cancelBooking: (id: string) => void;
  updateStatus: (id: string, status: BookingStatus) => void;
};

export const useBookingStore = create<State>()(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (bookingInput) => {
        const booking: Booking = {
          ...bookingInput,
          id: uuid(),
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
        set((state) => ({ bookings: [booking, ...state.bookings] }));
        return booking;
      },
      cancelBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
        })),
      updateStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b))
        }))
    }),
    { name: 'carexyz-bookings' }
  )
);

export const calculateCost = (pricePerHour: number, pricePerDay: number, value: number, unit: 'hours' | 'days') => {
  if (!value || value <= 0) return 0;
  return unit === 'hours' ? pricePerHour * value : pricePerDay * value;
};
