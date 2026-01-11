import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTransactionsStore } from './useTransactionsStore';

// Mock API
vi.mock('@/lib/api', () => ({
  transactionsAPI: {
    getTransactions: vi.fn().mockResolvedValue({ 
      data: [
        {
          id: 'tx1',
          transactionNo: 'TRX-001',
          status: 'COMPLETED',
          cabang: { id: 'c1', name: 'Cabang 1' },
          kasir: { id: 'u1', name: 'Kasir 1' },
          total: 100000,
          shippingCost: 0,
          items: [],
          createdAt: '2024-01-01T00:00:00Z'
        }
      ]
    }),
  },
  channelsAPI: {
    getChannels: vi.fn().mockResolvedValue({ 
      data: [
        { id: 'ch1', code: 'POS', name: 'Point of Sale', type: 'OFFLINE', color: null }
      ]
    }),
  },
}));

// Mock filter store
vi.mock('@/stores/useFilterStore', () => ({
  useFilterStore: {
    getState: vi.fn().mockReturnValue({
      search: '',
      startDate: null,
      endDate: null,
      selectedChannel: '',
      selectedStatus: '',
    }),
  },
}));

describe('useTransactionsStore', () => {
  beforeEach(() => {
    useTransactionsStore.setState({
      transactions: [],
      channels: [],
      loading: true,
      selectedTx: null,
    });
  });

  it('should initialize with default state', () => {
    const state = useTransactionsStore.getState();
    expect(state.transactions).toEqual([]);
    expect(state.channels).toEqual([]);
    expect(state.loading).toBe(true);
    expect(state.selectedTx).toBeNull();
  });

  it('should set selected transaction', () => {
    const tx = {
      id: 'tx1',
      transactionNo: 'TRX-001',
      status: 'COMPLETED',
      cabang: { id: 'c1', name: 'Cabang 1' },
      total: 100000,
      shippingCost: 0,
      items: [],
      createdAt: '2024-01-01T00:00:00Z'
    };
    
    useTransactionsStore.getState().setSelectedTx(tx);
    expect(useTransactionsStore.getState().selectedTx).toEqual(tx);
  });

  it('should clear selected transaction', () => {
    useTransactionsStore.setState({ selectedTx: { id: 'tx1' } as any });
    useTransactionsStore.getState().setSelectedTx(null);
    expect(useTransactionsStore.getState().selectedTx).toBeNull();
  });

  it('should fetch channels', async () => {
    await useTransactionsStore.getState().fetchChannels();
    const state = useTransactionsStore.getState();
    expect(state.channels).toHaveLength(1);
    expect(state.channels[0].code).toBe('POS');
  });

  it('should fetch transactions', async () => {
    await useTransactionsStore.getState().fetchTransactions();
    const state = useTransactionsStore.getState();
    expect(state.transactions).toHaveLength(1);
    expect(state.transactions[0].transactionNo).toBe('TRX-001');
    expect(state.loading).toBe(false);
  });

  it('should set loading false after fetch completes', async () => {
    useTransactionsStore.setState({ loading: true });
    await useTransactionsStore.getState().fetchTransactions();
    expect(useTransactionsStore.getState().loading).toBe(false);
  });
});
