'use client';

import { create } from 'zustand';
import { transactionsAPI, channelsAPI } from '@/lib/api';
import { useFilterStore } from '@/stores/useFilterStore';

// ============ Types ============
export interface Channel {
  id: string;
  code: string;
  name: string;
  type: string;
  color: string | null;
}

export interface Transaction {
  id: string;
  transactionNo: string;
  status: string;
  cabang: { id: string; name: string };
  kasir?: { id: string; name: string };
  channel?: Channel;
  customerName?: string;
  buyerUsername?: string;
  total: number;
  shippingCost: number;
  externalOrderId?: string;
  paymentMethod?: string;
  items: any[];
  createdAt: string;
}

// ============ State Interface ============
interface TransactionsState {
  // Data
  transactions: Transaction[];
  channels: Channel[];
  loading: boolean;
  selectedTx: Transaction | null;
  
  // Actions
  setSelectedTx: (tx: Transaction | null) => void;
  fetchChannels: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

// ============ Store ============
export const useTransactionsStore = create<TransactionsState>((set) => ({
  // Data
  transactions: [],
  channels: [],
  loading: true,
  selectedTx: null,
  
  // Actions
  setSelectedTx: (tx) => set({ selectedTx: tx }),
  
  fetchChannels: async () => {
    try {
      const res = await channelsAPI.getChannels();
      // Handle both direct array and paginated response
      const channelsData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      set({ channels: channelsData });
    } catch (error) {
      console.error('Error fetching channels:', error);
      set({ channels: [] });
    }
  },
  
  fetchTransactions: async () => {
    const { search, startDate, endDate, selectedChannel, selectedStatus } = useFilterStore.getState();
    
    set({ loading: true });
    try {
      const res = await transactionsAPI.getTransactions({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        channelId: selectedChannel || undefined,
        status: selectedStatus || undefined,
        search: search || undefined,
      });
      // Handle paginated response format from backend
      const transactionsData = res.data?.data || res.data || [];
      set({ transactions: Array.isArray(transactionsData) ? transactionsData : [] });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ transactions: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
