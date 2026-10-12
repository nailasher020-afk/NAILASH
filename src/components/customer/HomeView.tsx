import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const HomeView: React.FC = () => {
  const {
    products,
    setActiveView,
    setSelectedProductId,
    setSelectedCategory,
    toggleWishlist,
    isInWishlist,
    addToCart,
    showToast
  } = useStore();

  const publishedProducts = products.filter((p) => p.status === 'published');
  const featuredProducts = publishedProducts.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = publishedProducts.filter((p) => p.isBestSeller).slice(0, 4);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setActiveView('shop');
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
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[680px] flex items-center bg-[#292623] overflow-hidden">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0">
          <img
            src="/assets/hero_fashion_editorial.jpg"
            alt="Nailash Haute Couture Editorial"
            className="w-full h-full object-cover object-center opacity-80 filter brightness-95"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.dataset.triedFallback !== 'true') {
                target.dataset.triedFallback = 'true';
                target.src = fallbackProductImage;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-xl space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#DB9558] font-semibold block">
              Spring / Summer 2026 Collection
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-title font-semibold text-[#FCF9EA] leading-[1.15] text-balance">
              Elegance, Made for You
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed">
              Discover timeless fashion crafted with comfort, quality and grace. Handcrafted pure lawn, silk organza, and bespoke contemporary couture.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setActiveView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-[#DB9558] text-stone-900 text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#c68246] transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActiveView('new-arrivals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 border border-[#FCF9EA]/50 text-[#FCF9EA] text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#FCF9EA]/10 backdrop-blur-xs transition-all flex items-center justify-center cursor-pointer"
              >
                Explore New Arrivals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Cards: Women, Men, New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
            Curated Categories
          </span>
          <h2 className="text-3xl font-serif-title font-semibold text-stone-900">
            Select Your Silhouette
          </h2>
          <p className="text-xs text-stone-500">
            From regal women’s festive ensembles to tailored raw silk menswear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Category: Women */}
          <div
            onClick={() => handleCategoryClick('Women')}
            className="group relative h-[440px] rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src="/assets/cat_women_collection.jpg"
              alt="Women’s Pret & Festive Collection"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.dataset.triedFallback !== 'true') {
                  target.dataset.triedFallback = 'true';
                  target.src = fallbackProductImage;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#DB9558] font-medium">
                Atelier Pret & Formals
              </span>
              <h3 className="text-2xl font-serif-title font-semibold text-white flex items-center justify-between">
                <span>Women</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </h3>
              <p className="text-xs text-stone-300">Embroidered lawn, organza kalidars, raw silk</p>
            </div>
          </div>

          {/* Category: Men */}
          <div
            onClick={() => handleCategoryClick('Men')}
            className="group relative h-[440px] rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src="/assets/cat_men_collection.jpg"
              alt="Men’s Traditional & Tailored Collection"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.dataset.triedFallback !== 'true') {
                  target.dataset.triedFallback = 'true';
                  target.src = fallbackProductImage;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#97A87A] font-medium">
                Tailored Heritage
              </span>
              <h3 className="text-2xl font-serif-title font-semibold text-white flex items-center justify-between">
                <span>Men</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </h3>
              <p className="text-xs text-stone-300">Raw silk kurtas, prince coats & formal waistcoats</p>
            </div>
          </div>

          {/* Category: New Arrivals */}
          <div
            onClick={() => {
              setActiveView('new-arrivals');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative h-[440px] rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src="/assets/cat_new_arrivals.jpg"
              alt="New Season Arrivals"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.dataset.triedFallback !== 'true') {
                  target.dataset.triedFallback = 'true';
                  target.src = fallbackProductImage;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#A8BBA3] font-medium">
                Fresh From The Atelier
              </span>
              <h3 className="text-2xl font-serif-title font-semibold text-white flex items-center justify-between">
                <span>New Arrivals</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </h3>
              <p className="text-xs text-stone-300">Exclusive limited runs & heirloom threadcraft</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold block mb-1">
              Signature Ensembles
            </span>
            <h2 className="text-3xl font-serif-title font-semibold text-stone-900">
              Featured Creations
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setActiveView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-[#97A87A] hover:text-[#7f8f65] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
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
                {/* Product Image */}
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

                  {/* Wishlist Button */}
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

                  {/* Discount / Low stock badge */}
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

                  {/* Quick Add Overlay */}
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

                {/* Details */}
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

                  {/* Color Swatches */}
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

                  {/* Pricing */}
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
      </section>

      {/* 4. Promotional Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xl overflow-hidden bg-stone-900 min-h-[380px] flex items-center">
          <img
            src="/assets/banner_promotional_silk.jpg"
            alt="Artisanal Silk Campaign"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.dataset.triedFallback !== 'true') {
                target.dataset.triedFallback = 'true';
                target.src = fallbackProductImage;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />

          <div className="relative z-10 max-w-lg p-8 sm:p-12 text-[#FCF9EA] space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#DB9558]">
              Special Atelier Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-title font-semibold text-white leading-tight">
              Artisanal Silk & Festive Organza
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              Enjoy 10% off your first festive couture or pret ensemble. Use code <span className="font-mono text-[#DB9558] font-bold">ELEGANCE10</span> at checkout.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('Women');
                  setActiveView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#DB9558] text-stone-900 text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#c88243] transition-colors"
              >
                Shop Festive Pret
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#97A87A] font-semibold block mb-1">
              Most Adored
            </span>
            <h2 className="text-3xl font-serif-title font-semibold text-stone-900">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-3 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-[#DB9558] hover:text-[#b8763f] flex items-center gap-1.5 transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => {
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
                    className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:scale-110 transition-transform ${
                      isWish ? 'text-rose-500 fill-rose-500' : 'text-stone-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
                  </button>

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
      </section>

      {/* 6. Brand Story & Craftsmanship Note */}
      <section className="bg-[#f3eed5]/50 border-y border-stone-200/80 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <div className="inline-flex p-2 bg-[#97A87A]/20 text-[#97A87A] rounded-full">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-title font-semibold text-stone-900">
            The Philosophy of Nailash
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light">
            Founded with an enduring reverence for South Asian sartorial heritage, Nailash weaves traditional marodi, resham, and tilla embroidery into contemporary, fluid silhouettes. Every motif tells an ancestral story of grace, balance, and quiet majesty.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs uppercase tracking-widest font-semibold text-[#DB9558] hover:underline"
            >
              Read Our Atelier Story →
            </button>
          </div>
        </div>
      </section>

      {/* 7. Newsletter Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
          Join The Nailash Circle
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif-title font-semibold text-stone-900">
          Privileged Access & Private Drops
        </h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Subscribe for early invitation to seasonal previews, private atelier appointments, and exclusive invitations.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast('Thank you for subscribing to Nailash updates!', 'success');
          }}
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:border-[#DB9558]"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-stone-900 text-[#FCF9EA] text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};
