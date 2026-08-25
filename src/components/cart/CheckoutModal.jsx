import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Banknote,
  Truck,
  MapPin,
  Save,
  User,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useToast } from '../../context/ToastContext';
import { createOrder } from '../../utils/customerStore';
import { formatPrice } from '../../utils/formatters';
import { useScrollLock } from '../../hooks/useScrollLock';
import confetti from 'canvas-confetti';

export default function CheckoutModal({ isOpen, onClose }) {
  useScrollLock(isOpen);
  const { items, grandTotal, subtotal, discountAmount, shipping, clearCart } = useCart();
  const { customer, isAuthenticated, updateProfile, refreshOrders, openAuthModal } = useCustomerAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card'
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Vanguard',
    email: 'alex.vanguard@lunar.com',
    phone: '+1 (555) 019-2834',
    address: '42 Lunar Boulevard, Suite 800',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '08/28',
    cardCvc: '888',
  });

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Auto-fill customer info when logged in or when modal opens
  useEffect(() => {
    if (customer && isOpen) {
      const names = (customer.fullName || '').split(' ');
      const fName = names[0] || 'Alex';
      const lName = names.slice(1).join(' ') || 'Vanguard';

      setFormData((prev) => ({
        ...prev,
        firstName: fName,
        lastName: lName,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone,
        address: customer.address || prev.address,
        city: customer.city || prev.city,
        state: customer.state || prev.state,
        postalCode: customer.postalCode || prev.postalCode,
        country: customer.country || prev.country || 'United States',
      }));
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedOrder = `LN-${Math.floor(100000 + Math.random() * 900000)}-ORBIT`;

    // 1. If customer wants to save/update this delivery address to their profile
    if (isAuthenticated && saveAddressToAccount && customer?.id) {
      try {
        await updateProfile({
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        });
      } catch (err) {
        console.warn('Address sync to customer profile notice:', err);
      }
    }

    // 2. Prepare order payload for Supabase
    const orderPayload = {
      orderNumber: generatedOrder,
      customerId: customer?.id || null,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
      },
      items: items,
      subtotal: subtotal,
      discountAmount: discountAmount,
      shippingFee: shipping,
      totalAmount: grandTotal,
      paymentMethod: paymentMethod, // 'cod' or 'card'
      paymentStatus: paymentMethod === 'cod' ? 'pending_cash_on_delivery' : 'paid',
      notes: paymentMethod === 'cod' ? 'Customer selected Cash on Delivery' : 'Paid via Online Card',
    };

    // 3. Save order to Supabase
    const result = await createOrder(orderPayload);
    setIsSubmitting(false);

    if (result.success) {
      setConfirmedOrder(result.order);
      setStep(3);

      if (isAuthenticated) {
        refreshOrders();
      }

      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#cbd5e1', '#c5a880', '#94a3b8', '#10b981'],
        });
      } catch (err) {
        // Safe fallback
      }

      showToast(
        paymentMethod === 'cod'
          ? 'COD Order Placed! Details saved in Supabase.'
          : 'Order placed & payment verified!',
        'success'
      );

      clearCart();
    } else {
      showToast('Could not save order. Please check connection.', 'error');
    }
  };

  const handleFinish = () => {
    setStep(1);
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Lock className="w-4 h-4 text-[#C5A880]" />
            </div>
            <span className="text-xs font-mono tracking-widest text-slate-300 uppercase">
              256-BIT ENCRYPTED LUNAR CHECKOUT
            </span>
          </div>

          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Customer Login Prompt Banner if not logged in */}
        {!isAuthenticated && step === 1 && (
          <div className="mt-4 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4 text-[#C5A880]" />
              <span>Have a Lunar customer account?</span>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="text-[#C5A880] hover:underline font-mono font-semibold cursor-pointer"
            >
              Log in to auto-fill address
            </button>
          </div>
        )}

        {/* Step 1: Shipping Address */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white font-display">
                  Shipping Destination
                </h3>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Enter your address for express delivery. All details sync to Supabase.
                </p>
              </div>
              {isAuthenticated && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/50 border border-emerald-800/40 rounded-full text-emerald-300 text-[11px] font-mono">
                  <MapPin className="w-3 h-3" />
                  <span>Customer Address Loaded</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Email Address (Order Tracking)
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Street Address</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Checkbox to save address to customer account */}
            {isAuthenticated && (
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={saveAddressToAccount}
                  onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-[#C5A880] focus:ring-0 cursor-pointer"
                />
                <span>Save/update this delivery address in my Lunar customer profile</span>
              </label>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Total: {formatPrice(grandTotal)}</span>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Select Payment Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Method & Cash on Delivery (COD) Option */}
        {step === 2 && (
          <form onSubmit={handleCompleteOrder} className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white font-display">
                  Payment Method
                </h3>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Choose Cash on Delivery (COD) or Online Card Payment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            {/* Order Review Snippet */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal ({items.length} items)</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Savings</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Express Courier Shipping</span>
                <span className="text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Payable Amount</span>
                <span className="text-base text-[#C5A880]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* PAYMENT METHOD SELECTION TABS */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">
                Select Your Preferred Payment Mode
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Cash on Delivery (COD) Button / Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-950/30 border-[#C5A880] ring-1 ring-[#C5A880]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-amber-950/60 text-[#C5A880] border border-amber-800/40">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#C5A880]/20 text-[#C5A880] font-bold">
                      POPULAR
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase font-display">
                    Cash on Delivery (COD)
                  </h4>
                  <p className="text-[11px] text-slate-400 font-light mt-1">
                    Pay with cash at your doorstep when your heavy-duty package arrives.
                  </p>
                </button>

                {/* 2. Online Card Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 font-bold">
                      INSTANT
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase font-display">
                    Credit / Debit Card
                  </h4>
                  <p className="text-[11px] text-slate-400 font-light mt-1">
                    Direct instant authorization with simulated secure checkout.
                  </p>
                </button>
              </div>
            </div>

            {/* COD Specific Info Box */}
            {paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-800/40 space-y-2 text-xs font-mono animate-fadeIn">
                <div className="flex items-center gap-2 text-[#C5A880] font-bold">
                  <Truck className="w-4 h-4" />
                  <span>CASH ON DELIVERY VERIFICATION</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  You will pay <strong className="text-white">{formatPrice(grandTotal)}</strong> in cash to the delivery executive upon arrival. Please ensure exact change or digital COD is available at:
                </p>
                <div className="p-2.5 bg-black/40 rounded-xl text-slate-300 text-[11px] border border-slate-800">
                  📍 {formData.address}, {formData.city}, {formData.state} {formData.postalCode}
                </div>
              </div>
            )}

            {/* Card Inputs if Card is selected */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">CVC Code</label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Place Order CTA */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                {paymentMethod === 'cod' ? 'COD Selected (Supabase Sync)' : 'Simulated Gateway'}
              </span>

              {paymentMethod === 'cod' ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#b0936d] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#C5A880]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Banknote className="w-4 h-4" />
                  <span>{isSubmitting ? 'Placing COD Order...' : 'Confirm Order with Cash on Delivery (COD)'}</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Authorizing...' : `Authorize & Pay ${formatPrice(grandTotal)}`}</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* Step 3: Order Confirmation */}
        {step === 3 && (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-[#C5A880] tracking-widest block mb-1">
                LUNAR TRANSACTION RECORDED IN SUPABASE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-display">
                Thank You, {formData.firstName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-2 max-w-md mx-auto">
                Your order is confirmed and synchronised with Supabase. A notification has been logged for{' '}
                <span className="text-white font-medium">{formData.email}</span>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-[#0D0E14] p-5 rounded-2xl border border-slate-800 max-w-md mx-auto text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">TRACKING IDENTIFIER</span>
                <span className="font-bold text-[#C5A880]">{confirmedOrder?.orderNumber || 'LN-ORBIT'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">PAYMENT METHOD</span>
                <span className="font-bold text-white uppercase">
                  {confirmedOrder?.paymentMethod === 'cod' ? '💵 Cash on Delivery (COD)' : '💳 Card (Paid)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">AMOUNT PAYABLE</span>
                <span className="font-bold text-[#C5A880]">{formatPrice(grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DELIVERY TO</span>
                <span className="text-white truncate max-w-[200px]">{formData.city}, {formData.country}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleFinish}
                className="px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
