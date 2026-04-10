export default function TourDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10" aria-busy="true" aria-label="Loading tour">
      <div className="h-4 w-32 animate-pulse rounded bg-tp-surface" />
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 animate-pulse rounded-xl bg-tp-surface" />
          <div className="h-40 animate-pulse rounded-xl bg-tp-surface" />
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-tp-surface" />
      </div>
    </div>
  );
}
