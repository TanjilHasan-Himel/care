import Link from 'next/link';
import { services } from '@/data/services';
import { ServiceCard } from '@/components/ServiceCard';
import { Stats } from '@/components/Stats';
import { Testimonials } from '@/components/Testimonials';
import { HeroSlider } from '@/components/HeroSlider';
import { QuickSearchBar } from '@/components/QuickSearchBar';

export const metadata = {
  title: 'Care.xyz | Baby Sitting & Elderly Care',
  description: 'Find trusted caregivers for babysitting, elderly care, and special care at home.'
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="relative">
        <div className="container">
          <HeroSlider />
          <div className="relative -mt-10 w-full">
            <QuickSearchBar />
          </div>
        </div>
      </section>

      <section className="container grid gap-10 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="badge">Services</p>
              <h2 className="text-2xl font-semibold text-slate-900">Choose the care you need</h2>
              <p className="text-slate-600">Baby care, elderly support, or home nursing—book in minutes.</p>
            </div>
            <Link href="/my-bookings" className="btn-ghost hidden lg:inline-flex">
              Track my bookings
            </Link>
          </div>
          <div className="grid-auto-fit">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Stats />
          <div className="card">
            <p className="badge">Safety & trust</p>
            <h3 className="text-xl font-semibold text-slate-900">Vetted caregivers. Secure bookings.</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• ID-verified and background-checked professionals</li>
              <li>• Secure payments and instant invoices</li>
              <li>• Live status tracking for every booking</li>
            </ul>
            <Link href="/service/elderly-care" className="btn-secondary mt-4 w-fit">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section id="trust" className="container">
        <div className="card">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="badge">Why families choose us</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Safety-first. Vetted caregivers. Flexible bookings.</h3>
              <p className="mt-2 text-slate-600">
                Verified caregivers, transparent pricing, and quick support—book in under 60 seconds.
              </p>
            </div>
            <Link href="/booking/baby-care" className="btn-primary">
              Book now
            </Link>
          </div>
          <div className="grid-auto-fit">
            <div className="card">
              <p className="text-2xl font-bold text-slate-900">500+ families</p>
              <p className="text-sm text-slate-600">served with trusted caregivers</p>
            </div>
            <div className="card">
              <p className="text-2xl font-bold text-slate-900">24/7</p>
              <p className="text-sm text-slate-600">support for urgent needs</p>
            </div>
            <div className="card">
              <p className="text-2xl font-bold text-slate-900">Secure</p>
              <p className="text-sm text-slate-600">payments & invoice emails</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <Testimonials />
      </section>
    </div>
  );
}
