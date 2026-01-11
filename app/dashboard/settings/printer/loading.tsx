import { SkeletonForm, Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-4 md:px-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Printer Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* Cabang Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          
          {/* Auto Print Toggle */}
          <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-7 w-12 rounded-full" />
            </div>
          </div>
          
          {/* Receipt Preview */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
          
          {/* Form Fields */}
          <SkeletonForm fields={5} />
          
          {/* Save Button */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
