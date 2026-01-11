import { create } from 'zustand';
import { returnsAPI } from '@/lib/api';
import { getAuth } from '@/lib/auth';

// Types
export interface ReturnItem {
  id: string;
  productName: string;
  variantInfo: string;
  sku: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Return {
  id: string;
  returnNo: string;
  createdAt: string;
  status: 'PENDING' | 'REJECTED' | 'COMPLETED';
  reason: string;
  notes: string;
  subtotal: number;
  refundAmount: number;
  refundMethod: string;
  approvedBy: string | null;
  approvedAt: string | null;
  transaction: {
    transactionNo: string;
    customerName: string | null;
    customerPhone: string | null;
    paymentMethod: string;
    total: number;
    createdAt: string;
  };
  cabang: {
    id: string;
    name: string;
  };
  processedBy: {
    id: string;
    name: string;
    role: string;
  };
  items: ReturnItem[];
}

export interface Stats {
  pending: number;
  rejected: number;
  completed: number;
  total: number;
  totalRefundAmount: number;
}

interface ReturnsState {
  // Data
  returns: Return[];
  stats: Stats | null;
  loading: boolean;
  processing: boolean;
  
  // Modal state
  selectedReturn: Return | null;
  showDetailModal: boolean;
  showApproveModal: boolean;
  showRejectModal: boolean;
  actionNotes: string;
  
  // Actions - Setters
  setReturns: (returns: Return[]) => void;
  setStats: (stats: Stats | null) => void;
  setLoading: (loading: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setSelectedReturn: (ret: Return | null) => void;
  setShowDetailModal: (show: boolean) => void;
  setShowApproveModal: (show: boolean) => void;
  setShowRejectModal: (show: boolean) => void;
  setActionNotes: (notes: string) => void;
  
  // Actions - Fetch
  fetchReturns: (filters: { status?: string; search?: string; startDate?: string; endDate?: string }) => Promise<void>;
  fetchStats: () => Promise<void>;
  
  // Actions - Business logic
  handleApprove: () => Promise<{ success: boolean; message: string }>;
  handleReject: () => Promise<{ success: boolean; message: string }>;
  
  // Actions - Modal helpers
  openDetailModal: (ret: Return) => void;
  closeDetailModal: () => void;
  openApproveModal: () => void;
  closeApproveModal: () => void;
  openRejectModal: () => void;
  closeRejectModal: () => void;
}

export const useReturnsStore = create<ReturnsState>()((set, get) => ({
  // Initial data
  returns: [],
  stats: null,
  loading: true,
  processing: false,
  
  // Initial modal state
  selectedReturn: null,
  showDetailModal: false,
  showApproveModal: false,
  showRejectModal: false,
  actionNotes: '',
  
  // Setters
  setReturns: (returns) => set({ returns }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setProcessing: (processing) => set({ processing }),
  setSelectedReturn: (ret) => set({ selectedReturn: ret }),
  setShowDetailModal: (show) => set({ showDetailModal: show }),
  setShowApproveModal: (show) => set({ showApproveModal: show }),
  setShowRejectModal: (show) => set({ showRejectModal: show }),
  setActionNotes: (notes) => set({ actionNotes: notes }),
  
  // Fetch actions
  fetchReturns: async (filters) => {
    try {
      set({ loading: true });
      const params: any = {};
      if (filters.status && filters.status !== 'ALL') params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      
      const response = await returnsAPI.getReturns(params);
      set({ returns: response.data.returns });
    } catch (error) {
      console.error('Failed to fetch returns:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  fetchStats: async () => {
    try {
      const response = await returnsAPI.getStats();
      set({ stats: response.data });
    } catch (error) {
      // Stats fetch failed - UI will handle gracefully
    }
  },
  
  // Business logic
  handleApprove: async () => {
    const { selectedReturn, actionNotes } = get();
    if (!selectedReturn) return { success: false, message: 'No return selected' };
    
    const { user } = getAuth();
    if (!user) {
      return { success: false, message: 'User tidak terautentikasi' };
    }
    
    try {
      set({ processing: true });
      await returnsAPI.approveReturn(selectedReturn.id, {
        approvedBy: user.id,
        notes: actionNotes
      });
      
      set({ 
        showApproveModal: false, 
        showDetailModal: false, 
        actionNotes: '' 
      });
      
      return { success: true, message: 'Return berhasil disetujui!' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Gagal menyetujui return' 
      };
    } finally {
      set({ processing: false });
    }
  },
  
  handleReject: async () => {
    const { selectedReturn, actionNotes } = get();
    if (!selectedReturn) return { success: false, message: 'No return selected' };
    
    const { user } = getAuth();
    if (!user) {
      return { success: false, message: 'User tidak terautentikasi' };
    }
    
    try {
      set({ processing: true });
      await returnsAPI.rejectReturn(selectedReturn.id, {
        rejectedBy: user.id,
        rejectionNotes: actionNotes
      });
      
      set({ 
        showRejectModal: false, 
        showDetailModal: false, 
        actionNotes: '' 
      });
      
      return { success: true, message: 'Return berhasil ditolak' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Gagal menolak return' 
      };
    } finally {
      set({ processing: false });
    }
  },
  
  // Modal helpers
  openDetailModal: (ret) => set({ selectedReturn: ret, showDetailModal: true }),
  closeDetailModal: () => set({ showDetailModal: false, selectedReturn: null }),
  openApproveModal: () => set({ showApproveModal: true }),
  closeApproveModal: () => set({ showApproveModal: false, actionNotes: '' }),
  openRejectModal: () => set({ showRejectModal: true }),
  closeRejectModal: () => set({ showRejectModal: false, actionNotes: '' }),
}));
