import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="px-4 md:px-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="text-center py-12">
            {/* Icon */}
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
            {/* Title */}
            <Skeleton className="h-7 w-40 mx-auto mb-2" />
            {/* Description */}
            <Skeleton className="h-4 w-80 mx-auto" />
            
            {/* Feature List */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                <Skeleton className="h-5 w-40 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
