import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("skeleton-shimmer rounded-md", className)}
    />
  );
}

export function TaskRowSkeleton() {
  return (
    <div className="grid grid-cols-[60px_1fr_180px_180px_110px_60px_70px_24px] items-center gap-3 border-b px-4 py-2.5">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-24 rounded-full" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-3 w-10" />
      <Skeleton className="h-3 w-3" />
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-card p-4">
      <Skeleton className="h-2 w-16" />
      <Skeleton className="mt-2 h-7 w-12" />
      <Skeleton className="mt-3 h-7 w-full" />
    </div>
  );
}
