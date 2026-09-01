export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3.5 px-4 animate-pulse">
      <div className="h-3 bg-border rounded w-1/6" />
      <div className="h-3 bg-border rounded w-1/6" />
      <div className="h-3 bg-border rounded w-1/6" />
      <div className="h-3 bg-border rounded w-1/6" />
      <div className="h-3 bg-border rounded w-1/6" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 animate-pulse">
      <div className="h-3 bg-border rounded w-1/3 mb-3" />
      <div className="h-6 bg-border rounded w-1/2" />
    </div>
  );
}
