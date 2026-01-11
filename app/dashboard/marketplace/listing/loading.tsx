import { SkeletonProductGrid, SkeletonFilterBar, SkeletonPageHeader } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-4 md:px-6 space-y-6">
      {/* Header */}
      <SkeletonPageHeader />
      {/* Filter */}
      <SkeletonFilterBar filters={3} />
      {/* Product List */}
      <SkeletonProductGrid count={12} columns={4} />
    </div>
  );
}
