import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReturnsStore } from './useReturnsStore';

// Mock API
vi.mock('@/lib/api', () => ({
  returnsAPI: {
    getReturns: vi.fn().mockResolvedValue({ data: [] }),
    getStats: vi.fn().mockResolvedValue({ data: { pending: 0, rejected: 0, completed: 0, total: 0, totalRefundAmount: 0 } }),
    approveReturn: vi.fn().mockResolvedValue({ data: {} }),
    rejectReturn: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn().mockReturnValue({ user: { role: 'OWNER' } }),
}));

describe('useReturnsStore', () => {
  beforeEach(() => {
    useReturnsStore.setState({
      returns: [],
      stats: null,
      loading: true,
      processing: false,
      selectedReturn: null,
      showDetailModal: false,
      showApproveModal: false,
      showRejectModal: false,
      actionNotes: '',
    });
  });

  it('should initialize with default state', () => {
    const state = useReturnsStore.getState();
    expect(state.returns).toEqual([]);
    expect(state.stats).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.processing).toBe(false);
    expect(state.selectedReturn).toBeNull();
  });

  it('should set loading state', () => {
    useReturnsStore.getState().setLoading(false);
    expect(useReturnsStore.getState().loading).toBe(false);
  });

  it('should set processing state', () => {
    useReturnsStore.getState().setProcessing(true);
    expect(useReturnsStore.getState().processing).toBe(true);
  });

  it('should set action notes', () => {
    useReturnsStore.getState().setActionNotes('Test notes');
    expect(useReturnsStore.getState().actionNotes).toBe('Test notes');
  });

  it('should open and close detail modal', () => {
    const mockReturn = {
      id: 'r1',
      returnNo: 'RTN-001',
      status: 'PENDING' as const,
      reason: 'Defect',
      notes: '',
      createdAt: '2024-01-01',
      subtotal: 10000,
      refundAmount: 10000,
      refundMethod: 'CASH',
      approvedBy: null,
      approvedAt: null,
      transaction: { transactionNo: 'TRX-001', customerName: 'John', customerPhone: null, paymentMethod: 'CASH', total: 10000, createdAt: '2024-01-01' },
      cabang: { id: 'c1', name: 'Branch 1' },
      processedBy: { id: 'u1', name: 'User 1', role: 'KASIR' },
      items: [],
    };

    useReturnsStore.getState().openDetailModal(mockReturn);
    expect(useReturnsStore.getState().showDetailModal).toBe(true);
    expect(useReturnsStore.getState().selectedReturn?.id).toBe('r1');

    useReturnsStore.getState().closeDetailModal();
    expect(useReturnsStore.getState().showDetailModal).toBe(false);
    expect(useReturnsStore.getState().selectedReturn).toBeNull();
  });

  it('should open and close approve modal', () => {
    useReturnsStore.getState().openApproveModal();
    expect(useReturnsStore.getState().showApproveModal).toBe(true);
    expect(useReturnsStore.getState().actionNotes).toBe('');

    useReturnsStore.getState().closeApproveModal();
    expect(useReturnsStore.getState().showApproveModal).toBe(false);
  });

  it('should open and close reject modal', () => {
    useReturnsStore.getState().openRejectModal();
    expect(useReturnsStore.getState().showRejectModal).toBe(true);
    expect(useReturnsStore.getState().actionNotes).toBe('');

    useReturnsStore.getState().closeRejectModal();
    expect(useReturnsStore.getState().showRejectModal).toBe(false);
  });

  it('should set returns array', () => {
    const mockReturns = [
      { id: 'r1', returnNo: 'RTN-001' },
      { id: 'r2', returnNo: 'RTN-002' },
    ] as any;

    useReturnsStore.getState().setReturns(mockReturns);
    expect(useReturnsStore.getState().returns).toHaveLength(2);
  });

  it('should set stats', () => {
    const mockStats = {
      pending: 5,
      rejected: 2,
      completed: 10,
      total: 17,
      totalRefundAmount: 500000,
    };

    useReturnsStore.getState().setStats(mockStats);
    expect(useReturnsStore.getState().stats?.total).toBe(17);
    expect(useReturnsStore.getState().stats?.totalRefundAmount).toBe(500000);
  });
});
