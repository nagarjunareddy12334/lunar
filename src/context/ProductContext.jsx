import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchProductsFromDb,
  addProduct as dbAddProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  getLocalProducts
} from '../utils/productStore';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => getLocalProducts());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProductsFromDb();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addProduct = async (productData) => {
    const { product, error } = await dbAddProduct(productData);
    if (!error && product) {
      setProducts((prev) => [product, ...prev.filter((p) => p.id !== product.id)]);
    } else {
      // Refresh to ensure in sync
      await refreshProducts();
    }
    return { product, error };
  };

  const updateProduct = async (id, updates) => {
    const { product, error } = await dbUpdateProduct(id, updates);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (!error) {
      await refreshProducts();
    }
    return { product, error };
  };

  const deleteProduct = async (id) => {
    const { error } = await dbDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (!error) {
      await refreshProducts();
    }
    return { error };
  };

  const getProductById = (id) => {
    return products.find((p) => p.id === id) || null;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
