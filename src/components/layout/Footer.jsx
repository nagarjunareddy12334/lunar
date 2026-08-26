import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Send, ShieldCheck, Globe, ArrowUp, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Footer({ onNavigate, onSelectCategory, onOpenSizeGuide }) {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currency, setCurrency] = useState('USD ($)');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Welcome to LUNAR. Use code "LUNARTEE15" for 15% off.', 'success');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050608] text-slate-400 text-xs border-t border-slate-800/80 pt-20 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800/80">
          {/* Left Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center">
              <img
                src="/lunar-logo.jpg"
                alt="LUNAR - Live Like You Dream"
                className="h-16 w-auto object-contain mix-blend-screen filter drop-shadow-[0_0_12px_rgba(255,255,255,0.18)]"
              />
            </div>
            <p className="text-slate-400 font-light leading-relaxed max-w-sm">
              Sculptural streetwear t-shirts engineered with 280 to 360 GSM combed cotton, drop-shoulder silhouettes, and reinforced zero-sag collars. Crafted in limited runs.
            </p>

            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-2 flex-wrap">
              <span>WEIGHT: 280–360 GSM</span>
              <span>•</span>
              <span>100% COMBED COTTON</span>
              <span>•</span>
              <span>PRE-SHRUNK</span>
            </div>
          </div>

          {/* Right Newsletter Signup */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#10121A] border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-[#C5A880] text-xs font-mono tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>JOIN THE LUNAR FREQUENCY</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-display">
                Get Drop Notifications & 15% Off Your First Order
              </h3>
              <p className="text-xs text-slate-400 font-light max-w-md">
                Direct transmission for private t-shirt drop previews, secret archival restocks, and exclusive invitations.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed! Use code <strong>LUNARTEE15</strong> at checkout for 15% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-slate-800/80">
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              T-SHIRT SILHOUETTES
            </h4>
            <ul className="space-y-2.5 font-light">
              <li>
                <button
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory('oversized');
                    if (onNavigate) onNavigate('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Oversized & Boxy Fits
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory('graphic');
                    if (onNavigate) onNavigate('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Graphic & Cyberpunk Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory('vintage');
                    if (onNavigate) onNavigate('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Acid Washed & Vintage
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory('minimal');
                    if (onNavigate) onNavigate('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  360 GSM Heavyweight Blanks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory('limited');
                    if (onNavigate) onNavigate('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Limited 1-of-150 Pcs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              FABRIC & FIT
            </h4>
            <ul className="space-y-2.5 font-light">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('fabric-guide')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  GSM Weight Guide (280–360)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSizeGuide && onOpenSizeGuide()}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Size & Fit Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('drop-countdown')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Phase 05 Drop Timer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('community')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  #LunarTees Lookbook
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 font-light">
              <li><span className="hover:text-white transition-colors cursor-pointer">Free Shipping Over $75</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">30-Day Easy Returns</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Collar Shape Guarantee</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Wash & Care Instructions</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Track Your Order</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              REGION & CURRENCY
            </h4>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  <option value="USD ($)">United States (USD $)</option>
                  <option value="EUR (€)">European Union (EUR €)</option>
                  <option value="GBP (£)">United Kingdom (GBP £)</option>
                  <option value="JPY (¥)">Japan (JPY ¥)</option>
                  <option value="CAD ($)">Canada (CAD $)</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-500 font-light">
                Complimentary worldwide shipping on all orders over $75.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} LUNAR TEES APPAREL INC. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center sm:justify-end">
            <span className="hover:text-slate-300 cursor-pointer">PRIVACY</span>
            <span className="hover:text-slate-300 cursor-pointer">TERMS</span>
            <span className="hover:text-slate-300 cursor-pointer">LIFETIME COLLAR GUARANTEE</span>
            <Link
              to="/admin"
              className="hover:text-[#C5A880] transition-colors flex items-center gap-1 text-slate-400"
            >
              <Lock className="w-3 h-3" />
              <span>ADMIN PORTAL</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
