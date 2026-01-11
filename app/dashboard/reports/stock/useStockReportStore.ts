'use client';

import { create } from 'zustand';
import { productsAPI, cabangAPI, stockAPI } from '@/lib/api';

// ============ Types ============
export interface LowStockItem {
  id: string;
  productVariant: {
    id: string;
    sku: string;
    variantValue: string;
    product: {
      id: string;
      name: string;
    };
    stocks: Array<{
      quantity: number;
      cabangId: string;
    }>;
  };
  cabang: {
    id: string;
    name: string;
  };
  minStock: number;
}

export interface StockAdjustment {
  id: string;
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  notes: string | null;
  createdAt: string;
  productVariant: {
    id: string;
    sku: string;
    variantValue: string;
    product: {
      id: string;
      name: string;
    };
  };
  cabang: {
    id: string;
    name: string;
  };
  adjustedBy: {
    id: string;
    name: string;
  };
}

export interface StockSummary {
  totalProducts: number;
  totalVariants: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalValue: number;
}

export type ActiveTab = 'overview' | 'lowstock' | 'movement';

// ============ State Interface ============
interface StockReportState {
  // Data
  loading: boolean;
  cabangs: any[];
  products: any[];
  lowStockItems: LowStockItem[];
  adjustments: StockAdjustment[];
  
  // Filters
  selectedCabang: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  showCustomDate: boolean;
  reasonFilter: string;
  
  // UI
  activeTab: ActiveTab;
  
  // Computed
  summary: StockSummary;
  adjustmentsByReason: Record<string, { count: number; qtyIn: number; qtyOut: number }>;
  
  // Actions
  setSelectedCabang: (cabang: string) => void;
  setDateRange: (range: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setShowCustomDate: (show: boolean) => void;
  setReasonFilter: (reason: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  handleDateRangeChange: (value: string) => void;
  fetchInitialData: () => Promise<void>;
  fetchReportData: () => Promise<void>;
}

// ============ Helper Functions ============
const computeSummary = (
  products: any[],
  selectedCabang: string,
  lowStockItems: LowStockItem[]
): StockSummary => {
  let totalStock = 0;
  let totalValue = 0;
  let outOfStockCount = 0;
  const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);

  products.forEach(product => {
    product.variants?.forEach((variant: any) => {
      let variantStock = 0;
      variant.stocks?.forEach((stock: any) => {
        if (!selectedCabang || stock.cabangId === selectedCabang) {
          variantStock += stock.quantity;
        }
      });
      totalStock += variantStock;
      totalValue += variantStock * (variant.price || 0);
      
      if (variantStock === 0) outOfStockCount++;
    });
  });

  return {
    totalProducts: products.length,
    totalVariants,
    totalStock,
    lowStockCount: lowStockItems.length,
    outOfStockCount,
    totalValue
  };
};

const computeAdjustmentsByReason = (
  adjustments: StockAdjustment[]
): Record<string, { count: number; qtyIn: number; qtyOut: number }> => {
  const grouped: Record<string, { count: number; qtyIn: number; qtyOut: number }> = {};
  
  adjustments.forEach(adj => {
    if (!grouped[adj.reason]) {
      grouped[adj.reason] = { count: 0, qtyIn: 0, qtyOut: 0 };
    }
    grouped[adj.reason].count++;
    if (adj.type === 'add') {
      grouped[adj.reason].qtyIn += adj.quantity;
    } else {
      grouped[adj.reason].qtyOut += adj.quantity;
    }
  });
  
  return grouped;
};

// ============ Store ============
export const useStockReportStore = create<StockReportState>((set, get) => ({
  // Data
  loading: true,
  cabangs: [],
  products: [],
  lowStockItems: [],
  adjustments: [],
  
  // Filters
  selectedCabang: '',
  dateRange: '7',
  startDate: '',
  endDate: '',
  showCustomDate: false,
  reasonFilter: '',
  
  // UI
  activeTab: 'overview',
  
  // Computed (initial values)
  summary: {
    totalProducts: 0,
    totalVariants: 0,
    totalStock: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalValue: 0
  },
  adjustmentsByReason: {},
  
  // Actions
  setSelectedCabang: (cabang) => set({ selectedCabang: cabang }),
  setDateRange: (range) => set({ dateRange: range }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setShowCustomDate: (show) => set({ showCustomDate: show }),
  setReasonFilter: (reason) => set({ reasonFilter: reason }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  handleDateRangeChange: (value) => {
    if (value === 'custom') {
      set({ showCustomDate: true });
    } else {
      set({ showCustomDate: false, dateRange: value });
    }
  },
  
  fetchInitialData: async () => {
    try {
      const [cabangRes, productsRes] = await Promise.all([
        cabangAPI.getCabangs(),
        productsAPI.getProducts({ isActive: true })
      ]);
      
      const products = productsRes.data;
      const cabangs = cabangRes.data;
      const { selectedCabang, lowStockItems } = get();
      
      set({ 
        cabangs,
        products,
        summary: computeSummary(products, selectedCabang, lowStockItems)
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  },
  
  fetchReportData: async () => {
    const { selectedCabang, reasonFilter, showCustomDate, startDate, endDate, dateRange, products } = get();
    
    set({ loading: true });
    try {
      // Calculate date params
      const params: any = {};
      if (selectedCabang) params.cabangId = selectedCabang;
      if (reasonFilter) params.reason = reasonFilter;
      
      if (showCustomDate && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      } else {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - parseInt(dateRange));
        params.startDate = start.toISOString().split('T')[0];
        params.endDate = end.toISOString().split('T')[0];
      }

      const [lowStockRes, adjustmentsRes] = await Promise.all([
        stockAPI.getLowStockItems(selectedCabang || undefined),
        stockAPI.getAdjustments({ ...params, limit: 100 })
      ]);

      const lowStockItems = lowStockRes.data.data || [];
      const adjustments = adjustmentsRes.data.data || [];
      
      set({ 
        lowStockItems,
        adjustments,
        summary: computeSummary(products, selectedCabang, lowStockItems),
        adjustmentsByReason: computeAdjustmentsByReason(adjustments)
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      set({ loading: false });
    }
  }
}));
