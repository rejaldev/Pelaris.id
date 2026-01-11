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
      set({ channels: res.data });
    } catch (error) {
      console.error('Error fetching channels:', error);
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
      set({ transactions: res.data });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
