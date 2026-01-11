'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<NextImageProps, 'onError'> {
  fallback?: string;
  fallbackClassName?: string;
}

/**
 * Optimized Image Component
 * 
 * Wraps next/image with:
 * - Automatic fallback on error
 * - Loading placeholder
 * - Blur placeholder for local images
 * 
 * @example
 * <OptimizedImage
 *   src="/products/image.jpg"
 *   alt="Product"
 *   width={200}
 *   height={200}
 *   className="rounded-lg"
 * />
 */
export function OptimizedImage({
  src,
  alt,
  fallback = '/placeholder-image.svg',
  fallbackClassName,
  className,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = useCallback(() => {
    setError(true);
    setLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  // If error, show fallback
  if (error) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
          fallbackClassName || className
        )}
        style={{ width: props.width, height: props.height }}
      >
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: props.width, height: props.height }}>
      {loading && (
        <div 
          className={cn(
            'absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded',
            className
          )}
        />
      )}
      <NextImage
        src={src}
        alt={alt}
        className={cn(
          loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300',
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}

/**
 * Product Image Component
 * 
 * Specialized image component for product displays with:
 * - Consistent sizing
 * - Object-cover fit
 * - Product-specific placeholder
 */
export function ProductImage({
  src,
  alt,
  size = 'md',
  className,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizes = {
    sm: { width: 48, height: 48 },
    md: { width: 80, height: 80 },
    lg: { width: 120, height: 120 },
    xl: { width: 200, height: 200 },
  };

  const { width, height } = sizes[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-cover rounded-lg', className)}
      {...props}
    />
  );
}

/**
 * Avatar Image Component
 * 
 * Circular image for user avatars with fallback initials
 */
export function AvatarImage({
  src,
  alt,
  size = 'md',
  initials,
  className,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
}) {
  const [error, setError] = useState(false);

  const sizes = {
    xs: { width: 24, height: 24, text: 'text-xs' },
    sm: { width: 32, height: 32, text: 'text-sm' },
    md: { width: 40, height: 40, text: 'text-base' },
    lg: { width: 56, height: 56, text: 'text-lg' },
    xl: { width: 80, height: 80, text: 'text-xl' },
  };

  const { width, height, text } = sizes[size];

  if (error || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-medium',
          text,
          className
        )}
        style={{ width, height }}
      >
        {initials || alt?.charAt(0)?.toUpperCase() || '?'}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn('rounded-full object-cover', className)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}

/**
 * Background Image Component
 * 
 * For hero sections, banners, etc. with blur placeholder
 */
export function BackgroundImage({
  src,
  alt,
  children,
  className,
  overlayClassName,
  ...props
}: OptimizedImageProps & {
  children?: React.ReactNode;
  overlayClassName?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
        {...props}
      />
      {overlayClassName && (
        <div className={cn('absolute inset-0', overlayClassName)} />
      )}
      {children && (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
}

export default OptimizedImage;
