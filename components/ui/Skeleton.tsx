'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}: SkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${animate ? 'animate-pulse' : ''}
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={style}
    />
  );
}

/**
 * Text skeleton - single line of text
 */
export function SkeletonText({
  width = '100%',
  className = '',
}: {
  width?: string | number;
  className?: string;
}) {
  return <Skeleton className={`h-4 ${className}`} width={width} />;
}

/**
 * Avatar/circle skeleton
 */
export function SkeletonAvatar({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return <Skeleton className={className} width={size} height={size} rounded="full" />;
}

/**
 * Button skeleton
 */
export function SkeletonButton({
  width = 80,
  height = 36,
  className = '',
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return <Skeleton className={className} width={width} height={height} rounded="md" />;
}

/**
 * Card skeleton with header and content
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <SkeletonAvatar size={32} />
        <div className="flex-1">
          <SkeletonText width="60%" className="mb-2" />
          <SkeletonText width="40%" className="h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText width="80%" />
        <SkeletonText width="90%" />
      </div>
    </div>
  );
}

/**
 * Table row skeleton
 */
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonText width={`${60 + Math.random() * 30}%`} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Full table skeleton
 */
export function SkeletonTable({
  rows = 5,
  columns = 5,
  showHeader = true,
  className = '',
}: {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        {showHeader && (
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <SkeletonText width={80} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Stats card skeleton (for dashboard)
 */
export function SkeletonStatCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <SkeletonText width={100} className="h-3" />
        <Skeleton width={32} height={32} rounded="md" />
      </div>
      <SkeletonText width="60%" className="h-8 mb-1" />
      <SkeletonText width={80} className="h-3" />
    </div>
  );
}

/**
 * Dashboard stats grid skeleton
 */
export function SkeletonDashboardStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}

/**
 * Chart skeleton
 */
export function SkeletonChart({
  height = 300,
  className = '',
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <SkeletonText width={150} className="h-5" />
        <SkeletonButton width={100} height={32} />
      </div>
      <Skeleton height={height} className="w-full" />
    </div>
  );
}

/**
 * Form skeleton
 */
export function SkeletonForm({
  fields = 4,
  className = '',
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <SkeletonText width={100} className="h-3 mb-2" />
          <Skeleton height={40} className="w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <SkeletonButton width={100} />
        <SkeletonButton width={80} />
      </div>
    </div>
  );
}

/**
 * List item skeleton
 */
export function SkeletonListItem({ 
  className = '',
  withAvatar = true,
}: { 
  className?: string;
  withAvatar?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {withAvatar && <SkeletonAvatar size={40} />}
      <div className="flex-1">
        <SkeletonText width="70%" className="mb-1" />
        <SkeletonText width="50%" className="h-3" />
      </div>
      <SkeletonButton width={60} height={28} />
    </div>
  );
}

/**
 * List skeleton
 */
export function SkeletonList({
  items = 5,
  className = '',
  withAvatar = true,
}: {
  items?: number;
  className?: string;
  withAvatar?: boolean;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonListItem key={i} withAvatar={withAvatar} />
      ))}
    </div>
  );
}

/**
 * Page header skeleton
 */
export function SkeletonPageHeader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div>
        <SkeletonText width={200} className="h-7 mb-2" />
        <SkeletonText width={300} className="h-4" />
      </div>
      <div className="flex gap-2">
        <SkeletonButton width={120} />
        <SkeletonButton width={100} />
      </div>
    </div>
  );
}

/**
 * Filter bar skeleton
 */
export function SkeletonFilterBar({ filters = 3, className = '' }: { filters?: number; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 mb-4 ${className}`}>
      {Array.from({ length: filters }).map((_, i) => (
        <Skeleton key={i} width={150} height={40} />
      ))}
      <SkeletonButton width={100} />
    </div>
  );
}

/**
 * Product grid item skeleton
 */
export function SkeletonProductCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
      <Skeleton height={150} className="w-full" rounded="none" />
      <div className="p-3">
        <SkeletonText width="80%" className="mb-2" />
        <SkeletonText width="50%" className="h-3 mb-2" />
        <div className="flex items-center justify-between">
          <SkeletonText width={80} className="h-5" />
          <SkeletonButton width={60} height={28} />
        </div>
      </div>
    </div>
  );
}

/**
 * Product grid skeleton
 */
export function SkeletonProductGrid({
  items = 8,
  count,
  columns = 4,
  className = '',
}: {
  items?: number;
  count?: number;
  columns?: number;
  className?: string;
}) {
  const itemCount = count ?? items;
  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }[columns] || 'grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-4 ${className}`}>
      {Array.from({ length: itemCount }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

/**
 * Full page loading skeleton
 */
export function SkeletonPage({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      <SkeletonPageHeader />
      <SkeletonFilterBar />
      <SkeletonTable rows={10} columns={6} />
    </div>
  );
}

/**
 * Dashboard page loading skeleton
 */
export function SkeletonDashboardPage({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      <SkeletonPageHeader />
      <SkeletonDashboardStats count={4} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart height={250} />
        <SkeletonChart height={250} />
      </div>
      <SkeletonTable rows={5} columns={5} />
    </div>
  );
}
