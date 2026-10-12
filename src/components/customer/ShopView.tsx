import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Filter, SlidersHorizontal, Heart, ShoppingBag, X } from 'lucide-react';
import { ClothingSize, Product } from '../../types';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const ShopView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    setSelectedProductId,
    setActiveView,
    searchKeyword,
    setSearchKeyword,
    toggleWishlist,
    isInWishlist,
    addToCart,
    showToast
  } = useStore();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<ClothingSize | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract all categories and subcategories
  const categories = ['All', 'Women', 'Men'];
  const subcategories = ['Luxury Lawn', 'Festive Pret', 'Ready To Wear', 'Eastern Wear', 'Heritage Artisanal'];
  const sizes: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === 'published')
      .filter((p) => {
        // Category filter
        if (selectedCategory && selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // Subcategory filter
        if (selectedSubcategory && p.subcategory !== selectedSubcategory) {
          return false;
        }
        // Search keyword
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchSku && !matchTags) return false;
        }
        // Price filter
        const effPrice = p.salePrice ?? p.price;
        if (effPrice > priceRange) return false;

        // Size filter
        if (selectedSize) {
          const hasSize = p.colors.some((c) =>
            c.sizes.some((s) => s.size === selectedSize && s.stock > 0)
          );
          if (!hasSize) return false;
        }

        // In stock only
        if (inStockOnly) {
          const totalStock = p.colors.reduce(
            (acc, c) => acc + c.sizes.reduce((sum, s) => sum + s.stock, 0),
            0
          );
          if (totalStock <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice ?? a.price;
        const priceB = b.salePrice ?? b.price;
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSubcategory, searchKeyword, priceRange, selectedSize, inStockOnly, sortBy]);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setActiveView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultColor = product.colors[0];
    if (!defaultColor) return;
    const availableSize = defaultColor.sizes.find((s) => s.stock > 0);
    if (!availableSize) {
      showToast('This item is currently sold out in all sizes', 'error');
      return;
    }
    addToCart(product, defaultColor.name, defaultColor.hex, availableSize.size, 1);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedSize(null);
    setInStockOnly(false);
    setPriceRange(50000);
    setSearchKeyword('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Active Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold block mb-1">
            Nailash Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-stone-900">
            {selectedCategory ? `${selectedCategory} Collection` : 'All Apparel & Pret'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Displaying <span className="font-semibold text-stone-800">{filteredProducts.length}</span> luxury pieces
            {searchKeyword && ` matching "${searchKeyword}"`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-3 py-2 bg-white border border-stone-300 rounded text-xs font-medium flex items-center gap-2"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 rounded px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:border-[#DB9558]"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside
          className={`space-y-6 md:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-[#FCF9EA] p-4 md:p-0 rounded-lg md:rounded-none border md:border-none border-stone-200`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2 text-stone-800 font-semibold text-xs uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-[#DB9558]" />
              <span>Refine Selection</span>
            </div>
            {(selectedCategory || selectedSubcategory || selectedSize || inStockOnly || searchKeyword) && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#DB9558] hover:underline font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {/* Department / Category */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">Category</h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                    (cat === 'All' && !selectedCategory) || selectedCategory === cat
                      ? 'bg-[#97A87A]/20 text-[#2f421f] font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">Subcategory</h4>
            <div className="space-y-1">
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                    selectedSubcategory === sub
                      ? 'bg-[#DB9558]/20 text-[#8c5220] font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Clothing Size Filter */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">Size</h4>
            <div className="grid grid-cols-3 gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? null : s)}
                  className={`py-1 text-xs font-medium rounded border text-center transition-all ${
                    selectedSize === s
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'border-stone-300 text-stone-700 hover:border-stone-400 bg-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold uppercase tracking-wider text-stone-700">Max Price</span>
              <span className="font-mono tabular-nums text-stone-900 font-bold">
                Rs. {priceRange.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="50000"
              step="2500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#DB9558]"
            />
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-2 border-t border-stone-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#97A87A] w-4 h-4"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-white rounded-lg border border-stone-200/80">
              <p className="font-serif-title text-xl text-stone-700">No matching creations found</p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try widening your price range, clearing size filters, or searching for other fabric tags.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#97A87A] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#839367]"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWish = isInWishlist(product.id);
                const totalStock = product.colors.reduce(
                  (acc, c) => acc + c.sizes.reduce((sum, s) => sum + s.stock, 0),
                  0
                );

                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="group bg-white rounded-lg border border-stone-200/80 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                      <img
                        src={normalizeAssetUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.dataset.triedFallback !== 'true') {
                            target.dataset.triedFallback = 'true';
                            target.src = fallbackProductImage;
                          }
                        }}
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:scale-110 transition-transform ${
                          isWish ? 'text-rose-500 fill-rose-500' : 'text-stone-600'
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
                      </button>

                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.salePrice && product.discountPercentage && (
                          <span className="bg-[#DB9558] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                            -{product.discountPercentage}%
                          </span>
                        )}
                        {totalStock <= product.lowStockThreshold && totalStock > 0 && (
                          <span className="bg-amber-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                            Only {totalStock} Left
                          </span>
                        )}
                      </div>

                      <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="w-full py-2 bg-stone-900/90 text-white text-xs uppercase tracking-wider font-semibold rounded backdrop-blur-xs hover:bg-stone-950 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Quick Add</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span>{product.category}</span>
                          <span>·</span>
                          <span>{product.subcategory}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[#DB9558] transition-colors line-clamp-1 mt-1">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        {product.colors.map((c) => (
                          <span
                            key={c.id}
                            className="w-3.5 h-3.5 rounded-full border border-stone-300"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                        <span className="text-[11px] text-stone-400 ml-1">
                          {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 pt-1 border-t border-stone-100">
                        <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                          Rs. {(product.salePrice ?? product.price).toLocaleString()}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                            Rs. {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
