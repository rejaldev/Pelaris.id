import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OptimizedImage, ProductImage, AvatarImage } from './OptimizedImage';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, onError, onLoad, className, ...props }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={onError}
        onLoad={onLoad}
        data-testid="next-image"
        {...props}
      />
    );
  },
}));

describe('OptimizedImage', () => {
  it('should render image with correct props', () => {
    render(
      <OptimizedImage
        src="/test.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    );

    const img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('src', '/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('should show loading state initially', () => {
    render(
      <OptimizedImage
        src="/test.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    );

    // Should have animate-pulse loading indicator
    const container = screen.getByTestId('next-image').parentElement;
    const loadingIndicator = container?.querySelector('.animate-pulse');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('should show fallback on error', async () => {
    render(
      <OptimizedImage
        src="/broken.jpg"
        alt="Broken image"
        width={200}
        height={200}
      />
    );

    const img = screen.getByTestId('next-image');
    fireEvent.error(img);

    await waitFor(() => {
      // Should show fallback SVG icon (the container with svg)
      const fallback = document.querySelector('svg');
      expect(fallback).toBeInTheDocument();
    });
  });

  it('should hide loading on load', async () => {
    render(
      <OptimizedImage
        src="/test.jpg"
        alt="Test image"
        width={200}
        height={200}
      />
    );

    const img = screen.getByTestId('next-image');
    fireEvent.load(img);

    await waitFor(() => {
      expect(img).toHaveClass('opacity-100');
    });
  });
});

describe('ProductImage', () => {
  it('should render with correct size', () => {
    render(
      <ProductImage
        src="/product.jpg"
        alt="Product"
        size="md"
      />
    );

    const img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('width', '80');
    expect(img).toHaveAttribute('height', '80');
  });

  it('should render small size', () => {
    render(
      <ProductImage
        src="/product.jpg"
        alt="Product"
        size="sm"
      />
    );

    const img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('width', '48');
    expect(img).toHaveAttribute('height', '48');
  });

  it('should render large size', () => {
    render(
      <ProductImage
        src="/product.jpg"
        alt="Product"
        size="lg"
      />
    );

    const img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('width', '120');
    expect(img).toHaveAttribute('height', '120');
  });

  it('should render xl size', () => {
    render(
      <ProductImage
        src="/product.jpg"
        alt="Product"
        size="xl"
      />
    );

    const img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('width', '200');
    expect(img).toHaveAttribute('height', '200');
  });
});

describe('AvatarImage', () => {
  it('should render avatar with image', () => {
    render(
      <AvatarImage
        src="/avatar.jpg"
        alt="User"
        size="md"
      />
    );

    const img = screen.getByTestId('next-image');
    expect(img).toHaveClass('rounded-full');
  });

  it('should show initials fallback when no src', () => {
    render(
      <AvatarImage
        src=""
        alt="John Doe"
        size="md"
        initials="JD"
      />
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should use first letter of alt as fallback', () => {
    render(
      <AvatarImage
        src=""
        alt="Alice"
        size="md"
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should render different sizes', () => {
    const { rerender } = render(
      <AvatarImage src="/avatar.jpg" alt="User" size="xs" />
    );

    let img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('width', '24');

    rerender(<AvatarImage src="/avatar.jpg" alt="User" size="sm" />);
    img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('width', '32');

    rerender(<AvatarImage src="/avatar.jpg" alt="User" size="lg" />);
    img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('width', '56');

    rerender(<AvatarImage src="/avatar.jpg" alt="User" size="xl" />);
    img = screen.getByTestId('next-image');
    expect(img).toHaveAttribute('width', '80');
  });

  it('should show fallback on error', async () => {
    render(
      <AvatarImage
        src="/broken.jpg"
        alt="John"
        size="md"
      />
    );

    const img = screen.getByTestId('next-image');
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByText('J')).toBeInTheDocument();
    });
  });
});
