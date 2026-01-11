import { SkeletonTable, SkeletonPageHeader, SkeletonButton, Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-4 md:px-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-12" />
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <SkeletonPageHeader />
        <SkeletonButton className="w-36" />
      </div>
      
      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SkeletonTable rows={8} columns={6} />
      </div>
    </div>
  );
}
