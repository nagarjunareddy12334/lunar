import React, { useState, useRef } from 'react';
import { CATEGORIES, SIZES } from '../../data/products';
import { useProducts } from '../../context/ProductContext';
import { uploadProductImage } from '../../utils/productStore';
import {
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Palette,
  FileText,
  Settings,
  ListOrdered,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  UploadCloud,
  Upload,
  Trash2,
  MoveLeft,
  MoveRight,
  Link as LinkIcon,
  Sparkles,
  Info,
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
    images: [],
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
  const { addProduct, updateProduct } = useProducts();
  const fileInputRef = useRef(null);
  const colorFileInputRefs = useRef({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingColorIdx, setUploadingColorIdx] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [storageNotice, setStorageNotice] = useState('');

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
        images: Array.isArray(editProduct.images)
          ? editProduct.images.filter(Boolean)
          : [],
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
  const [errorMsg, setErrorMsg] = useState('');

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

  // ─── Image upload & management helpers ─────────
  const handleFilesUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setStorageNotice('');

    const newUrls = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const res = await uploadProductImage(file);
      if (res.url) {
        newUrls.push(res.url);
      }
      if (res.notice) {
        setStorageNotice(res.notice);
      }
    }

    if (newUrls.length > 0) {
      setForm((f) => {
        const current = (f.images || []).filter((img) => img && img.trim());
        return { ...f, images: [...current, ...newUrls] };
      });
      setErrors((e) => ({ ...e, images: undefined }));
    }
    setIsUploading(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const removeImageAt = (idx) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }));
  };

  const makeCover = (idx) => {
    if (idx === 0) return;
    setForm((f) => {
      const copy = [...f.images];
      const [item] = copy.splice(idx, 1);
      copy.unshift(item);
      return { ...f, images: copy };
    });
  };

  const moveImage = (idx, direction) => {
    setForm((f) => {
      const copy = [...f.images];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= copy.length) return f;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return { ...f, images: copy };
    });
  };

  const addUrlImage = () => {
    if (!customUrlInput.trim()) return;
    setForm((f) => {
      const cleanExisting = (f.images || []).filter((img) => img && img.trim());
      return { ...f, images: [...cleanExisting, customUrlInput.trim()] };
    });
    setCustomUrlInput('');
    setShowUrlInput(false);
    setErrors((e) => ({ ...e, images: undefined }));
  };

  const handleColorUpload = async (file, colorIdx) => {
    if (!file) return;
    setUploadingColorIdx(colorIdx);
    const res = await uploadProductImage(file);
    if (res.url) {
      setColor(colorIdx, 'image', res.url);
    }
    if (res.notice) {
      setStorageNotice(res.notice);
    }
    setUploadingColorIdx(null);
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
    
    const validImages = (form.images || []).filter((img) => img && img.trim());
    if (validImages.length === 0) errs.images = 'At least one product image is required (upload photo or enter URL)';
    
    if (form.colors.length === 0 || !form.colors[0]?.name?.trim())
      errs.colors = 'At least one color variant is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Submit ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMsg('');

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

    try {
      if (isEdit) {
        const { error } = await updateProduct(editProduct.id, productData);
        if (error) {
          setErrorMsg(`Updated locally, but Supabase notice: ${error.message}`);
        } else {
          setSuccessMsg('Product updated successfully in Supabase & Store!');
        }
      } else {
        const { error } = await addProduct(productData);
        if (error) {
          setErrorMsg(`Saved locally, but Supabase notice: ${error.message}`);
        } else {
          setSuccessMsg('Product added successfully to Supabase & Store!');
        }
      }

      setTimeout(() => {
        setSuccessMsg('');
        setIsSubmitting(false);
        onDone();
      }, 1200);
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg('Failed to save product: ' + err.message);
      setIsSubmitting(false);
    }
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

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="admin-success">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="admin-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={16} />
          {errorMsg}
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
          <div className="admin-form-section-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={16} />
              <span>Product Photos & Media</span>
            </div>
            {form.images && form.images.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>
                {form.images.length} photo{form.images.length > 1 ? 's' : ''} uploaded
              </span>
            )}
          </div>

          {/* Supabase Storage Notice Info */}
          <div className="admin-storage-info-box">
            <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#818cf8' }} />
            <div>
              <strong>Storage Location:</strong> Photos uploaded directly are securely stored in your <strong>Supabase Storage</strong> bucket (<code style={{ color: '#a5b4fc', background: 'rgba(255,255,255,0.06)', padding: '2px 5px', borderRadius: '4px' }}>product-images</code>) and their public CDN URLs are saved to the database.
            </div>
          </div>

          {storageNotice && (
            <div className="admin-storage-info-box" style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24', marginTop: '0.5rem' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{storageNotice}</span>
            </div>
          )}

          {errors.images && (
            <span style={{ color: '#fca5a5', fontSize: '0.75rem', display: 'block', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              {errors.images}
            </span>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              handleFilesUpload(e.target.files);
              e.target.value = '';
            }}
          />

          {/* Drag and Drop Upload Zone */}
          <div
            className={`admin-upload-dropzone ${dragOver ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ marginTop: '0.75rem' }}
          >
            {isUploading && (
              <div className="admin-image-uploading-overlay">
                <Loader2 size={24} className="animate-spin" />
                <span>Uploading photos to Supabase Storage...</span>
              </div>
            )}
            <div className="admin-upload-icon-circle">
              <UploadCloud size={24} />
            </div>
            <div className="admin-upload-title">
              Click to browse or drag & drop product photos
            </div>
            <div className="admin-upload-subtitle">
              PNG, JPG, WEBP supported • Upload multiple photos at once
            </div>
          </div>

          {/* Uploaded Images Grid */}
          {form.images && form.images.length > 0 && (
            <div className="admin-image-grid">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className={`admin-image-card ${i === 0 ? 'is-cover' : ''}`}
                >
                  <div className="admin-image-thumb-wrap">
                    <img
                      src={img}
                      alt={`Product photo ${i + 1}`}
                      onError={(e) => {
                        e.target.style.opacity = '0.3';
                      }}
                    />
                    {i === 0 && (
                      <span className="admin-image-cover-badge">
                        Cover Photo
                      </span>
                    )}
                  </div>
                  <div className="admin-image-card-actions">
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {i > 0 && (
                        <button
                          type="button"
                          className="admin-img-action-btn"
                          title="Move left / Set as Cover"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (i === 1) makeCover(i);
                            else moveImage(i, -1);
                          }}
                        >
                          <MoveLeft size={13} />
                        </button>
                      )}
                      {i < form.images.length - 1 && (
                        <button
                          type="button"
                          className="admin-img-action-btn"
                          title="Move right"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImage(i, 1);
                          }}
                        >
                          <MoveRight size={13} />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      className="admin-img-action-btn danger"
                      title="Remove image"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImageAt(i);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Actions (Upload More & Manual URL) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
              }}
            >
              <Upload size={14} />
              Upload Photos
            </button>

            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setShowUrlInput(!showUrlInput)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
              }}
            >
              <LinkIcon size={14} />
              {showUrlInput ? 'Hide URL Input' : 'Add via Image URL'}
            </button>
          </div>

          {/* Manual URL Input Box */}
          {showUrlInput && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                className="admin-input"
                type="url"
                placeholder="Paste direct image URL (https://...)"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addUrlImage();
                  }
                }}
              />
              <button
                type="button"
                className="admin-btn-primary"
                onClick={addUrlImage}
                style={{ padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}
              >
                Add URL
              </button>
            </div>
          )}
        </div>

        {/* ── Colors ─────────────────────────────── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            <Palette size={16} />
            Color Variants & Swatches
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
              <div className="admin-color-fields" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr auto', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  className="admin-input"
                  type="text"
                  placeholder="Color name (e.g., Obsidian Black)"
                  value={color.name}
                  onChange={(e) => setColor(i, 'name', e.target.value)}
                />
                
                {/* Color Image Row */}
                <div className="admin-color-img-row">
                  {color.image && (
                    <img
                      src={color.image}
                      alt={color.name || 'Color variant'}
                      className="admin-color-img-preview"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <input
                    className="admin-input"
                    type="text"
                    placeholder="Photo URL or upload below"
                    value={color.image}
                    onChange={(e) => setColor(i, 'image', e.target.value)}
                    style={{ fontSize: '0.8rem' }}
                  />
                  {/* Hidden file input for this color */}
                  <input
                    ref={(el) => (colorFileInputRefs.current[i] = el)}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleColorUpload(e.target.files[0], i);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    className="admin-upload-btn-mini"
                    disabled={uploadingColorIdx === i}
                    onClick={() => colorFileInputRefs.current[i]?.click()}
                    title="Upload photo for this color variant"
                  >
                    {uploadingColorIdx === i ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Upload size={13} />
                    )}
                    Upload
                  </button>
                </div>
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
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center' }}>
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={isSubmitting}
            style={{ maxWidth: '280px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving to Supabase...
              </>
            ) : isEdit ? (
              'Update Product'
            ) : (
              'Add Product'
            )}
          </button>
          <button
            type="button"
            className="admin-btn-secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
