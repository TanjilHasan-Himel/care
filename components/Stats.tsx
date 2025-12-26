const stats = [
  { label: 'Families served', value: '12k+' },
  { label: 'Avg. rating', value: '4.8/5' },
  { label: 'Verified caregivers', value: '2.3k' }
];

export function Stats() {
  return (
    <div className="grid-auto-fit w-full">
      {stats.map((stat) => (
        <div key={stat.label} className="card">
          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          <p className="text-sm text-slate-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
