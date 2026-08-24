import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, CheckCircle2, Lock, ArrowRight, ArrowLeft, PackageCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { useScrollLock } from '../../hooks/useScrollLock';
import confetti from 'canvas-confetti';

export default function CheckoutModal({ isOpen, onClose }) {
  useScrollLock(isOpen);
  const { items, grandTotal, subtotal, discountAmount, shipping, clearCart } = useCart();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Vanguard',
    email: 'alex.vanguard@lunar-orbit.com',
    address: '42 Lunar Boulevard, Suite 800',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    country: 'United States',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '08/28',
    cardCvc: '888',
  });

  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const generatedOrder = `LN-${Math.floor(100000 + Math.random() * 900000)}-ORBIT`;
    setOrderNumber(generatedOrder);
    setStep(3);

    // Fire Celebratory Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#cbd5e1', '#c5a880', '#94a3b8'],
      });
    } catch (err) {
      // safe fallback if canvas-confetti context is not available
    }

    clearCart();
  };

  const handleFinish = () => {
    setStep(1);
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

        {/* Step 1: Shipping Address */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white font-display">
                Shipping Destination
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                Enter your residential or studio address for express delivery.
              </p>
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-white"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Email for Tracking Updates</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Street Address</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-white"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Total: {formatPrice(grandTotal)}</span>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <form onSubmit={handleCompleteOrder} className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white font-display">
                  Payment Verification
                </h3>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Secure simulated payment gateway.
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
                <span>Items Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Savings</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Insured Express Shipping</span>
                <span className="text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Final Authorized Amount</span>
                <span className="text-base text-[#C5A880]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Mock Card Form */}
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-white font-mono"
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">CVC Code</label>
                  <input
                    type="text"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Demo Order Testing</span>
              <button
                type="submit"
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Place Order</span>
              </button>
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
                LUNAR TRANSACTION CONFIRMED
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-display">
                Thank You, {formData.firstName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-2 max-w-md mx-auto">
                Your order is currently being prepared and hand-inspected in our atelier. A confirmation email with tracking has been sent to <span className="text-white font-medium">{formData.email}</span>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-[#0D0E14] p-5 rounded-2xl border border-slate-800 max-w-md mx-auto text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">TRACKING IDENTIFIER</span>
                <span className="font-bold text-[#C5A880]">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ESTIMATED ARRIVAL</span>
                <span className="text-white">3-4 Business Days (Express)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DELIVERY TO</span>
                <span className="text-white truncate max-w-[200px]">{formData.city}, {formData.country}</span>
              </div>
            </div>

            <div className="pt-4">
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
