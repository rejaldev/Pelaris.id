import { SkeletonTable, SkeletonFilterBar, SkeletonPageHeader } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-4 md:px-6 space-y-6">
      {/* Header */}
      <SkeletonPageHeader />
      {/* Filter */}
      <SkeletonFilterBar filters={4} />
      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SkeletonTable rows={10} columns={7} />
      </div>
    </div>
  );
}
