import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setActiveView,
    setSelectedProductId,
    showToast
  } = useStore();

  const wishlistedProducts = products.filter((p) =>
    wishlist.some((w) => w.productId === p.id)
  );

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setActiveView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMoveToBag = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultColor = product.colors[0];
    if (!defaultColor) return;
    const availableSize = defaultColor.sizes.find((s) => s.stock > 0);
    if (!availableSize) {
      showToast('This item is currently sold out in all sizes', 'error');
      return;
    }
    addToCart(product, defaultColor.name, defaultColor.hex, availableSize.size, 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold block mb-1">
          Saved Favorites
        </span>
        <h1 className="text-3xl font-serif-title font-semibold text-stone-900">
          My Wishlist ({wishlistedProducts.length})
        </h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-lg border border-stone-200 space-y-4">
          <Heart className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="font-serif-title text-xl text-stone-800">Your Wishlist is Empty</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Save pieces you love while browsing to purchase later.
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="px-6 py-2.5 bg-[#97A87A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#839367]"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
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
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 shadow-sm hover:scale-110 transition-transform"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest">{product.category}</span>
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[#DB9558] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 pt-1 border-t border-stone-100">
                  <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                    Rs. {(product.salePrice ?? product.price).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={(e) => handleMoveToBag(e, product)}
                  className="w-full py-2 bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
