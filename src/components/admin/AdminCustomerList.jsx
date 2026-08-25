import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Lock,
  Calendar,
  Package,
  ShoppingBag,
  Banknote,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { getAllCustomers, getAllOrders } from '../../utils/customerStore';
import { formatPrice } from '../../utils/formatters';

export default function AdminCustomerList() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [custList, orderList] = await Promise.all([
        getAllCustomers(),
        getAllOrders(),
      ]);
      setCustomers(custList || []);
      setOrders(orderList || []);
    } catch (e) {
      console.warn('Failed to load customers from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleExpand = (custId) => {
    setExpandedCustomerId((prev) => (prev === custId ? null : custId));
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter((cust) => {
    const q = searchQuery.toLowerCase();
    return (
      (cust.fullName || '').toLowerCase().includes(q) ||
      (cust.email || '').toLowerCase().includes(q) ||
      (cust.phone || '').toLowerCase().includes(q) ||
      (cust.address || '').toLowerCase().includes(q) ||
      (cust.city || '').toLowerCase().includes(q) ||
      (cust.state || '').toLowerCase().includes(q)
    );
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
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
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
            placeholder="Search customers by name, email, phone, city, or address..."
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

        {/* Stats summary & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '0.65rem',
              background: 'rgba(197, 168, 128, 0.1)',
              border: '1px solid rgba(197, 168, 128, 0.25)',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              color: '#C5A880',
              fontWeight: 600,
            }}
          >
            👥 {customers.length} REGISTERED CUSTOMERS
          </div>

          <button
            onClick={loadData}
            className="admin-btn-secondary"
            title="Refresh Customers from Supabase"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sync Supabase</span>
          </button>
        </div>
      </div>

      {/* Customer List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--admin-text-muted)' }}>
          <RefreshCw size={26} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ fontSize: '0.85rem' }}>Fetching customer login details & addresses from Supabase...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1rem',
            background: 'var(--admin-surface-1)',
            borderRadius: '1rem',
            border: '1px dashed var(--admin-border-subtle)',
          }}
        >
          <Users size={36} style={{ color: 'var(--admin-text-muted)', margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', fontWeight: 600 }}>
            No Customers Found
          </h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            When customers create an account or place orders, their login credentials and delivery addresses will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredCustomers.map((cust) => {
            const customerOrders = orders.filter(
              (o) =>
                o.customerId === cust.id ||
                (o.customerEmail || '').toLowerCase() === (cust.email || '').toLowerCase()
            );

            const isExpanded = expandedCustomerId === cust.id;
            const totalSpent = customerOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);

            return (
              <div
                key={cust.id}
                style={{
                  background: 'var(--admin-surface-1)',
                  border: '1px solid var(--admin-border-subtle)',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Header: Customer Profile & Action */}
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
                        width: '42px',
                        height: '42px',
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, rgba(197, 168, 128, 0.2), rgba(255,255,255,0.05))',
                        border: '1px solid rgba(197, 168, 128, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#C5A880',
                        fontWeight: 700,
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      {(cust.fullName || cust.email || 'C').charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
                          {cust.fullName || 'Registered Customer'}
                        </span>
                        <span
                          style={{
                            padding: '0.15rem 0.45rem',
                            borderRadius: '0.35rem',
                            fontSize: '0.65rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10B981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          ACTIVE CUSTOMER
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                        ID: {cust.id} • Registered: {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {/* Summary Badges & Expand button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.5rem',
                        background: 'var(--admin-surface-2)',
                        border: '1px solid var(--admin-border-subtle)',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: 'var(--admin-text-muted)',
                      }}
                    >
                      Orders: <strong style={{ color: 'var(--admin-text-primary)' }}>{customerOrders.length}</strong> | Total: <strong style={{ color: '#C5A880' }}>{formatPrice(totalSpent)}</strong>
                    </div>

                    <button
                      onClick={() => toggleExpand(cust.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '0.5rem',
                        background: isExpanded ? 'rgba(197, 168, 128, 0.2)' : 'var(--admin-surface-2)',
                        border: isExpanded ? '1px solid #C5A880' : '1px solid var(--admin-border-subtle)',
                        color: isExpanded ? '#C5A880' : 'var(--admin-text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <ShoppingBag size={13} />
                      <span>{isExpanded ? 'Hide Orders' : `View Orders (${customerOrders.length})`}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Customer Login Details & Delivery Address Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1rem',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.8rem',
                  }}
                >
                  {/* Column 1: Customer Login Credentials */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        color: '#C5A880',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 700,
                      }}
                    >
                      🔑 CUSTOMER LOGIN CREDENTIALS
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-primary)' }}>
                      <Mail size={14} style={{ color: 'var(--admin-text-muted)' }} />
                      <span>Login Email:</span>
                      <strong style={{ color: '#C5A880', fontFamily: 'monospace' }}>{cust.email}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)' }}>
                      <Lock size={14} />
                      <span>Password:</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--admin-text-primary)' }}>
                        {cust.password ? cust.password : '•••••••• (Encrypted in Supabase)'}
                      </span>
                    </div>

                    {cust.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)' }}>
                        <Phone size={14} />
                        <span>Phone:</span>
                        <strong style={{ color: 'var(--admin-text-primary)', fontFamily: 'monospace' }}>{cust.phone}</strong>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Saved Delivery Address */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        color: '#C5A880',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 700,
                      }}
                    >
                      📍 SAVED DELIVERY ADDRESS (SUPABASE SYNCED)
                    </span>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <MapPin size={15} style={{ color: '#C5A880', marginTop: '2px', shrink: 0 }} />
                      <div style={{ color: 'var(--admin-text-primary)', lineHeight: '1.4' }}>
                        {cust.address ? (
                          <>
                            <div style={{ fontWeight: 600 }}>{cust.address}</div>
                            <div style={{ color: 'var(--admin-text-muted)' }}>
                              {cust.city && `${cust.city}, `}
                              {cust.state && `${cust.state} `}
                              {cust.postalCode && `${cust.postalCode}`}
                            </div>
                            <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
                              {cust.country || 'United States'}
                            </div>
                          </>
                        ) : (
                          <span style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                            Address will be populated upon first checkout or profile update.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE SECTION: Customer's Orders & Product Details */}
                {isExpanded && (
                  <div
                    style={{
                      background: 'var(--admin-surface-2)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      border: '1px solid var(--admin-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: 'var(--admin-text-muted)',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      🛒 Orders Placed by {cust.fullName || cust.email} ({customerOrders.length}):
                    </span>

                    {customerOrders.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                        This customer hasn't placed any orders yet.
                      </p>
                    ) : (
                      customerOrders.map((ord) => {
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
                              borderRadius: '0.65rem',
                              padding: '0.85rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.65rem',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                                borderBottom: '1px solid var(--admin-border-subtle)',
                                paddingBottom: '0.5rem',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#C5A880', fontSize: '0.85rem' }}>
                                  {ord.orderNumber}
                                </span>
                                {ord.paymentMethod === 'cod' ? (
                                  <span
                                    style={{
                                      padding: '0.15rem 0.45rem',
                                      borderRadius: '0.35rem',
                                      fontSize: '0.65rem',
                                      fontFamily: 'monospace',
                                      fontWeight: 700,
                                      background: 'rgba(197, 168, 128, 0.2)',
                                      color: '#C5A880',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                    }}
                                  >
                                    <Banknote size={11} /> COD (Cash on Delivery)
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      padding: '0.15rem 0.45rem',
                                      borderRadius: '0.35rem',
                                      fontSize: '0.65rem',
                                      fontFamily: 'monospace',
                                      fontWeight: 700,
                                      background: 'rgba(16, 185, 129, 0.2)',
                                      color: '#10B981',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                    }}
                                  >
                                    <CreditCard size={11} /> Card Payment
                                  </span>
                                )}
                                <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
                                Amount: <span style={{ color: '#C5A880' }}>{formatPrice(ord.totalAmount)}</span>
                              </div>
                            </div>

                            {/* Ordered Products */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {ord.items?.map((it, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    background: 'var(--admin-surface-2)',
                                    padding: '0.3rem 0.6rem',
                                    borderRadius: '0.4rem',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  {it.image && (
                                    <img
                                      src={it.image}
                                      alt={it.name}
                                      style={{ width: '22px', height: '22px', borderRadius: '3px', objectFit: 'cover' }}
                                    />
                                  )}
                                  <span style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>
                                    {it.quantity}x {it.name}
                                  </span>
                                  <span style={{ color: '#C5A880', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                    [{it.size || 'L'}]
                                  </span>
                                  <span style={{ color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                                    {formatPrice(it.price * it.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Delivery Address on Order */}
                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                              📍 <strong>Delivery To:</strong> {addr.address}, {addr.city} {addr.postalCode} | 📞 {ord.customerPhone || cust.phone || 'No phone'}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
