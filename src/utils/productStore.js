/**
 * Product Store — localStorage CRUD layer
 * All product operations go through this file.
 * Swap localStorage calls for Supabase SDK calls when migrating.
 */

import { PRODUCTS } from '../data/products.js';

const STORAGE_KEY = 'lunar_admin_products';

/**
 * Get all products — merges hardcoded defaults with any localStorage additions/edits.
 * localStorage stores an object: { added: [...], edited: { id: {...} }, deleted: [id, ...] }
 */
export function getProducts() {
  const store = _getStore();

  // Start with hardcoded products, apply edits and deletions
  let products = PRODUCTS.map((p) => {
    if (store.deleted.includes(p.id)) return null;
    if (store.edited[p.id]) return { ...p, ...store.edited[p.id], _source: 'default' };
    return { ...p, _source: 'default' };
  }).filter(Boolean);

  // Add any products created via admin
  const added = store.added.map((p) => ({ ...p, _source: 'admin' }));

  return [...products, ...added];
}

/**
 * Add a new product
 */
export function addProduct(product) {
  const store = _getStore();
  const id = 'lunar-admin-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  const newProduct = {
    ...product,
    id,
    rating: product.rating || 0,
    reviewsCount: product.reviewsCount || 0,
  };
  store.added.push(newProduct);
  _saveStore(store);
  return newProduct;
}

/**
 * Update an existing product
 */
export function updateProduct(id, updates) {
  const store = _getStore();

  // Check if it's an admin-added product
  const addedIndex = store.added.findIndex((p) => p.id === id);
  if (addedIndex !== -1) {
    store.added[addedIndex] = { ...store.added[addedIndex], ...updates };
  } else {
    // It's a default product — store edits separately
    store.edited[id] = { ...store.edited[id], ...updates, id };
  }

  _saveStore(store);
}

/**
 * Delete a product
 */
export function deleteProduct(id) {
  const store = _getStore();

  // If admin-added, remove from added array
  const addedIndex = store.added.findIndex((p) => p.id === id);
  if (addedIndex !== -1) {
    store.added.splice(addedIndex, 1);
  } else {
    // Default product — mark as deleted
    store.deleted.push(id);
  }

  // Also clean up any edits
  delete store.edited[id];

  _saveStore(store);
}

/**
 * Get a single product by ID
 */
export function getProductById(id) {
  return getProducts().find((p) => p.id === id) || null;
}

// ─── Internal helpers ─────────────────────────────────

function _getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        added: parsed.added || [],
        edited: parsed.edited || {},
        deleted: parsed.deleted || [],
      };
    }
  } catch {
    // Corrupted data — reset
    localStorage.removeItem(STORAGE_KEY);
  }
  return { added: [], edited: {}, deleted: [] };
}

function _saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
