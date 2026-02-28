'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Something went wrong</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-900">Unexpected application error</h2>
        <p className="mt-3 text-sm text-slate-600">
          We couldn&apos;t load this section. Please try again. If the problem persists, contact support.
        </p>
        {error?.message ? (
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{error.message}</p>
        ) : null}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
