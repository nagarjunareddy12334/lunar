import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/formatters';
import { useScrollLock } from '../../hooks/useScrollLock';

const TRENDING_TAGS = ['Oversized', 'Graphic Tees', '360 GSM', 'Acid Wash', 'Boxy Fit', 'Vintage Washed'];

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  useScrollLock(isOpen);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        (p.fit && p.fit.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#10121A] w-full max-w-2xl rounded-3xl p-6 border border-slate-700 shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative flex items-center border-b border-slate-800 pb-4">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search oversized, graphic tees, GSM weights..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-white mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded-md hover:text-white cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Trending Suggestions */}
        {!query && (
          <div className="py-6 space-y-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
              TRENDING TEE SEARCHES:
            </span>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query && (
          <div className="py-4 max-h-[60vh] overflow-y-auto space-y-2 divide-y divide-slate-800/60">
            {searchResults.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-slate-400">
                No matching t-shirts found for "{query}". Try searching by "oversized" or "graphic".
              </div>
            ) : (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="pt-3 first:pt-0 flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase group-hover:text-[#C5A880] transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {product.gsm} GSM • {product.fit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-white">
                      {formatPrice(product.price)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
