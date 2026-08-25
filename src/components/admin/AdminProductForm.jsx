import React, { useState } from 'react';
import { CATEGORIES, SIZES } from '../../data/products';
import { addProduct, updateProduct } from '../../utils/productStore';
import {
  Package,
  DollarSign,
  Tag,
  Image,
  Palette,
  FileText,
  Settings,
  ListOrdered,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.id !== 'all');

const FIT_OPTIONS = [
  'Oversized Boxy',
  'Boxy Relaxed',
  'Boxy Heavyweight',
  'Oversized Fit',
  'Relaxed Fit',
];

function getEmptyProduct() {
  return {
    name: '',
    tagline: '',
    description: '',
    modelInfo: '',
    price: '',
    originalPrice: '',
    category: 'oversized',
    fit: 'Oversized Boxy',
    gsm: '',
    badge: '',
    stock: '',
    sizes: ['M', 'L', 'XL'],
    isNew: true,
    isLimited: false,
    images: ['', '', ''],
    colors: [{ name: '', hex: '#0B0C10', image: '' }],
    specs: {
      fabric: '',
      weight: '',
      collar: '',
      finish: '',
      fitType: '',
      origin: '',
    },
    details: [''],
  };
}

export default function AdminProductForm({ editProduct, onDone, onCancel }) {
  const isEdit = Boolean(editProduct);
  const [form, setForm] = useState(() => {
    if (editProduct) {
      return {
        ...editProduct,
        price: String(editProduct.price || ''),
        originalPrice: editProduct.originalPrice
          ? String(editProduct.originalPrice)
          : '',
        gsm: String(editProduct.gsm || ''),
        stock: String(editProduct.stock || ''),
        images: [
          ...(editProduct.images || []),
          ...Array(3).fill(''),
        ].slice(0, 3),
        colors: editProduct.colors?.length
          ? editProduct.colors.map((c) => ({ ...c }))
          : [{ name: '', hex: '#0B0C10', image: '' }],
        specs: { ...getEmptyProduct().specs, ...(editProduct.specs || {}) },
        details: editProduct.details?.length
          ? [...editProduct.details]
          : [''],
      };
    }
    return getEmptyProduct();
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // ─── Field update helpers ──────────────────────
  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const setSpec = (field, value) => {
    setForm((f) => ({
      ...f,
      specs: { ...f.specs, [field]: value },
    }));
  };

  const setImage = (idx, value) => {
    setForm((f) => {
      const images = [...f.images];
      images[idx] = value;
      return { ...f, images };
    });
  };

  const setColor = (idx, field, value) => {
    setForm((f) => {
      const colors = f.colors.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      );
      return { ...f, colors };
    });
  };

  const addColor = () => {
    setForm((f) => ({
      ...f,
      colors: [...f.colors, { name: '', hex: '#0B0C10', image: '' }],
    }));
  };

  const removeColor = (idx) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.filter((_, i) => i !== idx),
    }));
  };

  const setDetail = (idx, value) => {
    setForm((f) => {
      const details = [...f.details];
      details[idx] = value;
      return { ...f, details };
    });
  };

  const addDetail = () => {
    setForm((f) => ({ ...f, details: [...f.details, ''] }));
  };

  const removeDetail = (idx) => {
    setForm((f) => ({
      ...f,
      details: f.details.filter((_, i) => i !== idx),
    }));
  };

  const toggleSize = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  };

  // ─── Validation ────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Valid price is required';
    if (!form.gsm || Number(form.gsm) <= 0) errs.gsm = 'GSM weight is required';
    if (!form.stock || Number(form.stock) < 0) errs.stock = 'Stock quantity is required';
    if (form.sizes.length === 0) errs.sizes = 'Select at least one size';
    if (!form.images[0]?.trim()) errs.images = 'At least one image URL is required';
    if (form.colors.length === 0 || !form.colors[0]?.name?.trim())
      errs.colors = 'At least one color variant is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Submit ────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      gsm: Number(form.gsm),
      stock: Number(form.stock),
      images: form.images.filter((img) => img.trim()),
      colors: form.colors
        .filter((c) => c.name.trim())
        .map((c) => ({
          name: c.name,
          hex: c.hex,
          image: c.image || form.images[0] || '',
        })),
      details: form.details.filter((d) => d.trim()),
    };

    if (isEdit) {
      updateProduct(editProduct.id, productData);
      setSuccessMsg('Product updated successfully!');
    } else {
      addProduct(productData);
      setSuccessMsg('Product added successfully!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      onDone();
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <button
            className="admin-btn-secondary"
            onClick={onCancel}
            style={{
              marginBottom: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <ArrowLeft size={14} />
            Back to Products
          </button>
          <h2 className="admin-page-title">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="admin-page-subtitle">
            {isEdit
              ? `Editing: ${editProduct.name}`
              : 'Fill in the details below to add a new product to the catalog.'}
          </p>
        </div>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="admin-success">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* ── Basic Info ─────────────────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <Package size={16} />
            Basic Information
          </div>

          <div className="admin-field">
            <label className="admin-label">Product Name *</label>
            <input
              className={`admin-input ${errors.name ? 'admin-input-error' : ''}`}
              type="text"
              placeholder="e.g., Cyber Astral Oversized Graphic Tee"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && (
              <span style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>

          <div className="admin-field">
            <label className="admin-label">Tagline</label>
            <input
              className="admin-input"
              type="text"
              placeholder="e.g., 320 GSM Heavyweight Combed Cotton • Drop-Shoulder"
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea
              className="admin-textarea"
              placeholder="Detailed product description..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Model Info</label>
            <input
              className="admin-input"
              type="text"
              placeholder={'e.g., Model is 6\'1" (185cm), 76kg wearing Size Large'}
              value={form.modelInfo}
              onChange={(e) => set('modelInfo', e.target.value)}
            />
          </div>
        </div>

        {/* ── Pricing ────────────────────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <DollarSign size={16} />
            Pricing
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Price ($) *</label>
              <input
                className={`admin-input ${errors.price ? 'admin-input-error' : ''}`}
                type="number"
                min="0"
                step="1"
                placeholder="68"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Original Price ($)</label>
              <input
                className="admin-input"
                type="number"
                min="0"
                step="1"
                placeholder="85 (leave empty if no discount)"
                value={form.originalPrice}
                onChange={(e) => set('originalPrice', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Classification ─────────────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <Tag size={16} />
            Classification
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Category *</label>
              <select
                className="admin-select"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Fit Type</label>
              <select
                className="admin-select"
                value={form.fit}
                onChange={(e) => set('fit', e.target.value)}
              >
                {FIT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form-row-3">
            <div className="admin-field">
              <label className="admin-label">GSM Weight *</label>
              <input
                className={`admin-input ${errors.gsm ? 'admin-input-error' : ''}`}
                type="number"
                min="100"
                max="500"
                placeholder="320"
                value={form.gsm}
                onChange={(e) => set('gsm', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Badge Text</label>
              <input
                className="admin-input"
                type="text"
                placeholder="e.g., HOT DROP, BESTSELLER"
                value={form.badge}
                onChange={(e) => set('badge', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Stock *</label>
              <input
                className={`admin-input ${errors.stock ? 'admin-input-error' : ''}`}
                type="number"
                min="0"
                placeholder="12"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
              />
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
            <div className="admin-toggle-row">
              <button
                type="button"
                className={`admin-toggle ${form.isNew ? 'active' : ''}`}
                onClick={() => set('isNew', !form.isNew)}
              />
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Mark as New
              </span>
            </div>
            <div className="admin-toggle-row">
              <button
                type="button"
                className={`admin-toggle ${form.isLimited ? 'active' : ''}`}
                onClick={() => set('isLimited', !form.isLimited)}
              />
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Limited Edition
              </span>
            </div>
          </div>
        </div>

        {/* ── Sizes ──────────────────────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <ListOrdered size={16} />
            Available Sizes *
          </div>
          {errors.sizes && (
            <span style={{ color: '#fca5a5', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>
              {errors.sizes}
            </span>
          )}
          <div className="admin-checkbox-group">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={`admin-chip ${form.sizes.includes(size) ? 'active' : ''}`}
                onClick={() => toggleSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ── Images ─────────────────────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <Image size={16} />
            Product Images
          </div>
          {errors.images && (
            <span style={{ color: '#fca5a5', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>
              {errors.images}
            </span>
          )}
          {form.images.map((img, i) => (
            <div className="admin-field" key={i}>
              <label className="admin-label">
                Image {i + 1} URL {i === 0 ? '*' : '(optional)'}
              </label>
              <input
                className={`admin-input ${i === 0 && errors.images ? 'admin-input-error' : ''}`}
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={img}
                onChange={(e) => setImage(i, e.target.value)}
              />
            </div>
          ))}
          <div className="admin-image-previews">
            {form.images
              .filter((img) => img.trim())
              .map((img, i) => (
                <img
                  key={i}
                  className="admin-image-preview"
                  src={img}
                  alt={`Preview ${i + 1}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ))}
          </div>
        </div>

        {/* ── Colors ─────────────────────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <Palette size={16} />
            Color Variants
          </div>
          {errors.colors && (
            <span style={{ color: '#fca5a5', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>
              {errors.colors}
            </span>
          )}
          {form.colors.map((color, i) => (
            <div className="admin-color-entry" key={i}>
              <div className="admin-color-swatch">
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => setColor(i, 'hex', e.target.value)}
                />
              </div>
              <div className="admin-color-fields">
                <input
                  className="admin-input"
                  type="text"
                  placeholder="Color name (e.g., Obsidian Black)"
                  value={color.name}
                  onChange={(e) => setColor(i, 'name', e.target.value)}
                />
                <input
                  className="admin-input"
                  type="url"
                  placeholder="Color-specific image URL (optional)"
                  value={color.image}
                  onChange={(e) => setColor(i, 'image', e.target.value)}
                />
              </div>
              {form.colors.length > 1 && (
                <button
                  type="button"
                  className="admin-btn-icon danger"
                  onClick={() => removeColor(i)}
                  title="Remove color"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={addColor}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.25rem',
            }}
          >
            <Plus size={14} />
            Add Color Variant
          </button>
        </div>

        {/* ── Specs ──────────────────────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <Settings size={16} />
            Product Specifications
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Fabric</label>
              <input
                className="admin-input"
                type="text"
                placeholder="100% Organic Combed Long-Staple Cotton"
                value={form.specs.fabric}
                onChange={(e) => setSpec('fabric', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Weight</label>
              <input
                className="admin-input"
                type="text"
                placeholder="320 GSM Heavyweight Jersey"
                value={form.specs.weight}
                onChange={(e) => setSpec('weight', e.target.value)}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Collar</label>
              <input
                className="admin-input"
                type="text"
                placeholder="3.2cm High-Rib Seamless Neck"
                value={form.specs.collar}
                onChange={(e) => setSpec('collar', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Finish</label>
              <input
                className="admin-input"
                type="text"
                placeholder="Pre-shrunk enzyme wash with silicone finish"
                value={form.specs.finish}
                onChange={(e) => setSpec('finish', e.target.value)}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Fit Type</label>
              <input
                className="admin-input"
                type="text"
                placeholder="Exaggerated Drop-Shoulder Oversized Silhouette"
                value={form.specs.fitType}
                onChange={(e) => setSpec('fitType', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Origin</label>
              <input
                className="admin-input"
                type="text"
                placeholder="Milled & Crafted in Portugal"
                value={form.specs.origin}
                onChange={(e) => setSpec('origin', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Details (bullet points) ────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <FileText size={16} />
            Product Details (Bullet Points)
          </div>
          {form.details.map((detail, i) => (
            <div className="admin-detail-item" key={i}>
              <input
                className="admin-input"
                type="text"
                placeholder={`Detail point ${i + 1}...`}
                value={detail}
                onChange={(e) => setDetail(i, e.target.value)}
              />
              {form.details.length > 1 && (
                <button
                  type="button"
                  className="admin-btn-icon danger"
                  onClick={() => removeDetail(i)}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={addDetail}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.25rem',
            }}
          >
            <Plus size={14} />
            Add Detail Point
          </button>
        </div>

        {/* ── Submit ─────────────────────────────── */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button type="submit" className="admin-btn-primary" style={{ maxWidth: '280px' }}>
            {isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
