import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminProductList from './AdminProductList';
import AdminProductForm from './AdminProductForm';
import AdminOrderList from './AdminOrderList';
import AdminCustomerList from './AdminCustomerList';
import {
  Moon,
  Plus,
  LogOut,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Package,
  Users,
} from 'lucide-react';
import './AdminStyles.css';

export default function AdminDashboard() {
  const { isAuthenticated, adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'customers'
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
          {adminUser && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(197, 168, 128, 0.1)',
                border: '1px solid rgba(197, 168, 128, 0.25)',
                fontSize: '0.78rem',
                color: '#C5A880',
                fontWeight: 500,
              }}
            >
              <ShieldCheck size={14} />
              <span>{adminUser.username || 'Admin'}</span>
            </div>
          )}
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
        {/* Navigation Tabs (Products vs Customer Orders vs Customer Logins) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--admin-border-subtle)',
            paddingBottom: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {/* 1. Product Inventory Button */}
          <button
            onClick={() => {
              setActiveTab('products');
              setMode('list');
            }}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '0.65rem',
              border: activeTab === 'products' ? '1px solid #C5A880' : '1px solid transparent',
              background: activeTab === 'products' ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
              color: activeTab === 'products' ? '#C5A880' : 'var(--admin-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <ShoppingBag size={16} />
            <span>Product Inventory</span>
          </button>

          {/* 2. Customer Orders & COD Button */}
          <button
            onClick={() => {
              setActiveTab('orders');
              setMode('list');
            }}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '0.65rem',
              border: activeTab === 'orders' ? '1px solid #C5A880' : '1px solid transparent',
              background: activeTab === 'orders' ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
              color: activeTab === 'orders' ? '#C5A880' : 'var(--admin-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <Package size={16} />
            <span>Customer Orders & COD</span>
          </button>

          {/* 3. Customer Logins & Addresses Button */}
          <button
            onClick={() => {
              setActiveTab('customers');
              setMode('list');
            }}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '0.65rem',
              border: activeTab === 'customers' ? '1px solid #C5A880' : '1px solid transparent',
              background: activeTab === 'customers' ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
              color: activeTab === 'customers' ? '#C5A880' : 'var(--admin-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <Users size={16} />
            <span>Customer Logins & Addresses</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">
              {activeTab === 'customers' && 'Customer Login Accounts & Delivery Addresses'}
              {activeTab === 'orders' && 'Customer Orders & Deliveries'}
              {activeTab === 'products' && mode === 'list' && 'Product Inventory'}
              {activeTab === 'products' && mode === 'create' && 'Create New Product'}
              {activeTab === 'products' && mode === 'edit' && `Edit Product — ${editingProduct?.name || ''}`}
            </h1>
            <p className="admin-page-subtitle">
              {activeTab === 'customers' && 'All customer credentials, phone numbers, registered delivery addresses, and ordered garments in Supabase.'}
              {activeTab === 'orders' && 'Real-time orders synced with Supabase, including Cash on Delivery (COD) and delivery addresses.'}
              {activeTab === 'products' && mode === 'list' && 'Manage your luxury catalog, stock levels, badges, and pricing.'}
              {activeTab === 'products' && mode === 'create' && 'Fill out product specifications, images, and pricing.'}
              {activeTab === 'products' && mode === 'edit' && 'Modify product details, inventory, and specifications.'}
            </p>
          </div>

          {activeTab === 'products' && (
            mode === 'list' ? (
              <button className="admin-btn-primary" onClick={handleCreateNew}>
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            ) : (
              <button className="admin-btn-secondary" onClick={() => setMode('list')}>
                <ArrowLeft size={16} />
                <span>Back to Catalog</span>
              </button>
            )
          )}
        </div>

        {/* Dynamic Content */}
        {activeTab === 'customers' && <AdminCustomerList />}

        {activeTab === 'orders' && <AdminOrderList />}

        {activeTab === 'products' && mode === 'list' && (
          <AdminProductList onEditProduct={handleEditProduct} />
        )}

        {activeTab === 'products' && (mode === 'create' || mode === 'edit') && (
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
