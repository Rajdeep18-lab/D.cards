export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border border-highlight dark:border-darkHighlight bg-cardBg dark:bg-darkCard p-6">
          <div className="mb-4 h-36 rounded-2xl bg-neutralBg dark:bg-darkHighlight/50" />
          <div className="h-4 w-3/4 rounded bg-neutralBg dark:bg-darkHighlight/70" />
          <div className="mt-3 h-4 w-1/2 rounded bg-neutralBg dark:bg-darkHighlight/50" />
          <div className="mt-4 h-10 rounded-xl bg-neutralBg dark:bg-darkHighlight/40" />
        </div>
      ))}
    </div>
  );
}
