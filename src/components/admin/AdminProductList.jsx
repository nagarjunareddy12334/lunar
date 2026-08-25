import React, { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES } from '../../data/products';
import {
  Search,
  Trash2,
  Edit3,
  Package,
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export default function AdminProductList({ onEditProduct }) {
  const { products, loading, deleteProduct, refreshProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered products
  const filtered = useMemo(() => {
    let list = products;
    if (filterCategory !== 'all') {
      list = list.filter((p) => p.category === filterCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q))
      );
    }
    return list;
  }, [products, searchTerm, filterCategory]);

  // Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const lowStock = products.filter((p) => (p.stock || 0) <= 5).length;
  const limitedDrops = products.filter((p) => p.isLimited).length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteProduct(deleteTarget.id);
    setIsDeleting(false);
    setSuccessMsg(`"${deleteTarget.name}" has been deleted.`);
    setDeleteTarget(null);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getBadgeClass = (product) => {
    if (product.isLimited) return 'limited';
    if (product.isNew) return 'new';
    if ((product.stock || 0) <= 5) return 'low-stock';
    return '';
  };

  return (
    <div>
      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{totalProducts}</div>
          <div className="admin-stat-label">Total Products</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{totalStock}</div>
          <div className="admin-stat-label">Total Stock</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{lowStock}</div>
          <div className="admin-stat-label">Low Stock (≤5)</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{limitedDrops}</div>
          <div className="admin-stat-label">Limited Drops</div>
        </div>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="admin-success">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <Search size={16} />
          <input
            className="admin-search-input"
            type="text"
            placeholder="Search products by name, ID, or badge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="admin-select"
          style={{ width: 'auto', minWidth: '160px', flex: 'none' }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <Package size={48} />
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Category</th>
                <th>GSM</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      className="admin-product-thumb"
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f1f5f9' }}>
                      {product.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        marginTop: '0.15rem',
                      }}
                    >
                      {product.id}
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {product.category}
                  </td>
                  <td>{product.gsm} GSM</td>
                  <td>
                    <span style={{ color: '#c5a880', fontWeight: 600 }}>
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#475569',
                          textDecoration: 'line-through',
                          marginLeft: '0.4rem',
                        }}
                      >
                        ${product.originalPrice}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        color:
                          (product.stock || 0) <= 5 ? '#fca5a5' : '#86efac',
                        fontWeight: 600,
                      }}
                    >
                      {product.stock || 0}
                    </span>
                  </td>
                  <td>
                    {product.badge && (
                      <span
                        className={`admin-badge ${getBadgeClass(product)}`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        className="admin-btn-icon"
                        title="Edit product"
                        onClick={() => onEditProduct(product)}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        className="admin-btn-icon danger"
                        title="Delete product"
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="admin-modal-overlay"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Product</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong style={{ color: '#f1f5f9' }}>
                "{deleteTarget.name}"
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <button
                className="admin-btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button className="admin-btn-danger" onClick={handleDelete}>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
