import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  RefreshCw,
  Banknote,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../utils/customerStore';
import { formatPrice } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all'); // 'all' | 'cod' | 'card'
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (e) {
      console.warn('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
      );
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const handlePaymentStatusChange = async (orderId, newPayStatus) => {
    try {
      await updateOrderStatus(orderId, undefined, newPayStatus);
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus: newPayStatus } : ord))
      );
      showToast(`Payment status updated to ${newPayStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update payment status', 'error');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (ord.orderNumber || '').toLowerCase().includes(q) ||
      (ord.customerName || '').toLowerCase().includes(q) ||
      (ord.customerEmail || '').toLowerCase().includes(q) ||
      (typeof ord.shippingAddress === 'object'
        ? (ord.shippingAddress.city || '').toLowerCase().includes(q) ||
          (ord.shippingAddress.address || '').toLowerCase().includes(q)
        : (ord.shippingAddress || '').toLowerCase().includes(q));

    const matchMethod =
      methodFilter === 'all' || ord.paymentMethod === methodFilter;

    const matchStatus =
      statusFilter === 'all' || ord.orderStatus === statusFilter;

    return matchSearch && matchMethod && matchStatus;
  });

  return (
    <div className="admin-product-list-container" style={{ padding: '0 0.5rem' }}>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search orders, customers, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.4rem',
              borderRadius: '0.75rem',
              background: 'var(--admin-surface-1)',
              border: '1px solid var(--admin-border-subtle)',
              color: 'var(--admin-text-primary)',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter Badges & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '0.75rem',
              background: 'var(--admin-surface-1)',
              border: '1px solid var(--admin-border-subtle)',
              color: 'var(--admin-text-primary)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Payment Methods</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="card">Card / Online</option>
          </select>

          {/* Order Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '0.75rem',
              background: 'var(--admin-surface-1)',
              border: '1px solid var(--admin-border-subtle)',
              color: 'var(--admin-text-primary)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Order Statuses</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={loadOrders}
            className="admin-btn-secondary"
            title="Refresh Orders from Supabase"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ fontSize: '0.85rem' }}>Loading customer orders from Supabase...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1rem',
            background: 'var(--admin-surface-1)',
            borderRadius: '1rem',
            border: '1px dashed var(--admin-border-subtle)',
          }}
        >
          <Package size={36} style={{ color: 'var(--admin-text-muted)', margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', fontWeight: 600 }}>
            No Customer Orders Found
          </h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            When customers place orders with Cash on Delivery (COD) or Card, they will reflect here and in Supabase.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredOrders.map((ord) => {
            const addr =
              typeof ord.shippingAddress === 'object'
                ? ord.shippingAddress
                : { address: ord.shippingAddress };

            return (
              <div
                key={ord.id}
                style={{
                  background: 'var(--admin-surface-1)',
                  border: '1px solid var(--admin-border-subtle)',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--admin-border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.65rem',
                        background: ord.paymentMethod === 'cod' ? 'rgba(197, 168, 128, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: ord.paymentMethod === 'cod' ? '#C5A880' : '#10B981',
                      }}
                    >
                      {ord.paymentMethod === 'cod' ? <Banknote size={18} /> : <CreditCard size={18} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--admin-text-primary)', fontSize: '0.92rem' }}>
                          {ord.orderNumber}
                        </span>
                        {ord.paymentMethod === 'cod' ? (
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.68rem',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              background: 'rgba(197, 168, 128, 0.2)',
                              color: '#C5A880',
                              border: '1px solid rgba(197, 168, 128, 0.3)',
                            }}
                          >
                            CASH ON DELIVERY (COD)
                          </span>
                        ) : (
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.68rem',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10B981',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            CARD PAYMENT
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                        Placed: {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdowns */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Order Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                        STATUS:
                      </span>
                      <select
                        value={ord.orderStatus || 'processing'}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '0.5rem',
                          background: 'var(--admin-surface-2)',
                          border: '1px solid var(--admin-border-subtle)',
                          color: 'var(--admin-text-primary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <option value="processing">Processing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Payment Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                        PAYMENT:
                      </span>
                      <select
                        value={ord.paymentStatus || (ord.paymentMethod === 'cod' ? 'pending_cash_on_delivery' : 'paid')}
                        onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '0.5rem',
                          background: 'var(--admin-surface-2)',
                          border: '1px solid var(--admin-border-subtle)',
                          color: ord.paymentStatus === 'paid' ? '#10B981' : '#C5A880',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <option value="pending_cash_on_delivery">Pending (Collect on Delivery)</option>
                        <option value="paid">Paid / Collected</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Details & Delivery Address Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '0.85rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.8rem',
                  }}
                >
                  {/* Customer Contact */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-text-primary)', fontWeight: 600 }}>
                      <User size={13} style={{ color: '#C5A880' }} />
                      <span>{ord.customerName || 'Customer'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-text-muted)' }}>
                      <Mail size={13} />
                      <span>{ord.customerEmail}</span>
                    </div>
                    {ord.customerPhone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-text-muted)' }}>
                        <Phone size={13} />
                        <span>{ord.customerPhone}</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery Address (Reflected from Supabase) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-text-primary)', fontWeight: 600 }}>
                      <MapPin size={13} style={{ color: '#C5A880' }} />
                      <span>Delivery Address (Supabase Synced)</span>
                    </div>
                    <div style={{ color: 'var(--admin-text-muted)', lineHeight: '1.4' }}>
                      {addr.address || 'Address not specified'}
                      {addr.city && `, ${addr.city}`}
                      {addr.state && `, ${addr.state}`}
                      {addr.postalCode && ` ${addr.postalCode}`}
                      {addr.country && ` (${addr.country})`}
                    </div>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
                    Ordered Garments ({ord.items?.length || 0} items):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {ord.items?.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'var(--admin-surface-2)',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.78rem',
                          border: '1px solid var(--admin-border-subtle)',
                        }}
                      >
                        {it.image && (
                          <img
                            src={it.image}
                            alt={it.name}
                            style={{ width: '26px', height: '26px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                        )}
                        <span style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>
                          {it.quantity}x {it.name}
                        </span>
                        <span style={{ color: '#C5A880', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                          [{it.size || 'L'}]
                        </span>
                        <span style={{ color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                          {formatPrice(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer & Total */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--admin-border-subtle)',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                  }}
                >
                  <span style={{ color: 'var(--admin-text-muted)' }}>
                    Subtotal: {formatPrice(ord.subtotal)} | Shipping: {ord.shippingFee === 0 ? 'FREE' : formatPrice(ord.shippingFee)}
                  </span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
                    Total: <span style={{ color: '#C5A880' }}>{formatPrice(ord.totalAmount)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
