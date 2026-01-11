import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBackupStore } from './useBackupStore';

// Mock API
vi.mock('@/lib/api', () => ({
  backupAPI: {
    getAutoBackupStatus: vi.fn().mockResolvedValue({ data: { enabled: true } }),
    getLastBackup: vi.fn().mockResolvedValue({ 
      data: { 
        lastBackup: { 
          timestamp: '2024-01-01T00:00:00Z', 
          size: 1024,
          filename: 'backup_20240101.zip' 
        } 
      } 
    }),
    createBackup: vi.fn().mockResolvedValue({ data: { filename: 'backup_new.zip' } }),
    toggleAutoBackup: vi.fn().mockResolvedValue({}),
    resetSettings: vi.fn().mockResolvedValue({}),
  },
}));

// Mock window.confirm
global.confirm = vi.fn();

describe('useBackupStore', () => {
  beforeEach(() => {
    useBackupStore.setState({
      autoBackupEnabled: false,
      lastBackup: null,
      loading: false,
      message: '',
    });
    vi.mocked(confirm).mockReset();
  });

  it('should initialize with default state', () => {
    const state = useBackupStore.getState();
    expect(state.autoBackupEnabled).toBe(false);
    expect(state.lastBackup).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.message).toBe('');
  });

  it('should clear message', () => {
    useBackupStore.setState({ message: 'Test message' });
    useBackupStore.getState().clearMessage();
    expect(useBackupStore.getState().message).toBe('');
  });

  it('should load backup status', async () => {
    await useBackupStore.getState().loadBackupStatus();
    expect(useBackupStore.getState().autoBackupEnabled).toBe(true);
  });

  it('should load last backup', async () => {
    await useBackupStore.getState().loadLastBackup();
    const state = useBackupStore.getState();
    expect(state.lastBackup).not.toBeNull();
    expect(state.lastBackup?.filename).toBe('backup_20240101.zip');
    expect(state.lastBackup?.size).toBe(1024);
  });

  it('should handle manual backup', async () => {
    await useBackupStore.getState().handleManualBackup();
    const state = useBackupStore.getState();
    expect(state.message).toContain('[OK] Backup berhasil');
    expect(state.loading).toBe(false);
  });

  it('should toggle auto backup on', async () => {
    useBackupStore.setState({ autoBackupEnabled: false });
    await useBackupStore.getState().handleToggleAutoBackup();
    const state = useBackupStore.getState();
    expect(state.autoBackupEnabled).toBe(true);
    expect(state.message).toContain('diaktifkan');
  });

  it('should toggle auto backup off', async () => {
    useBackupStore.setState({ autoBackupEnabled: true });
    await useBackupStore.getState().handleToggleAutoBackup();
    const state = useBackupStore.getState();
    expect(state.autoBackupEnabled).toBe(false);
    expect(state.message).toContain('dinonaktifkan');
  });

  it('should handle reset settings when confirmed', async () => {
    vi.mocked(confirm).mockReturnValue(true);
    await useBackupStore.getState().handleResetSettings();
    const state = useBackupStore.getState();
    expect(state.message).toContain('[OK] Settings berhasil direset');
    expect(state.loading).toBe(false);
  });

  it('should not reset settings when cancelled', async () => {
    vi.mocked(confirm).mockReturnValue(false);
    await useBackupStore.getState().handleResetSettings();
    const state = useBackupStore.getState();
    expect(state.message).toBe('');
  });

  it('should set loading true during manual backup', async () => {
    // Use a delayed promise to check loading state
    const { backupAPI } = await import('@/lib/api');
    vi.mocked(backupAPI.createBackup).mockImplementation(async () => {
      expect(useBackupStore.getState().loading).toBe(true);
      return { data: { filename: 'test.zip' } } as any;
    });
    
    await useBackupStore.getState().handleManualBackup();
    expect(useBackupStore.getState().loading).toBe(false);
  });
});
