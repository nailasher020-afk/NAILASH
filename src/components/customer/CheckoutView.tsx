import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod, CustomerAddress } from '../../types';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotal,
    appliedCoupon,
    storeSettings,
    createOrder,
    setActiveView,
    setSelectedOrderId,
    currentUser,
    showToast
  } = useStore();

  // Form Fields
  const [formData, setFormData] = useState<CustomerAddress>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: 'House 14, Street 9, Model Town',
    city: 'Lahore',
    area: 'Model Town',
    postalCode: '54700'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('jazzcash');
  const [jazzCashPhone, setJazzCashPhone] = useState(currentUser?.phone || '');
  const [jazzCashReference, setJazzCashReference] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
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

  const shippingFee = cartTotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.defaultShippingFee;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif-title text-xl text-stone-800">Your bag is empty.</p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-6 py-2.5 bg-[#97A87A] text-white rounded text-xs uppercase tracking-wider font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.city) {
      showToast('Please fill in all required shipping fields', 'error');
      return;
    }

    if (paymentMethod === 'jazzcash' && (!jazzCashPhone || !jazzCashReference)) {
      showToast('Please enter your JazzCash sender mobile number and payment reference ID', 'error');
      return;
    }

    if (!agreeTerms) {
      showToast('Please accept the order terms & conditions to proceed', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        customer: formData,
        paymentMethod,
        jazzCashReference: paymentMethod === 'jazzcash' ? jazzCashReference : undefined,
        jazzCashPhone: paymentMethod === 'jazzcash' ? jazzCashPhone : undefined
      });

      if (order) {
        setSelectedOrderId(order.id);
        setActiveView('order-success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast('Unable to place order. Please review your cart.', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred while placing order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <button
        onClick={() => setActiveView('cart')}
        className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Shopping Bag</span>
      </button>

      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold block mb-1">
          Secure Atelier Checkout
        </span>
        <h1 className="text-3xl font-serif-title font-semibold text-stone-900">
          Delivery & Payment Details
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer & Delivery Address Card */}
          <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>1. Customer & Shipping Destination</span>
              <Truck className="w-4 h-4 text-[#97A87A]" />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-semibold mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="03XXXXXXXXX"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-semibold mb-1">
                  Street Address & House / Flat # <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House #, Street name, Sector / Block"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Area / Town / Locality
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. DHA, Gulberg, Clifton"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="e.g. 54000"
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800 focus:outline-none focus:border-[#DB9558]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>2. Payment Method</span>
              <ShieldCheck className="w-4 h-4 text-[#DB9558]" />
            </h2>

            <div className="space-y-3">
              {/* JazzCash Option */}
              <div
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-[#DB9558] bg-[#DB9558]/5 ring-1 ring-[#DB9558]'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'jazzcash'}
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="accent-[#DB9558]"
                    />
                    <div>
                      <span className="font-semibold text-stone-900 text-xs">
                        JazzCash Mobile Account & App Transfer
                      </span>
                      <p className="text-[11px] text-stone-500">
                        Instant mobile transfer to official Nailash corporate account.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#DB9558] bg-[#DB9558]/10 px-2 py-0.5 rounded">
                    Direct Gateway
                  </span>
                </div>

                {/* JazzCash Instructions & Inputs */}
                {paymentMethod === 'jazzcash' && (
                  <div className="mt-4 pt-4 border-t border-[#DB9558]/20 space-y-3 text-xs bg-white/70 p-3 rounded">
                    <div className="p-3 bg-stone-100 rounded text-stone-700 space-y-1">
                      <p className="font-semibold text-stone-900">How to pay via JazzCash:</p>
                      <p>
                        1. Open your JazzCash App or dial *786# and select <strong>Send Money → To Mobile Account</strong>.
                      </p>
                      <p>
                        2. Account Number: <strong className="font-mono text-[#DB9558]">{storeSettings.jazzCashMerchantNumber}</strong>
                      </p>
                      <p>
                        3. Account Title: <strong>{storeSettings.jazzCashAccountTitle}</strong>
                      </p>
                      <p>
                        4. Amount: <strong className="font-mono text-stone-900">Rs. {finalTotal.toLocaleString()}</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Sender JazzCash Mobile # <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required={paymentMethod === 'jazzcash'}
                          value={jazzCashPhone}
                          onChange={(e) => setJazzCashPhone(e.target.value)}
                          placeholder="e.g. 03001234567"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">
                          Payment Reference / TID <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={paymentMethod === 'jazzcash'}
                          value={jazzCashReference}
                          onChange={(e) => setJazzCashReference(e.target.value)}
                          placeholder="e.g. JC-9821849102"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-800 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Note: JazzCash order payment status will remain <strong>Pending</strong> until our finance desk verifies the transaction.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cash on Delivery Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-emerald-600"
                    />
                    <div>
                      <span className="font-semibold text-stone-900 text-xs">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-stone-500">
                        Cash will be collected at the time of delivery.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Pay at Doorstep
                  </span>
                </div>

                {/* COD Clear Confirmation & Information Banner */}
                {paymentMethod === 'cod' && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/80 space-y-2 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-950">
                          Cash on Delivery selected. You will pay in cash when your order is delivered.
                        </p>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          Payment Information: Cash will be collected at the time of delivery. No advance online payment is required.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary & Place Order CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3">
              Order Review ({cart.length} unique items)
            </h3>

            {/* Item list */}
            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={normalizeAssetUrl(item.image)}
                      alt=""
                      className="w-10 h-12 object-cover rounded bg-stone-100 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.dataset.triedFallback !== 'true') {
                          target.dataset.triedFallback = 'true';
                          target.src = fallbackProductImage;
                        }
                      }}
                    />
                    <div>
                      <p className="font-semibold text-stone-900 line-clamp-1">{item.productName}</p>
                      <p className="text-[11px] text-stone-500">
                        {item.colorName} · Size {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-medium text-stone-900 tabular-nums">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="border-t border-stone-200 pt-3 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-stone-900">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono">- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-mono text-stone-900">
                  {shippingFee === 0 ? 'Complimentary' : `Rs. ${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline font-bold text-stone-900 text-sm">
                <span className="font-serif-title uppercase">Total Payable:</span>
                <span className="font-mono text-lg text-[#DB9558]">
                  Rs. {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-stone-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded accent-[#DB9558] mt-0.5"
                />
                <span>
                  I have read and agree to Nailash website terms, shipping guidelines, and return policy.
                </span>
              </label>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#DB9558] hover:bg-[#c68246] text-stone-950 font-semibold text-xs uppercase tracking-widest rounded transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Generating Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Order (Rs. {finalTotal.toLocaleString()})</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-400 text-center italic">
              A bespoke order confirmation and printable invoice will be generated immediately.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
