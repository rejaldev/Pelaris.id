/**
 * Custom hook untuk POS Cart operations
 * Wrapper around Zustand store untuk kemudahan migrasi
 */

import { useCallback, useMemo } from 'react';
import { useCartStore, useCheckoutStore } from '@/stores';
import { useToast } from '@/components/ui/Toast';

interface Product {
  id: string;
  name: string;
  productType: 'SINGLE' | 'VARIANT';
  variants?: ProductVariant[];
}

interface ProductVariant {
  id: string;
  sku: string;
  variantValue: string;
  stocks?: Array<{ cabangId: string; quantity: number; price: number }>;
}

export function usePOSCart(cabangId: string) {
  const toast = useToast();
  
  // Cart store
  const cart = useCartStore((s) => s.cart);
  const heldTransactions = useCartStore((s) => s.heldTransactions);
  const addToCartStore = useCartStore((s) => s.addToCart);
  const updateQuantityStore = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const holdTransaction = useCartStore((s) => s.holdTransaction);
  const retrieveHeld = useCartStore((s) => s.retrieveHeld);
  const deleteHeld = useCartStore((s) => s.deleteHeld);
  const updateItemStock = useCartStore((s) => s.updateItemStock);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotal = useCartStore((s) => s.getTotal);
  const getDiscountAmount = useCartStore((s) => s.getDiscountAmount);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const getCartItemByVariantId = useCartStore((s) => s.getCartItemByVariantId);
  
  // Checkout store
  const checkoutState = useCheckoutStore();
  const {
    customerName,
    customerPhone,
    paymentMethod,
    cashReceived,
    bankName,
    referenceNo,
    discount,
    discountType,
    showCustomerInfo,
    showDiscount,
    processing,
    lastTransaction,
    lastCashReceived,
    showSuccess,
  } = checkoutState;

  // Add to cart with toast feedback
  const addToCart = useCallback(
    (product: Product, variant: ProductVariant) => {
      const stock = variant.stocks?.find((s) => s.cabangId === cabangId);
      
      if (!stock || stock.quantity <= 0) {
        toast.warning('Stok tidak tersedia!');
        return false;
      }

      // Check if already in cart and exceeds stock
      const existingItem = getCartItemByVariantId(variant.id);
      if (existingItem && existingItem.quantity >= stock.quantity) {
        toast.warning('Stok tidak mencukupi!');
        return false;
      }

      // Hide default variant info for SINGLE products
      let variantInfo = variant.variantValue;
      const defaultVariants = ['default', 'standar', 'standard', 'default:', '-'];
      if (
        product.productType === 'SINGLE' ||
        defaultVariants.some((v) => variantInfo.toLowerCase().includes(v))
      ) {
        variantInfo = '';
      }

      const success = addToCartStore({
        productVariantId: variant.id,
        productName: product.name,
        variantInfo,
        sku: variant.sku,
        price: stock.price || 0,
        availableStock: stock.quantity,
      });

      if (!success) {
        toast.warning('Stok tidak mencukupi!');
      }
      
      return success;
    },
    [cabangId, addToCartStore, getCartItemByVariantId, toast]
  );

  // Update quantity with toast feedback
  const updateQuantity = useCallback(
    (variantId: string, newQty: number) => {
      if (newQty <= 0) {
        removeFromCart(variantId);
        return true;
      }
      
      const success = updateQuantityStore(variantId, newQty);
      if (!success) {
        toast.warning('Stok tidak mencukupi!');
      }
      return success;
    },
    [updateQuantityStore, removeFromCart, toast]
  );

  // Hold current transaction
  const handleHoldTransaction = useCallback(() => {
    if (cart.length === 0) {
      toast.warning('Keranjang masih kosong!');
      return;
    }

    holdTransaction({
      customerName,
      customerPhone,
      paymentMethod,
      discount,
      discountType,
      bankName,
      referenceNo,
    });

    checkoutState.resetCheckout();
    toast.success('Transaksi berhasil di-hold!');
  }, [
    cart,
    customerName,
    customerPhone,
    paymentMethod,
    discount,
    discountType,
    bankName,
    referenceNo,
    holdTransaction,
    checkoutState,
    toast,
  ]);

  // Retrieve held transaction
  const handleRetrieveHeld = useCallback(
    (heldId: string) => {
      const held = retrieveHeld(heldId);
      if (held) {
        // Also restore checkout state
        checkoutState.setCustomerName(held.customerName);
        checkoutState.setCustomerPhone(held.customerPhone);
        checkoutState.setPaymentMethod(held.paymentMethod);
        checkoutState.setDiscount(held.discount);
        checkoutState.setDiscountType(held.discountType);
        checkoutState.setBankName(held.bankName);
        checkoutState.setReferenceNo(held.referenceNo);
      }
      return held;
    },
    [retrieveHeld, checkoutState]
  );

  // Reset all
  const resetTransaction = useCallback(() => {
    clearCart();
    checkoutState.resetCheckout();
  }, [clearCart, checkoutState]);

  // Computed values
  const subtotal = useMemo(() => getSubtotal(), [cart, getSubtotal]);
  const total = useMemo(
    () => getTotal(discount, discountType),
    [cart, discount, discountType, getTotal]
  );
  const discountAmount = useMemo(
    () => getDiscountAmount(discount, discountType),
    [cart, discount, discountType, getDiscountAmount]
  );
  const itemCount = useMemo(() => getItemCount(), [cart, getItemCount]);

  return {
    // Cart state
    cart,
    heldTransactions,
    
    // Checkout state
    customerName,
    customerPhone,
    paymentMethod,
    cashReceived,
    bankName,
    referenceNo,
    discount,
    discountType,
    showCustomerInfo,
    showDiscount,
    processing,
    lastTransaction,
    lastCashReceived,
    showSuccess,
    
    // Setters
    setCustomerName: checkoutState.setCustomerName,
    setCustomerPhone: checkoutState.setCustomerPhone,
    setPaymentMethod: checkoutState.setPaymentMethod,
    setCashReceived: checkoutState.setCashReceived,
    setBankName: checkoutState.setBankName,
    setReferenceNo: checkoutState.setReferenceNo,
    setDiscount: checkoutState.setDiscount,
    setDiscountType: checkoutState.setDiscountType,
    setShowCustomerInfo: checkoutState.setShowCustomerInfo,
    setShowDiscount: checkoutState.setShowDiscount,
    setProcessing: checkoutState.setProcessing,
    setTransactionSuccess: checkoutState.setTransactionSuccess,
    closeSuccessModal: checkoutState.closeSuccessModal,
    
    // Cart actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    updateItemStock,
    getCartItemByVariantId,
    
    // Hold actions
    handleHoldTransaction,
    handleRetrieveHeld,
    deleteHeld,
    
    // Reset
    resetTransaction,
    
    // Computed
    subtotal,
    total,
    discountAmount,
    itemCount,
  };
}
