"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

const ROTATE_MS = 5500;

const slides = [
  {
    title: 'Baby care with certified caregivers',
    subtitle: 'Gentle routines, CPR-trained sitters, instant booking confidence.',
    image:
      'https://images.unsplash.com/photo-1503455637927-730bce8583c0?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'Book baby care',
    ctaHref: '/service/baby-care',
    badge: 'Trusted by young families'
  },
  {
    title: 'Elderly support that feels like family',
    subtitle: 'Mobility help, meds reminders, and warm companionship at home.',
    image:
      'https://images.unsplash.com/photo-1582719478248-54e9f2af76ae?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'Explore elderly care',
    ctaHref: '/service/elderly-care',
    badge: 'Responsive support 24/7'
  },
  {
    title: 'Home nursing for recovery days',
    subtitle: 'Vitals monitoring, doctor instruction adherence, and safe meal prep.',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'View home nursing',
    ctaHref: '/service/sick-care',
    badge: 'Nurses & attendants'
  }
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, prefersReducedMotion]);

  const goTo = (idx: number) => setActive(idx % slides.length);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/40 shadow-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[420px] w-full">
        {slides.map((slide, idx) => {
          const isActive = idx === active;
          return (
            <div
              key={slide.title}
              className={clsx(
                'absolute inset-0 transition-opacity duration-500',
                isActive ? 'opacity-100' : 'opacity-0'
              )}
              aria-hidden={!isActive}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(110deg, rgba(15,23,42,0.72) 0%, rgba(15,23,42,0.35) 55%, rgba(15,23,42,0.15) 100%), url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="relative z-10 flex h-full flex-col justify-center gap-4 px-6 py-8 sm:px-10 lg:px-14 text-white">
                <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {slide.badge}
                </span>
                <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{slide.title}</h1>
                <p className="max-w-2xl text-base sm:text-lg text-slate-100/90">{slide.subtitle}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={slide.ctaHref} className="btn-primary">
                    {slide.ctaLabel}
                  </Link>
                  <button
                    type="button"
                    className="btn-ghost text-white border-white/30 hover:bg-white/10"
                    onClick={() => setPaused((p) => !p)}
                    aria-pressed={paused}
                  >
                    {paused ? 'Resume' : 'Pause'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

      <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={clsx(
                'h-2.5 w-2.5 rounded-full transition',
                idx === active ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full bg-white/85 px-3 py-2 text-sm font-semibold text-slate-800 shadow"
            onClick={() => goTo((active - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
          >
            Prev
          </button>
          <button
            type="button"
            className="rounded-full bg-white/85 px-3 py-2 text-sm font-semibold text-slate-800 shadow"
            onClick={() => goTo(active + 1)}
            aria-label="Next slide"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
