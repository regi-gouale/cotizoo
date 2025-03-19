import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCard(props: { className?: string }) {
  return (
    <div className={cn("space-y-3", props.className)}>
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonCardList(props: {
  count?: number;
  className?: string;
}) {
  const count = props.count || 3;
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        props.className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
