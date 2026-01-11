import { SkeletonStatCard, SkeletonTable, SkeletonFilterBar, SkeletonPageHeader } from '@/components/ui/Skeleton';

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
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SkeletonTable rows={10} columns={7} />
      </div>
    </div>
  );
}
