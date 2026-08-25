import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminProductList from './AdminProductList';
import AdminProductForm from './AdminProductForm';
import { Moon, Plus, LogOut, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import './AdminStyles.css';

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products'); // 'products'
  const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleCreateNew = () => {
    setEditingProduct(null);
    setMode('create');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setMode('edit');
  };

  const handleFormDone = () => {
    setMode('list');
    setEditingProduct(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-root">
      {/* Top Navbar */}
      <header className="admin-topnav">
        <div className="admin-topnav-brand">
          <Moon size={22} className="text-[#C5A880]" />
          <h2>LUNAR</h2>
          <span>Admin Portal</span>
        </div>

        <div className="admin-topnav-actions">
          <button
            className="admin-btn-secondary"
            onClick={() => navigate('/')}
            title="View Live Storefront"
          >
            <ExternalLink size={15} />
            <span>Storefront</span>
          </button>
          <button
            className="admin-btn-secondary"
            onClick={handleLogout}
            title="Sign Out"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-content">
        {/* Header with Title & Action Button */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">
              {mode === 'list' && 'Product Inventory'}
              {mode === 'create' && 'Create New Product'}
              {mode === 'edit' && `Edit Product — ${editingProduct?.name || ''}`}
            </h1>
            <p className="admin-page-subtitle">
              {mode === 'list' && 'Manage your luxury catalog, stock levels, badges, and pricing.'}
              {mode === 'create' && 'Fill out product specifications, images, and pricing.'}
              {mode === 'edit' && 'Modify product details, inventory, and specifications.'}
            </p>
          </div>

          {mode === 'list' ? (
            <button className="admin-btn-primary" onClick={handleCreateNew}>
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          ) : (
            <button className="admin-btn-secondary" onClick={() => setMode('list')}>
              <ArrowLeft size={16} />
              <span>Back to Catalog</span>
            </button>
          )}
        </div>

        {/* Dynamic Content */}
        {mode === 'list' && (
          <AdminProductList onEditProduct={handleEditProduct} />
        )}

        {(mode === 'create' || mode === 'edit') && (
          <AdminProductForm
            editProduct={editingProduct}
            onDone={handleFormDone}
            onCancel={() => setMode('list')}
          />
        )}
      </main>
    </div>
  );
}
