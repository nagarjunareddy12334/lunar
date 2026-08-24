import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { useScrollLock } from '../../hooks/useScrollLock';

export default function WishlistDrawer({ onQuickView }) {
  const { wishlistItems, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  useScrollLock(isWishlistOpen);

  if (!isWishlistOpen) return null;

  const handleMoveToBag = (product) => {
    addToCart(product, product.sizes?.[0] || 'ONE SIZE', product.colors?.[0]?.name || 'Standard', 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#090A0F] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <h2 className="text-base font-bold uppercase tracking-wider text-white font-mono">
                WISHLIST ({wishlistItems.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-800/60">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Your Wishlist is Empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Save your favorite lunar pieces to keep track of limited availability.
                  </p>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              wishlistItems.map((product) => (
                <div key={product.id} className="py-4 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      setIsWishlistOpen(false);
                      onQuickView(product);
                    }}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800 cursor-pointer"
                  >
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onQuickView(product);
                      }}
                      className="text-xs font-bold text-white uppercase truncate cursor-pointer hover:text-[#C5A880] transition-colors"
                    >
                      {product.name}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                      {product.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-white block mt-1">
                      {formatPrice(product.price)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="px-3 py-1.5 bg-white text-black font-mono text-[11px] font-bold uppercase rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-[#07080B]">
              <button
                onClick={() => {
                  wishlistItems.forEach((item) => {
                    addToCart(item, item.sizes?.[0] || 'ONE SIZE', item.colors?.[0]?.name || 'Standard', 1);
                  });
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-4 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add All to Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
