import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, Printer, ArrowRight, ShoppingBag, Truck, Clock } from 'lucide-react';
import { InvoiceModal } from '../common/InvoiceModal';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const OrderSuccessView: React.FC = () => {
  const { orders, selectedOrderId, setActiveView, setSelectedOrderId } = useStore();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p>No active order found.</p>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-4 px-4 py-2 bg-[#97A87A] text-white rounded text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      {/* Thank you card */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-8 sm:p-10 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#97A87A]/15 text-[#97A87A] flex items-center justify-center">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#97A87A] font-bold">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-stone-900">
            Thank you for shopping with Nailash.
          </h1>
          <p className="text-xs text-stone-500 pt-1">
            Your sartorial order has been received by our atelier.
          </p>
        </div>

        <div className="p-4 bg-[#FCF9EA] border border-stone-200 rounded-lg inline-block text-left text-xs space-y-1.5 w-full max-w-md">
          <div className="flex items-center justify-between gap-4">
            <span className="text-stone-500">Official Order ID:</span>
            <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-stone-500">Payment Method:</span>
            <span className="font-semibold text-stone-800">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'JazzCash Mobile Account'}
            </span>
          </div>

          {order.paymentMethod === 'cod' ? (
            <div className="flex items-start justify-between gap-4 pt-1 border-t border-stone-200/60">
              <span className="text-stone-500 shrink-0">Payment:</span>
              <span className="font-medium text-emerald-800 text-right">
                Cash will be collected at the time of delivery.
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-stone-200/60">
              <span className="text-stone-500">Payment Status:</span>
              <span
                className={`font-semibold uppercase ${
                  order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'failed' ? 'Failed' : order.paymentStatus === 'refunded' ? 'Refunded' : 'Pending Verification'}
              </span>
            </div>
          )}

          {order.paidAt && (
            <div className="flex items-center justify-between gap-4 text-emerald-700 pt-1 border-t border-stone-200/60">
              <span className="text-stone-500">Payment Received:</span>
              <span className="font-semibold">{new Date(order.paidAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 text-[#FCF9EA] text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>View & Print Official Invoice</span>
          </button>

          <button
            onClick={() => {
              setSelectedOrderId(order.id);
              setActiveView('order-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#97A87A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#839367] transition-colors flex items-center justify-center gap-2"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Order Timeline</span>
          </button>
        </div>
      </div>

      {/* Item Summary Preview */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-2">
          Ordered Garments ({order.items.length})
        </h3>
        <div className="divide-y divide-stone-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={normalizeAssetUrl(item.image)}
                  alt=""
                  className="w-12 h-14 object-cover rounded bg-stone-100"
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
                  <p className="font-semibold text-stone-900">{item.productName}</p>
                  <p className="text-[11px] text-stone-500">
                    Color: {item.colorName} · Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-stone-900 tabular-nums">
                Rs. {item.subtotal.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline text-xs">
          <span className="font-semibold text-stone-800 uppercase">Grand Total:</span>
          <span className="font-mono text-base font-bold text-[#DB9558]">
            Rs. {order.total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => setActiveView('shop')}
          className="text-xs text-stone-600 hover:text-[#DB9558] underline font-medium"
        >
          ← Continue Exploring Collections
        </button>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
