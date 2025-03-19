import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCardList } from "@/components/ui/skeleton-card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <SkeletonCardList count={6} />
    </div>
  );
}
