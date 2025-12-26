import Link from 'next/link';
import { Service } from '@/data/services';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
          <p className="text-sm text-slate-600">{service.shortDescription}</p>
        </div>
        <span className="badge">From ${service.pricePerHour}/hr</span>
      </div>
      <ul className="text-sm text-slate-600">
        {service.features.slice(0, 3).map((feature) => (
          <li key={feature}>• {feature}</li>
        ))}
      </ul>
      <Link href={`/service/${service.slug}`} className="text-primary">
        View details
      </Link>
    </div>
  );
}
