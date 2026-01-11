'use client';

import { create } from 'zustand';
import { backupAPI } from '@/lib/api';

// ============ Types ============
interface LastBackup {
  timestamp: string;
  size: number;
  filename?: string;
}

// ============ State Interface ============
interface BackupState {
  // Data
  autoBackupEnabled: boolean;
  lastBackup: LastBackup | null;
  loading: boolean;
  message: string;
  
  // Actions
  loadBackupStatus: () => Promise<void>;
  loadLastBackup: () => Promise<void>;
  handleManualBackup: () => Promise<void>;
  handleToggleAutoBackup: () => Promise<void>;
  handleResetSettings: () => Promise<void>;
  handleExportTransactions: () => Promise<void>;
  handleExportProducts: () => Promise<void>;
  handleExportReport: () => Promise<void>;
  clearMessage: () => void;
}

// ============ Store ============
export const useBackupStore = create<BackupState>((set, get) => ({
  // Data
  autoBackupEnabled: false,
  lastBackup: null,
  loading: false,
  message: '',
  
  // Actions
  clearMessage: () => set({ message: '' }),
  
  loadBackupStatus: async () => {
    try {
      const response = await backupAPI.getAutoBackupStatus();
      set({ autoBackupEnabled: response.data.enabled });
    } catch (error) {
      console.error('Error loading backup status:', error);
    }
  },
  
  loadLastBackup: async () => {
    try {
      const response = await backupAPI.getLastBackup();
      set({ lastBackup: response.data.lastBackup });
    } catch (error) {
      console.error('Error loading last backup:', error);
    }
  },
  
  handleManualBackup: async () => {
    set({ loading: true, message: '' });
    try {
      const response = await backupAPI.createBackup();
      set({ message: `[OK] Backup berhasil: ${response.data.filename}` });
      await get().loadLastBackup();
    } catch (error: any) {
      set({ message: `[ERROR] ${error.response?.data?.error || error.message}` });
    } finally {
      set({ loading: false });
    }
  },
  
  handleToggleAutoBackup: async () => {
    const { autoBackupEnabled } = get();
    try {
      const newValue = !autoBackupEnabled;
      await backupAPI.toggleAutoBackup(newValue);
      set({ 
        autoBackupEnabled: newValue,
        message: `[OK] Auto backup ${newValue ? 'diaktifkan' : 'dinonaktifkan'}`
      });
    } catch (error: any) {
      set({ message: `[ERROR] ${error.response?.data?.error || error.message}` });
    }
  },
  
  handleResetSettings: async () => {
    if (!confirm('Yakin ingin reset semua settings ke default? Aksi ini tidak bisa dibatalkan!')) {
      return;
    }
    
    set({ loading: true });
    try {
      await backupAPI.resetSettings();
      set({ message: '[OK] Settings berhasil direset ke default' });
    } catch (error: any) {
      set({ message: `[ERROR] ${error.response?.data?.error || error.message}` });
    } finally {
      set({ loading: false });
    }
  },
  
  handleExportTransactions: async () => {
    set({ loading: true, message: '' });
    try {
      await backupAPI.exportTransactions();
      set({ message: '[OK] Export transaksi berhasil didownload' });
    } catch (error: any) {
      set({ message: `[ERROR] Export gagal: ${error.response?.data?.error || error.message}` });
    } finally {
      set({ loading: false });
    }
  },
  
  handleExportProducts: async () => {
    set({ loading: true, message: '' });
    try {
      await backupAPI.exportProducts();
      set({ message: '[OK] Export produk berhasil didownload' });
    } catch (error: any) {
      set({ message: `[ERROR] Export gagal: ${error.response?.data?.error || error.message}` });
    } finally {
      set({ loading: false });
    }
  },
  
  handleExportReport: async () => {
    set({ loading: true, message: '' });
    try {
      await backupAPI.exportReport();
      set({ message: '[OK] Export laporan berhasil didownload' });
    } catch (error: any) {
      set({ message: `[ERROR] Export gagal: ${error.response?.data?.error || error.message}` });
    } finally {
      set({ loading: false });
    }
  },
}));
