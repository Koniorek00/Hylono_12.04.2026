import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[55vh] w-full px-6 py-20 flex items-center justify-center">
      <div className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}