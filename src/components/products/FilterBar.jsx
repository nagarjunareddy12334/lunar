import React from 'react';
import { CATEGORIES, GSM_WEIGHTS, SIZES } from '../../data/products';
import { SlidersHorizontal, ArrowUpDown, Check, Sparkles } from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  selectedGsm,
  onSelectGsm,
  selectedSize,
  onSelectSize,
  sortBy,
  onSelectSort,
  onlyInStock,
  onToggleInStock,
  totalResults,
}) {
  const { playClick } = useSoundFX();

  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills Bar (Horizontal scroll on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-white text-black font-bold shadow-lg scale-105'
                  : 'bg-[#10121A] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Filter & Sort Controls Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#10121A] border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Left: Size Selector Pills & GSM filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* GSM Weight Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase hidden sm:inline">Weight:</span>
            <select
              value={selectedGsm}
              onChange={(e) => onSelectGsm(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono uppercase outline-none focus:border-white transition-colors cursor-pointer"
            >
              {GSM_WEIGHTS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Size Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 uppercase hidden md:inline mr-1">Size:</span>
            <button
              onClick={() => onSelectSize('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                selectedSize === 'all'
                  ? 'bg-white text-black font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All
            </button>
            {SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => onSelectSize(sz)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                  selectedSize === sz
                    ? 'bg-white text-black font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Right: In Stock Toggle & Sort Dropdown & Counter */}
        <div className="flex items-center gap-3">
          {/* In Stock Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => onToggleInStock(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-white focus:ring-0 cursor-pointer"
            />
            <span className="text-[11px]">In Stock Only</span>
          </label>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono uppercase outline-none focus:border-white transition-colors cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="gsm-desc">Weight: Heaviest First</option>
            </select>
          </div>

          {/* Counter */}
          <span className="text-slate-400 font-mono text-[11px] pl-2 border-l border-slate-700">
            {totalResults} {totalResults === 1 ? 'Tee' : 'Tees'}
          </span>
        </div>

      </div>
    </div>
  );
}
