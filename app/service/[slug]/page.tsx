import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/data/services';
import { BookingStepSection } from '@/components/BookingStepSection';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: 'Service not found' };
  return {
    title: `${service.name} | Care.xyz`,
    description: service.shortDescription
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return notFound();

  return (
    <div className="container grid gap-8 lg:grid-cols-3 lg:items-start">
      <section className="lg:col-span-2 card">
        <p className="badge w-fit">{service.name}</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{service.name}</h1>
        <p className="mt-2 text-slate-700">{service.description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {service.features.map((feature) => (
            <span key={feature} className="badge bg-green-50 text-green-700">
              {feature}
            </span>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-slate-600">Hourly</p>
            <p className="text-xl font-semibold text-slate-900">${service.pricePerHour}/hr</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-sm text-slate-600">Daily</p>
            <p className="text-xl font-semibold text-slate-900">${service.pricePerDay}/day</p>
          </div>
        </div>
      </section>
      <section className="lg:col-span-1">
        <BookingStepSection service={service} />
      </section>
    </div>
  );
}
