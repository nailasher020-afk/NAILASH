import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, Printer, CheckCircle2, Clock, Package, Truck, Home, AlertCircle } from 'lucide-react';
import { InvoiceModal } from '../common/InvoiceModal';
import { OrderStatus } from '../../types';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const OrderDetailsView: React.FC = () => {
  const { orders, selectedOrderId, setActiveView } = useStore();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p>Order not found.</p>
        <button
          onClick={() => setActiveView('my-orders')}
          className="mt-4 px-4 py-2 bg-[#97A87A] text-white rounded text-xs"
        >
          View My Orders
        </button>
      </div>
    );
  }

  // Visual Timeline Steps
  const timelineSteps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { status: 'processing', label: 'In Atelier', icon: Package },
    { status: 'packed', label: 'Custom Boxed', icon: Package },
    { status: 'shipped', label: 'Dispatched', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Home }
  ];

  const currentStepIdx = timelineSteps.findIndex((s) => s.status === order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <button
            onClick={() => setActiveView('my-orders')}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Order History</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-stone-900">
              Order {order.id}
            </h1>
            <span
              className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded ${
                order.orderStatus === 'delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.orderStatus === 'cancelled'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-[#DB9558]/20 text-[#8e5220]'
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <button
          onClick={() => setIsInvoiceOpen(true)}
          className="px-4 py-2 bg-stone-900 text-[#FCF9EA] text-xs font-semibold rounded hover:bg-stone-800 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Official Tax Invoice</span>
        </button>
      </div>

      {/* Visual Tracking Timeline */}
      {order.orderStatus !== 'cancelled' && order.orderStatus !== 'returned' && (
        <div className="bg-white p-6 rounded-lg border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Fulfillment Journey
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
            {timelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isPastOrCurrent = currentStepIdx >= idx;
              const isCurrent = order.orderStatus === step.status;

              return (
                <div key={step.status} className="flex flex-col items-center text-center space-y-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-[#DB9558] text-white ring-4 ring-[#DB9558]/20'
                        : isPastOrCurrent
                        ? 'bg-[#97A87A] text-white'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      isCurrent
                        ? 'text-[#DB9558] font-bold'
                        : isPastOrCurrent
                        ? 'text-stone-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Timeline Audit Logs */}
          <div className="border-t border-stone-100 pt-4 space-y-2">
            <h3 className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
              Live Activity Log
            </h3>
            <div className="space-y-1.5 text-xs text-stone-600">
              {order.timeline.map((entry, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-stone-400 text-[10px] font-mono shrink-0 mt-0.5">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>
                    <strong className="text-stone-800 uppercase text-[10px]">{entry.status}</strong>: {entry.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customer & Payment Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 space-y-2 text-xs">
          <h3 className="font-semibold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-2">
            Delivery Destination
          </h3>
          <p className="font-bold text-stone-900 text-sm">{order.customer.fullName}</p>
          <p className="text-stone-600">{order.customer.phone} · {order.customer.email}</p>
          <p className="text-stone-700 pt-1 leading-relaxed">
            {order.customer.address}, {order.customer.area}, {order.customer.city} - {order.customer.postalCode}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200/80 space-y-2 text-xs">
          <h3 className="font-semibold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-2">
            Payment Records
          </h3>
          <div className="flex justify-between">
            <span className="text-stone-500">Method:</span>
            <span className="font-semibold text-stone-800 uppercase">
              {order.paymentMethod === 'jazzcash' ? 'JazzCash Mobile Account' : 'Cash on Delivery'}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-stone-500">Status:</span>
            {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid' ? (
              <span className="font-semibold text-emerald-800 text-right">
                Cash will be collected at the time of delivery
              </span>
            ) : (
              <span
                className={`font-semibold uppercase ${
                  order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'failed' ? 'Failed' : order.paymentStatus === 'refunded' ? 'Refunded' : 'Pending Verification'}
              </span>
            )}
          </div>
          {order.paidAt && (
            <div className="flex justify-between text-emerald-700 pt-1 border-t border-stone-100">
              <span className="text-stone-500">Payment Received:</span>
              <span className="font-semibold text-emerald-800">{new Date(order.paidAt).toLocaleString()}</span>
            </div>
          )}
          {order.jazzCashReference && (
            <div className="flex justify-between">
              <span className="text-stone-500">Reference / TID:</span>
              <span className="font-mono text-stone-800 font-bold">{order.jazzCashReference}</span>
            </div>
          )}
          {order.jazzCashPhone && (
            <div className="flex justify-between">
              <span className="text-stone-500">Sender Number:</span>
              <span className="font-mono text-stone-800">{order.jazzCashPhone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg border border-stone-200/80 p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-2">
          Garments in Package ({order.items.length})
        </h3>
        <div className="divide-y divide-stone-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={normalizeAssetUrl(item.image)}
                  alt=""
                  className="w-14 h-16 object-cover rounded bg-stone-100 shrink-0"
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
                  <h4 className="font-semibold text-stone-900 text-sm">{item.productName}</h4>
                  <p className="text-stone-500">
                    Color: {item.colorName} · Size: <strong className="text-stone-700">{item.size}</strong> · Qty: {item.quantity}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">SKU: {item.sku}</p>
                </div>
              </div>
              <span className="font-mono font-bold text-stone-900 tabular-nums">
                Rs. {item.subtotal.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Calculation summary */}
        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-mono text-stone-900">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span className="font-mono">- Rs. {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee:</span>
              <span className="font-mono text-stone-900">
                {order.shippingFee === 0 ? 'Complimentary' : `Rs. ${order.shippingFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-200 pt-2">
              <span className="font-serif-title uppercase">Total Paid / Due:</span>
              <span className="font-mono text-[#DB9558]">
                Rs. {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
