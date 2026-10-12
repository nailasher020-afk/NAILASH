import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag, X } from 'lucide-react';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    storeSettings,
    appliedCoupon,
    applyCouponCode,
    removeAppliedCoupon,
    setActiveView
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Shipping threshold calculation
  const freeThreshold = storeSettings.freeShippingThreshold;
  const remainingForFree = Math.max(0, freeThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeThreshold) * 100));

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartTotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const shippingFee = cartTotal >= freeThreshold ? 0 : storeSettings.defaultShippingFee;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#f4efd8] flex items-center justify-center text-[#DB9558]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif-title font-semibold text-stone-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Explore our handcrafted lawn, raw silk tunics, and royal wedding formals.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-7 py-3.5 bg-[#97A87A] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#839367] transition-colors"
        >
          Explore Collections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-4 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold block mb-1">
            Shopping Bag
          </span>
          <h1 className="text-3xl font-serif-title font-semibold text-stone-900">
            Review Selected Pieces ({cartCount})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-stone-700 underline"
        >
          Empty Bag
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-2">
        <div className="flex justify-between items-center text-xs">
          {remainingForFree > 0 ? (
            <span className="text-stone-700 font-medium">
              Add <span className="font-bold text-[#DB9558] font-mono">Rs. {remainingForFree.toLocaleString()}</span> more for <span className="font-semibold text-[#97A87A]">Complimentary Nationwide Express Shipping</span>!
            </span>
          ) : (
            <span className="text-[#97A87A] font-semibold flex items-center gap-1.5">
              <span>🎉 Congratulations! Your order qualifies for Complimentary Nationwide Delivery.</span>
            </span>
          )}
          <span className="font-mono text-stone-500">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#97A87A] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-stone-200 bg-white rounded-lg border border-stone-200/80 overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={normalizeAssetUrl(item.image)}
                    alt={item.productName}
                    className="w-20 h-24 object-cover rounded bg-stone-100 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.dataset.triedFallback !== 'true') {
                        target.dataset.triedFallback = 'true';
                        target.src = fallbackProductImage;
                      }
                    }}
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-mono">SKU: {item.sku}</span>
                    <h3 className="text-sm font-semibold text-stone-900">{item.productName}</h3>
                    <div className="flex items-center gap-3 text-xs text-stone-600">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <span>{item.colorName}</span>
                      </span>
                      <span>·</span>
                      <span>Size: <strong className="text-stone-800">{item.size}</strong></span>
                    </div>
                    <p className="text-xs font-mono font-bold text-stone-900 pt-1">
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Steppers & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden text-xs">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold font-mono text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-sm font-bold font-mono text-stone-900 tabular-nums block">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 mt-1 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveView('shop')}
              className="text-xs text-stone-600 hover:text-[#DB9558] underline font-medium"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* Right: Summary & Checkout (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Input */}
          <div className="bg-white p-5 rounded-lg border border-stone-200/80 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#DB9558]" />
              <span>Promo Code or Atelier Voucher</span>
            </span>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-800">{appliedCoupon.code}</span>
                  <span className="text-emerald-700 block text-[11px]">
                    {appliedCoupon.discountType === 'percentage'
                      ? `${appliedCoupon.discountValue}% discount applied`
                      : `Rs. ${appliedCoupon.discountValue} voucher applied`}
                  </span>
                </div>
                <button
                  onClick={removeAppliedCoupon}
                  className="p-1 text-stone-400 hover:text-stone-700"
                  aria-label="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. ELEGANCE10"
                  className="flex-1 px-3 py-2 bg-[#FCF9EA]/50 border border-stone-300 rounded text-xs font-mono uppercase focus:outline-none focus:border-[#DB9558]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-800 transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
          </div>

          {/* Cost Summary Box */}
          <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-medium text-stone-900">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({appliedCoupon?.code}):</span>
                  <span className="font-mono font-medium">
                    - Rs. {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping:</span>
                <span className="font-mono font-medium text-stone-900">
                  {shippingFee === 0 ? (
                    <span className="text-[#97A87A] font-semibold">Complimentary</span>
                  ) : (
                    `Rs. ${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-stone-900 uppercase tracking-wide block">
                  Grand Total
                </span>
                <span className="text-[10px] text-stone-400">Includes all federal and provincial taxes</span>
              </div>
              <span className="text-xl font-mono font-bold text-[#DB9558]">
                Rs. {finalTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveView('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 bg-[#97A87A] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#839367] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-[#97A87A]" />
              <span>Safe & Secure Checkout via JazzCash or COD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
