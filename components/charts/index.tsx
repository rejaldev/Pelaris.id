'use client';

import dynamic from 'next/dynamic';
import { SkeletonChart } from '@/components/ui/Skeleton';

// Loading component for charts
const ChartLoading = ({ height = 300 }: { height?: number }) => (
  <SkeletonChart height={height} />
);

// Dynamic imports for Recharts components - only load when needed
// This reduces initial bundle size significantly since Recharts is ~400KB

export const DynamicLineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { 
    loading: () => <ChartLoading />,
    ssr: false 
  }
);

export const DynamicBarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { 
    loading: () => <ChartLoading />,
    ssr: false 
  }
);

export const DynamicAreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { 
    loading: () => <ChartLoading />,
    ssr: false 
  }
);

export const DynamicPieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart),
  { 
    loading: () => <ChartLoading />,
    ssr: false 
  }
);

// Re-export other recharts components that don't need dynamic loading
// These are lightweight and can be loaded statically
export { 
  Line, 
  Bar, 
  Area,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from 'recharts';

// Import for use in ChartContainer
import { ResponsiveContainer as RC } from 'recharts';

// Wrapper component for ResponsiveContainer with loading state
export function ChartContainer({ 
  children, 
  height = 300,
  width = '100%',
  loading = false,
}: { 
  children: React.ReactNode;
  height?: number | `${number}%`;
  width?: number | `${number}%`;
  loading?: boolean;
}) {
  if (loading) {
    return <ChartLoading height={typeof height === 'number' ? height : 300} />;
  }

  return (
    <RC width={width} height={height}>
      {children}
    </RC>
  );
}
