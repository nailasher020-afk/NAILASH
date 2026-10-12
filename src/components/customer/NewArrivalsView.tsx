import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const NewArrivalsView: React.FC = () => {
  const {
    products,
    setSelectedProductId,
    setActiveView,
    toggleWishlist,
    isInWishlist,
    addToCart,
    showToast
  } = useStore();

  const newProducts = products.filter((p) => p.status === 'published' && p.isNewArrival);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden bg-stone-900 min-h-[300px] flex items-center p-8 sm:p-12">
        <img
          src="/assets/cat_new_arrivals.jpg"
          alt="New Season"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.dataset.triedFallback !== 'true') {
              target.dataset.triedFallback = 'true';
              target.src = fallbackProductImage;
            }
          }}
        />
        <div className="relative z-10 max-w-lg space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
            Seasonal Premier
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-title font-semibold text-white">
            New Season Arrivals 2026
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            Freshly finished pieces right off the embroidery frames. Featuring whisper-soft organza dupattas, pure pima lawn, and structured silk menswear.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newProducts.map((product) => {
          const isWish = isInWishlist(product.id);
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
                  className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:scale-110 transition-transform ${
                    isWish ? 'text-rose-500 fill-rose-500' : 'text-stone-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
                </button>

                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="w-full py-2 bg-stone-900/90 text-white text-xs uppercase tracking-wider font-semibold rounded backdrop-blur-xs hover:bg-stone-950 transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
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
    </div>
  );
};
