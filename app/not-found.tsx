import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container card text-center">
      <h1 className="text-3xl font-bold text-slate-900">404 - Not Found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <Link className="btn-primary mt-4" href="/">
        Go Home
      </Link>
    </div>
  );
}
