/**
 * Custom hook untuk POS Products operations
 * Wrapper around Zustand store untuk kemudahan migrasi
 */

import { useEffect, useCallback } from 'react';
import { useProductStore } from '@/stores';
import { useProductSocket } from '@/hooks/useProductSocket';
import { useCartStore } from '@/stores';

interface UsePOSProductsOptions {
  userRole?: string;
  userCabangId?: string;
  enabled?: boolean;
}

export function usePOSProducts(options: UsePOSProductsOptions = {}) {
  const { userRole, userCabangId, enabled = true } = options;
  
  // Product store
  const products = useProductStore((s) => s.products);
  const branches = useProductStore((s) => s.branches);
  const categories = useProductStore((s) => s.categories);
  const selectedCabangId = useProductStore((s) => s.selectedCabangId);
  const search = useProductStore((s) => s.search);
  const loading = useProductStore((s) => s.loading);
  const adminWhatsApp = useProductStore((s) => s.adminWhatsApp);
  
  const setSelectedCabangId = useProductStore((s) => s.setSelectedCabangId);
  const setSearch = useProductStore((s) => s.setSearch);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const fetchBranches = useProductStore((s) => s.fetchBranches);
  const fetchCategories = useProductStore((s) => s.fetchCategories);
  const fetchSettings = useProductStore((s) => s.fetchSettings);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const updateStock = useProductStore((s) => s.updateStock);
  const getFilteredProducts = useProductStore((s) => s.getFilteredProducts);
  const getStockForVariant = useProductStore((s) => s.getStockForVariant);

  // Cart store for stock updates
  const updateItemStock = useCartStore((s) => s.updateItemStock);

  // Get effective cabang ID
  const getEffectiveCabangId = useCallback(() => {
    if (userRole === 'KASIR') {
      return userCabangId || '';
    }
    return selectedCabangId || userCabangId || '';
  }, [userRole, userCabangId, selectedCabangId]);

  const effectiveCabangId = getEffectiveCabangId();

  // Initialize branches and select default
  useEffect(() => {
    const initBranches = async () => {
      if (userRole === 'KASIR') return;

      const activeBranches = await fetchBranches();
      
      // Auto-select branch
      const savedCabangId = typeof window !== 'undefined' 
        ? localStorage.getItem('activeCabangId') 
        : null;
        
      if (savedCabangId && activeBranches.some((b) => b.id === savedCabangId)) {
        setSelectedCabangId(savedCabangId);
      } else if (userCabangId) {
        setSelectedCabangId(userCabangId);
      } else if (activeBranches.length > 0) {
        setSelectedCabangId(activeBranches[0].id);
      }
    };

    initBranches();
  }, [userRole, userCabangId, fetchBranches, setSelectedCabangId]);

  // Fetch products when cabang changes
  useEffect(() => {
    if (effectiveCabangId || userRole === 'KASIR') {
      fetchProducts(effectiveCabangId);
      fetchSettings();
      fetchCategories();
    }
  }, [effectiveCabangId, userRole, fetchProducts, fetchSettings, fetchCategories]);

  // WebSocket for real-time updates
  useProductSocket({
    onProductCreated: useCallback(() => {
      fetchProducts(effectiveCabangId);
    }, [fetchProducts, effectiveCabangId]),
    
    onProductUpdated: useCallback(
      (updatedProduct: any) => {
        updateProduct(updatedProduct);
        
        // Update cart items if product was updated
        updatedProduct.variants?.forEach((variant: any) => {
          const stock = variant.stocks?.find(
            (s: any) => s.cabangId === effectiveCabangId
          );
          if (stock) {
            updateItemStock(variant.id, stock.quantity, stock.price);
          }
        });
      },
      [updateProduct, updateItemStock, effectiveCabangId]
    ),
    
    onProductDeleted: useCallback(
      (productId: string) => {
        deleteProduct(productId);
      },
      [deleteProduct]
    ),
    
    onStockUpdated: useCallback(
      (stockData: any) => {
        if (stockData.cabangId !== effectiveCabangId) return;
        
        updateStock(
          stockData.cabangId,
          stockData.productVariantId,
          stockData.quantity,
          stockData.price
        );
        
        // Update cart item stock
        updateItemStock(
          stockData.productVariantId,
          stockData.quantity,
          stockData.price
        );
      },
      [updateStock, updateItemStock, effectiveCabangId]
    ),
    
    onRefreshNeeded: useCallback(() => {
      fetchProducts(effectiveCabangId);
    }, [fetchProducts, effectiveCabangId]),
    
    enabled: enabled && !loading,
  });

  // Get stock info for UI display
  const getStockInfo = useCallback(
    (quantity: number, inCart: number = 0) => {
      const available = quantity - inCart;
      if (available <= 0) {
        return { color: 'text-gray-400', text: 'Habis', available };
      }
      return {
        color: 'text-green-600 dark:text-green-400',
        text: `${available} pcs`,
        available,
      };
    },
    []
  );

  // Format variant display
  const formatVariantDisplay = useCallback(
    (variantName: string, variantValue: string) => {
      const cleanValue = variantValue.replace(/\s*\|\s*/g, ' ').trim();
      const lowerValue = cleanValue.toLowerCase();

      if (/^\d+$/.test(cleanValue)) {
        return cleanValue;
      }

      if (/^[a-zA-Z]+\s+\d+$/.test(cleanValue)) {
        return cleanValue;
      }

      const nameLower = variantName.toLowerCase();
      if (lowerValue.startsWith(nameLower)) {
        return cleanValue.substring(variantName.length).trim();
      }

      return cleanValue;
    },
    []
  );

  return {
    // State
    products,
    branches,
    categories,
    selectedCabangId,
    search,
    loading,
    adminWhatsApp,
    effectiveCabangId,
    
    // Setters
    setSelectedCabangId,
    setSearch,
    
    // Actions
    fetchProducts: () => fetchProducts(effectiveCabangId),
    fetchCategories,
    
    // Getters
    getFilteredProducts,
    getStockForVariant,
    getStockInfo,
    formatVariantDisplay,
    getEffectiveCabangId,
  };
}
