import { Skeleton } from '@/components/ui/Skeleton';

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
      
      {/* Backup Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* Auto Backup Section */}
          <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-7 w-12 rounded-full" />
            </div>
          </div>
          
          {/* Manual Backup Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
          
          {/* Last Backup Info */}
          <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-5 w-36" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
