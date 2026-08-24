import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { VALID_PROMO_CODES, FREE_SHIPPING_THRESHOLD } from '../utils/formatters';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('lunar_cart_items', []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useLocalStorage('lunar_cart_promo', null);
  const { addToast } = useToast();

  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'ONE SIZE';
    const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Standard';
    const colorImage = product.colors?.find((c) => c.name === color)?.image || product.images[0];
    const itemKey = `${product.id}-${size}-${color}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            itemKey,
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: colorImage,
            size,
            color,
            quantity,
            stock: product.stock,
            badge: product.badge,
          },
        ];
      }
    });

    addToast(`Added "${product.name}" (${size}) to Bag`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (itemKey) => {
    setItems((prev) => prev.filter((item) => item.itemKey !== itemKey));
    addToast('Item removed from Bag', 'info');
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.itemKey === itemKey) {
          const clamped = item.stock ? Math.min(newQuantity, item.stock) : newQuantity;
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const applyPromoCode = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (VALID_PROMO_CODES[cleanCode]) {
      setAppliedPromo({
        code: cleanCode,
        discountPercent: VALID_PROMO_CODES[cleanCode].discountPercent,
        label: VALID_PROMO_CODES[cleanCode].label,
      });
      addToast(`Promo code "${cleanCode}" applied: ${VALID_PROMO_CODES[cleanCode].discountPercent}% off!`, 'success');
      return { success: true };
    } else {
      addToast('Invalid promo code. Try "LUNAR15" or "ECLIPSE20"', 'error');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    addToast('Promo code removed', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  // Calculations
  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return (subtotal * appliedPromo.discountPercent) / 100;
  }, [subtotal, appliedPromo]);

  const discountedSubtotal = subtotal - discountAmount;

  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    return discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 25;
  }, [discountedSubtotal, items.length]);

  const freeShippingProgress = useMemo(() => {
    if (discountedSubtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min(100, Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [discountedSubtotal]);

  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);

  const estimatedTax = useMemo(() => {
    return Math.round(discountedSubtotal * 0.08 * 100) / 100;
  }, [discountedSubtotal]);

  const grandTotal = useMemo(() => {
    if (items.length === 0) return 0;
    return discountedSubtotal + shipping + estimatedTax;
  }, [discountedSubtotal, shipping, estimatedTax, items.length]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        totalItemCount,
        subtotal,
        discountAmount,
        discountedSubtotal,
        shipping,
        freeShippingProgress,
        amountUntilFreeShipping,
        estimatedTax,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
