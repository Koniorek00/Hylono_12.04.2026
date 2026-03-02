'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Application Error
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">A critical error occurred</h1>
          <p className="mt-3 text-sm text-slate-600">
            We weren&apos;t able to render this page. Please retry, and if the issue persists,
            contact Hylono support.
          </p>

          {error?.message ? (
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{error.message}</p>
          ) : null}

          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}