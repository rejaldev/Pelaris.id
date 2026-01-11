'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton';

export default function UsersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new location under settings
    router.replace('/dashboard/settings/users');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Skeleton width={48} height={48} rounded="full" className="mx-auto mb-4" />
        <Skeleton width={150} height={16} className="mx-auto" />
      </div>
    </div>
  );
}
