import { SkeletonList, SkeletonPageHeader, SkeletonButton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-4 md:px-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <SkeletonPageHeader />
        <SkeletonButton className="w-32" />
      </div>
      {/* Branch List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SkeletonList items={6} withAvatar />
      </div>
    </div>
  );
}
