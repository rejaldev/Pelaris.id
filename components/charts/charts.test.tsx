import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ChartContainer,
  Line,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from './index';

// Mock recharts
vi.mock('recharts', () => ({
  LineChart: ({ children, ...props }: any) => (
    <div data-testid="line-chart" {...props}>
      {children}
    </div>
  ),
  BarChart: ({ children, ...props }: any) => (
    <div data-testid="bar-chart" {...props}>
      {children}
    </div>
  ),
  AreaChart: ({ children, ...props }: any) => (
    <div data-testid="area-chart" {...props}>
      {children}
    </div>
  ),
  PieChart: ({ children, ...props }: any) => (
    <div data-testid="pie-chart" {...props}>
      {children}
    </div>
  ),
  Line: () => <div data-testid="line" />,
  Bar: () => <div data-testid="bar" />,
  Area: () => <div data-testid="area" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children, ...props }: any) => (
    <div data-testid="responsive-container" {...props}>
      {children}
    </div>
  ),
  ReferenceLine: () => <div data-testid="reference-line" />,
  Brush: () => <div data-testid="brush" />,
}));

// Mock skeleton
vi.mock('@/components/ui/Skeleton', () => ({
  SkeletonChart: ({ height }: { height: number }) => (
    <div data-testid="skeleton-chart" style={{ height }} />
  ),
}));

describe('Chart Components', () => {
  describe('ChartContainer', () => {
    it('should render children when not loading', () => {
      render(
        <ChartContainer height={300}>
          <div data-testid="chart-content">Chart</div>
        </ChartContainer>
      );

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('chart-content')).toBeInTheDocument();
    });

    it('should show skeleton when loading', () => {
      render(
        <ChartContainer height={300} loading>
          <div data-testid="chart-content">Chart</div>
        </ChartContainer>
      );

      expect(screen.getByTestId('skeleton-chart')).toBeInTheDocument();
      expect(screen.queryByTestId('chart-content')).not.toBeInTheDocument();
    });

    it('should pass height to skeleton', () => {
      render(
        <ChartContainer height={400} loading>
          <div>Chart</div>
        </ChartContainer>
      );

      const skeleton = screen.getByTestId('skeleton-chart');
      expect(skeleton).toHaveStyle({ height: '400px' });
    });
  });

  describe('Re-exported components', () => {
    it('should export Line component', () => {
      render(<Line />);
      expect(screen.getByTestId('line')).toBeInTheDocument();
    });

    it('should export Bar component', () => {
      render(<Bar />);
      expect(screen.getByTestId('bar')).toBeInTheDocument();
    });

    it('should export XAxis component', () => {
      render(<XAxis />);
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    });

    it('should export YAxis component', () => {
      render(<YAxis />);
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('should export ResponsiveContainer component', () => {
      render(<ResponsiveContainer><div>content</div></ResponsiveContainer>);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });
});
