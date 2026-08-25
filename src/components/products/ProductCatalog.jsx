import React, { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import FilterBar from './FilterBar';
import ProductCard from './ProductCard';
import { RotateCcw, PackageSearch, Sparkles, LayoutGrid, Grid3X3, Grid2X2, Loader2 } from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';

export default function ProductCatalog({
  searchQuery = '',
  onQuickView,
  onSelectProduct,
  activeCategory = 'all',
  onCategoryChange
}) {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [selectedGsm, setSelectedGsm] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [gridCols, setGridCols] = useState(3); // 2, 3, or 4 columns
  const { playClick } = useSoundFX();

  // Sync external category changes
  React.useEffect(() => {
    if (activeCategory) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory]);

  const handleCategorySelect = (cat) => {
    playClick(1400);
    setSelectedCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // GSM Weight Filter
      if (selectedGsm !== 'all') {
        const minGsm = parseInt(selectedGsm, 10);
        if (item.gsm < minGsm) return false;
      }
      // Size Filter
      if (selectedSize !== 'all') {
        if (!item.sizes || !item.sizes.includes(selectedSize)) {
          return false;
        }
      }
      // In-stock Filter
      if (onlyInStock && item.stock <= 0) {
        return false;
      }
      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchTag = item.tagline.toLowerCase().includes(query);
        const matchCategory = item.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchTag && !matchCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'gsm-desc') return b.gsm - a.gsm;
      return 0; // default featured
    });
  }, [selectedCategory, selectedGsm, selectedSize, onlyInStock, searchQuery, sortBy]);

  const handleResetFilters = () => {
    playClick();
    setSelectedCategory('all');
    setSelectedGsm('all');
    setSelectedSize('all');
    setSortBy('featured');
    setOnlyInStock(false);
    if (onCategoryChange) onCategoryChange('all');
  };

  // Determine grid class
  const getGridClass = () => {
    if (gridCols === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8';
    if (gridCols === 4) return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8';
  };

  return (
    <section id="catalog" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Header Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#C5A880] text-xs font-mono tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTUMN / WINTER 2026 HEAVYWEIGHT SERIES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display mb-4">
          THE T-SHIRT <span className="shimmer-text">CATALOG</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base font-light">
          Sculpted boxy & oversized silhouettes crafted from 280 to 360 GSM combed cotton. Click on any tee to view full technical specifications, sizing breakdown, and angle galleries.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        selectedGsm={selectedGsm}
        onSelectGsm={(gsm) => {
          playClick(1400);
          setSelectedGsm(gsm);
        }}
        selectedSize={selectedSize}
        onSelectSize={(sz) => {
          playClick(1400);
          setSelectedSize(sz);
        }}
        sortBy={sortBy}
        onSelectSort={(sort) => {
          playClick(1200);
          setSortBy(sort);
        }}
        onlyInStock={onlyInStock}
        onToggleInStock={(stock) => {
          playClick(1300);
          setOnlyInStock(stock);
        }}
        totalResults={filteredProducts.length}
      />

      {/* Grid View Column Selector (Desktop) */}
      <div className="hidden lg:flex items-center justify-end gap-1 mb-6 text-xs font-mono text-slate-400">
        <span className="mr-2">GRID:</span>
        <button
          onClick={() => {
            playClick();
            setGridCols(2);
          }}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            gridCols === 2 ? 'bg-white text-black border-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="2 Column Grid"
        >
          <Grid2X2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            playClick();
            setGridCols(3);
          }}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            gridCols === 3 ? 'bg-white text-black border-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="3 Column Grid"
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            playClick();
            setGridCols(4);
          }}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            gridCols === 4 ? 'bg-white text-black border-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="4 Column Grid"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div
          key={`${selectedCategory}-${selectedGsm}-${selectedSize}-${sortBy}-${onlyInStock}-${gridCols}`}
          className={`${getGridClass()} animate-fadeIn`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#10121A] p-12 rounded-3xl text-center max-w-md mx-auto my-12 border border-slate-800 animate-fadeIn">
          <PackageSearch className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
            No T-Shirts Found
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-light">
            We couldn't find any t-shirts matching your active filter criteria. Try resetting your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </section>
  );
}
