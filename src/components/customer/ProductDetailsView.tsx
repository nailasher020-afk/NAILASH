import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Heart,
  ShoppingBag,
  Share2,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Play,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ClothingSize } from '../../types';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const ProductDetailsView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    submitReview,
    setActiveView,
    showToast
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorName, setSelectedColorName] = useState(
    product.colors[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<ClothingSize>('M');
  const [quantity, setQuantity] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Accordion state
  const [openSection, setOpenSection] = useState<'fabric' | 'care' | 'shipping' | null>(
    'fabric'
  );

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Product not found.</p>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-4 px-4 py-2 bg-[#97A87A] text-white rounded text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isWish = isInWishlist(product.id);
  const currentColor = product.colors.find((c) => c.name === selectedColorName) || product.colors[0];
  const currentSizeObj = currentColor?.sizes.find((s) => s.size === selectedSize);
  const currentStock = currentSizeObj?.stock ?? 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= product.lowStockThreshold;

  // Reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );
  const avgRating =
    productReviews.length > 0
      ? (
          productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        ).toFixed(1)
      : '5.0';

  const handleAddToCart = () => {
    if (!currentColor) return;
    if (isOutOfStock) {
      showToast('Selected size is currently out of stock', 'error');
      return;
    }
    addToCart(product, currentColor.name, currentColor.hex, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!currentColor) return;
    if (isOutOfStock) {
      showToast('Selected size is currently out of stock', 'error');
      return;
    }
    const success = addToCart(product, currentColor.name, currentColor.hex, selectedSize, quantity);
    if (success) {
      setActiveView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      showToast('Please provide your name and review', 'error');
      return;
    }
    submitReview({
      productId: product.id,
      productName: product.name,
      customerName: reviewName,
      customerEmail: reviewEmail,
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="text-xs text-stone-500 flex items-center gap-2">
        <button onClick={() => setActiveView('home')} className="hover:text-[#DB9558]">
          Home
        </button>
        <span>/</span>
        <button onClick={() => setActiveView('shop')} className="hover:text-[#DB9558]">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-stone-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-sm">
            <img
              src={normalizeAssetUrl(product.images[activeImageIndex] || product.images[0])}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.dataset.triedFallback !== 'true') {
                  target.dataset.triedFallback = 'true';
                  target.src = fallbackProductImage;
                }
              }}
            />

            {/* Video preview button if available */}
            {product.videoUrl && (
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="absolute bottom-4 right-4 px-3 py-2 bg-stone-900/80 hover:bg-stone-950 text-white rounded backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch Editorial Reel</span>
              </button>
            )}

            {/* Discount Badge */}
            {product.discountPercentage && (
              <span className="absolute top-4 left-4 bg-[#DB9558] text-white text-xs font-bold px-2.5 py-1 rounded">
                Save {product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded border-2 overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#DB9558] shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={normalizeAssetUrl(img)}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.dataset.triedFallback !== 'true') {
                        target.dataset.triedFallback = 'true';
                        target.src = fallbackProductImage;
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Purchase Module (5 cols - Sticky) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & SKU */}
          <div className="border-b border-stone-200 pb-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-mono">SKU: {product.sku}</span>
              <div className="flex items-center gap-1 text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold text-stone-800">{avgRating}</span>
                <span className="text-stone-400">({productReviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-stone-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-stone-600 leading-relaxed">{product.shortDescription}</p>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                Rs. {(product.salePrice ?? product.price).toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-sm font-mono text-stone-400 line-through tabular-nums">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
              <span className="text-[11px] text-[#97A87A] font-semibold">Taxes Included</span>
            </div>
          </div>

          {/* Color Selection with individual stock info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold uppercase tracking-wider text-stone-700">
                Color Shade: <span className="font-normal text-stone-900">{selectedColorName}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorName(color.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    selectedColorName === color.name
                      ? 'border-[#DB9558] bg-[#DB9558]/10 text-stone-900 font-semibold shadow-xs'
                      : 'border-stone-300 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection with individual real-time stock */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold uppercase tracking-wider text-stone-700">
                Garment Size: <span className="font-normal text-stone-900">{selectedSize}</span>
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[#DB9558] hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as ClothingSize[]).map((sz) => {
                const stockObj = currentColor?.sizes.find((s) => s.size === sz);
                const sStock = stockObj?.stock ?? 0;
                const isSelected = selectedSize === sz;
                const isSzOutOfStock = sStock === 0;

                return (
                  <button
                    key={sz}
                    disabled={isSzOutOfStock}
                    onClick={() => {
                      setSelectedSize(sz);
                      setQuantity(1);
                    }}
                    className={`py-2.5 rounded border text-center text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                      isSzOutOfStock
                        ? 'border-stone-200 text-stone-300 bg-stone-50 cursor-not-allowed line-through'
                        : isSelected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-300 text-stone-800 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <span>{sz}</span>
                    <span className="text-[9px] font-mono tabular-nums opacity-80">
                      {isSzOutOfStock ? '0' : `${sStock} left`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Stock Notice */}
            <div className="text-xs pt-1">
              {isOutOfStock ? (
                <span className="text-rose-600 font-semibold">
                  Out of Stock in {selectedColorName} ({selectedSize})
                </span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-semibold">
                  Urgent: Only {currentStock} units remaining in {selectedSize}!
                </span>
              ) : (
                <span className="text-[#97A87A] font-medium">
                  In Stock ({currentStock} available in atelier)
                </span>
              )}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold font-mono text-stone-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded border border-stone-300 hover:border-stone-400 transition-colors ${
                  isWish ? 'text-rose-500 fill-rose-500 bg-rose-50' : 'text-stone-700 bg-white'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  showToast('Product link copied to clipboard', 'info');
                }}
                className="p-2.5 rounded border border-stone-300 hover:border-stone-400 text-stone-700 bg-white transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="py-3.5 px-4 bg-[#97A87A] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#829267] disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="py-3.5 px-4 bg-[#DB9558] text-stone-950 text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#c98345] disabled:bg-stone-200 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Atelier Trust Badges */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-stone-200 text-center text-[11px] text-stone-600">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#DB9558]" />
              <span>Complimentary over Rs. 15,000</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#97A87A]" />
              <span>7 Days Exchange</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#A8BBA3]" />
              <span>100% Authentic Fabric</span>
            </div>
          </div>

          {/* Accordion Sections: Fabric, Care, Shipping */}
          <div className="border border-stone-200 rounded-lg divide-y divide-stone-200 bg-white">
            {/* Fabric Details */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'fabric' ? null : 'fabric')}
                className="w-full px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center justify-between"
              >
                <span>Fabric & Artisanal Details</span>
                {openSection === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'fabric' && (
                <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed space-y-2">
                  <p>{product.description}</p>
                  {product.fabric && (
                    <p className="font-medium text-stone-800">Composition: {product.fabric}</p>
                  )}
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'care' ? null : 'care')}
                className="w-full px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center justify-between"
              >
                <span>Care Instructions</span>
                {openSection === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'care' && (
                <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed">
                  <p>{product.careInstructions || 'Dry clean recommended. Store wrapped in tissue or breathable garment bags.'}</p>
                </div>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                className="w-full px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center justify-between"
              >
                <span>Shipping & Delivery Policy</span>
                {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'shipping' && (
                <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed space-y-1">
                  <p>Standard delivery across Pakistan takes 2-4 business days.</p>
                  <p>Same-day or next-day delivery available within Lahore & Karachi.</p>
                  <p>JazzCash and Cash on Delivery payments are fully supported.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-10 border-t border-stone-200 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
              Client Feedback
            </span>
            <h2 className="text-3xl font-serif-title font-semibold text-stone-900">
              Verified Client Reviews
            </h2>
          </div>
          <div className="flex items-center gap-2 text-stone-800">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold font-mono">{avgRating} out of 5</span>
            <span className="text-xs text-stone-400">({productReviews.length} verified ratings)</span>
          </div>
        </div>

        {/* Existing Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productReviews.length === 0 ? (
            <div className="p-6 bg-white rounded-lg border border-stone-200 text-xs text-stone-500">
              No approved reviews yet. Be the first to share your experience with this design!
            </div>
          ) : (
            productReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-white rounded-lg border border-stone-200/80 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">{rev.customerName}</span>
                  <span className="text-[10px] text-stone-400">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="bg-[#f7f4e4] p-6 sm:p-8 rounded-lg border border-stone-300/80 max-w-2xl space-y-4">
          <h3 className="text-lg font-serif-title font-semibold text-stone-900">
            Share Your Experience
          </h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-stone-300 hover:text-amber-500"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Mahnoor Tariq"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={reviewEmail}
                  onChange={(e) => setReviewEmail(e.target.value)}
                  placeholder="e.g. mahnoor@example.com"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Your Review</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe the fabric texture, embroidery details, fit, and stitching quality..."
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 text-white uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* Video Reel Modal */}
      {isVideoModalOpen && product.videoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-black rounded-lg overflow-hidden max-w-2xl w-full relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-black/50 hover:bg-black rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={product.videoUrl}
              autoPlay
              controls
              className="w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Sizing Chart Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full space-y-4 border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-serif-title font-semibold text-lg text-stone-900">
                Nailash Official Sizing Chart (Inches)
              </h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 font-semibold text-stone-500">
                    <th className="py-2">Size</th>
                    <th className="py-2">Bust / Chest</th>
                    <th className="py-2">Waist</th>
                    <th className="py-2">Hip</th>
                    <th className="py-2">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700 font-mono">
                  <tr>
                    <td className="py-2 font-bold font-sans">XS</td>
                    <td>34"</td>
                    <td>26"</td>
                    <td>36"</td>
                    <td>42"</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold font-sans">S</td>
                    <td>36"</td>
                    <td>28"</td>
                    <td>38"</td>
                    <td>43"</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold font-sans">M</td>
                    <td>38"</td>
                    <td>30"</td>
                    <td>40"</td>
                    <td>44"</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold font-sans">L</td>
                    <td>41"</td>
                    <td>33"</td>
                    <td>43"</td>
                    <td>45"</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold font-sans">XL</td>
                    <td>44"</td>
                    <td>36"</td>
                    <td>46"</td>
                    <td>45"</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold font-sans">XXL</td>
                    <td>47"</td>
                    <td>39"</td>
                    <td>49"</td>
                    <td>45"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-stone-400 italic">
              All garments are tailored with 1.5-inch inner seam allowance for custom bespoke alterations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
