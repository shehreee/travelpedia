export default function ToursLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10" aria-busy="true" aria-label="Loading tours">
      <div className="h-9 w-48 animate-pulse rounded-md bg-tp-surface" />
      <div className="mt-2 h-4 w-full max-w-md animate-pulse rounded bg-tp-surface" />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="h-80 w-full shrink-0 animate-pulse rounded-xl bg-tp-surface lg:w-72" />
        <div className="grid min-w-0 flex-1 gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-tp-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
