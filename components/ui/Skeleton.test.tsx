import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTableRow,
  SkeletonTable,
  SkeletonStatCard,
  SkeletonDashboardStats,
  SkeletonChart,
  SkeletonForm,
  SkeletonListItem,
  SkeletonList,
  SkeletonPageHeader,
  SkeletonFilterBar,
  SkeletonProductCard,
  SkeletonProductGrid,
  SkeletonPage,
  SkeletonDashboardPage,
} from './Skeleton';

describe('Skeleton Components', () => {
  describe('Skeleton (base)', () => {
    it('should render with default props', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
      expect(skeleton).toHaveClass('rounded-md');
    });

    it('should render with custom dimensions', () => {
      const { container } = render(<Skeleton width={100} height={50} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
    });

    it('should apply different rounded styles', () => {
      const { container } = render(<Skeleton rounded="full" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('should disable animation when animate is false', () => {
      const { container } = render(<Skeleton animate={false} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).not.toHaveClass('animate-pulse');
    });
  });

  describe('SkeletonText', () => {
    it('should render with default width', () => {
      const { container } = render(<SkeletonText />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('h-4');
      expect(skeleton).toHaveStyle({ width: '100%' });
    });

    it('should render with custom width', () => {
      const { container } = render(<SkeletonText width="50%" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '50%' });
    });
  });

  describe('SkeletonAvatar', () => {
    it('should render with default size', () => {
      const { container } = render(<SkeletonAvatar />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('rounded-full');
      expect(skeleton).toHaveStyle({ width: '40px', height: '40px' });
    });

    it('should render with custom size', () => {
      const { container } = render(<SkeletonAvatar size={60} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '60px', height: '60px' });
    });
  });

  describe('SkeletonButton', () => {
    it('should render with default dimensions', () => {
      const { container } = render(<SkeletonButton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '80px', height: '36px' });
    });
  });

  describe('SkeletonCard', () => {
    it('should render with avatar and text skeletons', () => {
      const { container } = render(<SkeletonCard />);
      expect(container.querySelector('.rounded-full')).toBeInTheDocument();
      expect(container.querySelectorAll('.h-4').length).toBeGreaterThan(0);
    });
  });

  describe('SkeletonTable', () => {
    it('should render correct number of rows', () => {
      const { container } = render(<SkeletonTable rows={3} columns={4} />);
      const tbody = container.querySelector('tbody');
      expect(tbody?.children.length).toBe(3);
    });

    it('should render header when showHeader is true', () => {
      const { container } = render(<SkeletonTable showHeader={true} />);
      expect(container.querySelector('thead')).toBeInTheDocument();
    });

    it('should not render header when showHeader is false', () => {
      const { container } = render(<SkeletonTable showHeader={false} />);
      expect(container.querySelector('thead')).not.toBeInTheDocument();
    });
  });

  describe('SkeletonDashboardStats', () => {
    it('should render correct number of stat cards', () => {
      const { container } = render(<SkeletonDashboardStats count={6} />);
      const cards = container.querySelectorAll('.shadow');
      expect(cards.length).toBe(6);
    });
  });

  describe('SkeletonList', () => {
    it('should render correct number of items', () => {
      const { container } = render(<SkeletonList items={3} />);
      const items = container.querySelectorAll('.border-b');
      expect(items.length).toBe(3);
    });
  });

  describe('SkeletonProductGrid', () => {
    it('should render correct number of product cards', () => {
      const { container } = render(<SkeletonProductGrid items={6} />);
      const cards = container.querySelectorAll('.shadow');
      expect(cards.length).toBe(6);
    });
  });

  describe('SkeletonPage', () => {
    it('should render header, filter bar, and table', () => {
      const { container } = render(<SkeletonPage />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });
  });

  describe('SkeletonDashboardPage', () => {
    it('should render stats, charts, and table', () => {
      const { container } = render(<SkeletonDashboardPage />);
      // Should have stats cards (4 by default)
      expect(container.querySelectorAll('.shadow').length).toBeGreaterThan(0);
      // Should have table
      expect(container.querySelector('table')).toBeInTheDocument();
    });
  });
});
