import { Skeleton, SkeletonStatCard, SkeletonTable, SkeletonFilterBar, SkeletonPageHeader, SkeletonChart } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-4 md:px-6 space-y-6">
      {/* Header */}
      <SkeletonPageHeader />
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
      {/* Filter */}
      <SkeletonFilterBar filters={3} />
      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <Skeleton className="h-6 w-32 mb-4" />
        <SkeletonChart height={300} />
      </div>
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SkeletonTable rows={8} columns={5} />
      </div>
    </div>
  );
}
