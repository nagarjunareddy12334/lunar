/**
 * Product Store — Supabase CRUD layer with local storage & fallback sync
 * Handles all database operations for LUNAR products.
 */
import { supabase } from './supabase';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

const STORAGE_KEY = 'lunar_admin_products';

/**
 * Upload an image file directly to Supabase Storage ('product-images' bucket).
 * Falls back to Base64 data URL if storage bucket fails or is offline.
 */
export async function uploadProductImage(file) {
  if (!file) {
    return { url: null, error: new Error('No file provided') };
  }

  // 1. Try uploading to Supabase Storage
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    const filePath = `products/${Date.now()}_${cleanFileName}.${fileExt}`;

    // Bucket name to use: 'product-images' (or fallback to 'products')
    let bucketName = 'product-images';
    let { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    // If 'product-images' bucket fails, try 'products' bucket
    if (uploadError && uploadError.message?.toLowerCase().includes('bucket not found')) {
      bucketName = 'products';
      const retry = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });
      uploadData = retry.data;
      uploadError = retry.error;
    }

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        return {
          url: urlData.publicUrl,
          error: null,
          bucket: bucketName,
          path: filePath,
          isCloud: true,
        };
      }
    }

    console.warn('Supabase storage upload notice:', uploadError?.message);
  } catch (err) {
    console.warn('Supabase storage exception, using local fallback:', err);
  }

  // 2. Base64 fallback (instant fallback so UI always works seamlessly)
  try {
    const base64Url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return {
      url: base64Url,
      error: null,
      isBase64Fallback: true,
      notice: 'Saved locally as image data. In Supabase Dashboard, create a public bucket named "product-images" for cloud CDN storage.',
    };
  } catch (readErr) {
    return { url: null, error: readErr };
  }
}

// Helper: Convert DB snake_case record to App camelCase product object
export function mapFromDb(item) {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name || '',
    tagline: item.tagline || '',
    description: item.description || '',
    modelInfo: item.model_info || item.modelInfo || '',
    price: Number(item.price) || 0,
    originalPrice: item.original_price ? Number(item.original_price) : (item.originalPrice ? Number(item.originalPrice) : null),
    category: item.category || 'oversized',
    fit: item.fit || 'Oversized Boxy',
    gsm: Number(item.gsm) || 300,
    rating: Number(item.rating) || 5.0,
    reviewsCount: Number(item.reviews_count) || (Number(item.reviewsCount) || 0),
    isNew: item.is_new !== undefined ? Boolean(item.is_new) : Boolean(item.isNew),
    isLimited: item.is_limited !== undefined ? Boolean(item.is_limited) : Boolean(item.isLimited),
    badge: item.badge || '',
    stock: Number(item.stock) || 0,
    sizes: Array.isArray(item.sizes) ? item.sizes : ['M', 'L', 'XL'],
    images: Array.isArray(item.images) ? item.images : [],
    colors: Array.isArray(item.colors) ? item.colors : [],
    specs: item.specs && typeof item.specs === 'object' ? item.specs : {},
    details: Array.isArray(item.details) ? item.details : [],
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

// Helper: Convert App camelCase product object to DB snake_case record
export function mapToDb(product) {
  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline || '',
    description: product.description || '',
    model_info: product.modelInfo || '',
    price: Number(product.price),
    original_price: product.originalPrice ? Number(product.originalPrice) : null,
    category: product.category || 'oversized',
    fit: product.fit || 'Oversized Boxy',
    gsm: Number(product.gsm) || 300,
    rating: Number(product.rating) || 5.0,
    reviews_count: Number(product.reviewsCount) || 0,
    is_new: Boolean(product.isNew),
    is_limited: Boolean(product.isLimited),
    badge: product.badge || null,
    stock: Number(product.stock) || 0,
    sizes: product.sizes || ['M', 'L', 'XL'],
    images: product.images || [],
    colors: product.colors || [],
    specs: product.specs || {},
    details: product.details || [],
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch all products from Supabase.
 * Falls back to local/default products if Supabase fails or table is empty.
 */
export async function fetchProductsFromDb() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return getLocalProducts();
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapFromDb);
      // Cache in localStorage for offline availability
      localStorage.setItem('lunar_supabase_cache', JSON.stringify(mapped));
      return mapped;
    }

    // If Supabase table is empty, auto-seed default products to Supabase
    const local = getLocalProducts();
    seedDefaultProducts(local);
    return local;
  } catch (err) {
    console.error('Error fetching from Supabase:', err);
    return getLocalProducts();
  }
}

