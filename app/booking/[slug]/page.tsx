import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/data/services';
import { BookingStepSection } from '@/components/BookingStepSection';

export default function BookingPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return notFound();
  return (
    <div className="container grid gap-6 lg:grid-cols-3 lg:items-start">
      <section className="lg:col-span-2 card">
        <h1 className="text-2xl font-semibold text-slate-900">Book {service.name}</h1>
        <p className="text-slate-600">Choose duration, location, and confirm your booking.</p>
        <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold">Pricing</p>
          <p>
            ${service.pricePerHour}/hr or ${service.pricePerDay}/day. Total cost updates automatically based on your selection.
          </p>
        </div>
      </section>
      <section className="lg:col-span-1">
        <BookingStepSection service={service} />
      </section>
    </div>
  );
}
