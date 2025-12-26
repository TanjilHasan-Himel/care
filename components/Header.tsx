"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/service/baby-care', label: 'Services' },
  { href: '/#trust', label: 'About' }
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    setAvatarOpen(false);
  }, [pathname]);

  const initials = useMemo(() => {
    const name = session?.user?.name || session?.user?.email || '';
    return name.slice(0, 2).toUpperCase() || 'U';
  }, [session?.user?.name, session?.user?.email]);

  return (
    <header className="nav-blur sticky top-0 z-40">
      <div className="container relative flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-extrabold text-primary">
          Care.xyz
        </Link>

        <nav className="hidden flex-1 items-center justify-center space-x-6 text-sm font-semibold text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'rounded-full px-3 py-2 transition hover:text-primary hover:bg-slate-100',
                pathname === item.href && 'bg-primary text-white shadow-soft'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {status === 'loading' ? (
            <span className="text-slate-500">Loading...</span>
          ) : session ? (
            <>
              <Link href="/booking/baby-care" className="btn-secondary hidden sm:inline-flex">
                Book Now
              </Link>
              <div className="relative">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-800 shadow-soft"
                  onClick={() => setAvatarOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={avatarOpen}
                >
                  {initials}
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-3 shadow-soft">
                    <p className="text-sm font-semibold text-slate-900">{session.user?.name || 'Account'}</p>
                    <p className="text-xs text-slate-500">{session.user?.email}</p>
                    <div className="mt-3 flex flex-col gap-2 text-sm">
                      <Link href="/my-bookings" className="hover:text-primary">
                        My bookings
                      </Link>
                      <Link href="/service/baby-care" className="hover:text-primary">
                        Services
                      </Link>
                      <button className="text-left text-red-600" onClick={() => signOut({ callbackUrl: '/' })}>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