/**
 * Auto-seed initial products to Supabase so your database has the starting catalog
 */
async function seedDefaultProducts(products) {
  try {
    const dbPayloads = products.map(mapToDb);
    const { error } = await supabase.from('products').upsert(dbPayloads, { onConflict: 'id' });
    if (!error) {
      console.log('Successfully seeded default products to Supabase database.');
    }
  } catch (e) {
    console.debug('Auto-seed check completed:', e);
  }
}

/**
 * Add a new product to Supabase & local cache
 */
export async function addProduct(product) {
  const id = product.id || 'lunar-tee-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
  const newProduct = {
    ...product,
    id,
    rating: product.rating || 5.0,
    reviewsCount: product.reviewsCount || 0,
  };

  // 1. Save to local fallback store first for instant UI response
  saveLocalAdd(newProduct);

  // 2. Insert into Supabase
  try {
    const dbPayload = mapToDb(newProduct);
    const { data, error } = await supabase
      .from('products')
      .insert([dbPayload])
      .select();

    if (error) {
      console.error('Error inserting into Supabase:', error.message);
      return { product: newProduct, error };
    }

    return { product: data?.[0] ? mapFromDb(data[0]) : newProduct, error: null };
  } catch (err) {
    console.error('Supabase add product exception:', err);
    return { product: newProduct, error: err };
  }
}

/**
 * Update an existing product in Supabase & local cache
 */
export async function updateProduct(id, updates) {
  const updatedProduct = { ...updates, id };

  // 1. Update local fallback store
  saveLocalUpdate(id, updates);

  // 2. Update Supabase
  try {
    const dbPayload = mapToDb(updatedProduct);
    const { data, error } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating in Supabase:', error.message);
      return { error };
    }

    return { product: data?.[0] ? mapFromDb(data[0]) : updatedProduct, error: null };
  } catch (err) {
    console.error('Supabase update product exception:', err);
    return { error: err };
  }
}

/**
 * Delete a product from Supabase & local cache
 */
export async function deleteProduct(id) {
  // 1. Remove from local store
  saveLocalDelete(id);

  // 2. Delete from Supabase
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting from Supabase:', error.message);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Supabase delete product exception:', err);
    return { error: err };
  }
}

// ─── Local storage fallback helpers ─────────────────────────

export function getLocalProducts() {
  const store = _getLocalStore();
  let products = DEFAULT_PRODUCTS.map((p) => {
    if (store.deleted.includes(p.id)) return null;
    if (store.edited[p.id]) return { ...p, ...store.edited[p.id] };
    return { ...p };
  }).filter(Boolean);

  const added = store.added.map((p) => ({ ...p }));
  return [...products, ...added];
}

function saveLocalAdd(product) {
  const store = _getLocalStore();
  store.added.unshift(product);
  _saveLocalStore(store);
}

function saveLocalUpdate(id, updates) {
  const store = _getLocalStore();
  const addedIndex = store.added.findIndex((p) => p.id === id);
  if (addedIndex !== -1) {
    store.added[addedIndex] = { ...store.added[addedIndex], ...updates };
  } else {
    store.edited[id] = { ...store.edited[id], ...updates, id };
  }
  _saveLocalStore(store);
}

function saveLocalDelete(id) {
  const store = _getLocalStore();
  const addedIndex = store.added.findIndex((p) => p.id === id);
  if (addedIndex !== -1) {
    store.added.splice(addedIndex, 1);
  } else {
    store.deleted.push(id);
  }
  delete store.edited[id];
  _saveLocalStore(store);
}

function _getLocalStore() {
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
    localStorage.removeItem(STORAGE_KEY);
  }
  return { added: [], edited: {}, deleted: [] };
}

function _saveLocalStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
