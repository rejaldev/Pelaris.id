import { SkeletonProductGrid, SkeletonPageHeader, SkeletonFilterBar } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-4 md:px-6 space-y-6">
      <SkeletonPageHeader />
      <SkeletonFilterBar filters={3} />
      <SkeletonProductGrid items={12} columns={4} />
    </div>
  );
}
