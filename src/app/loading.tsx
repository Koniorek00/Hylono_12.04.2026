export default function Loading() {
  return (
    <div className="min-h-[40vh] w-full flex items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <span className="sr-only">Loading page content</span>
    </div>
  );
}
