import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Package, ArrowRight, Clock, CheckCircle2, AlertTriangle, Truck, Search } from 'lucide-react';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const MyOrdersView: React.FC = () => {
  const { orders, currentUser, setActiveView, setSelectedOrderId } = useStore();
  const [lookupQuery, setLookupQuery] = useState('');

  // Get local client order IDs placed on this device
  let clientOrderIds: string[] = [];
  try {
    clientOrderIds = JSON.parse(localStorage.getItem('nailash_my_orders') || '[]');
  } catch {
    clientOrderIds = [];
  }
  const lastCustomerEmail = localStorage.getItem('nailash_last_customer_email')?.toLowerCase() || '';

  // Filter orders strictly for the customer:
  // 1. If customer is authenticated, match their account email
  // 2. If guest, match orders placed from this device (nailash_my_orders) or last entered email
  // 3. If lookupQuery entered, filter by exact order ID or customer email
  const userOrders = orders.filter((o) => {
    if (lookupQuery.trim()) {
      const q = lookupQuery.trim().toLowerCase();
      return o.id.toLowerCase() === q || o.customer.email.toLowerCase() === q;
    }

    if (currentUser) {
      return o.customer.email.toLowerCase() === currentUser.email.toLowerCase();
    }

    // Guest: only show orders placed by this customer
    return (
      clientOrderIds.includes(o.id) ||
      (lastCustomerEmail && o.customer.email.toLowerCase() === lastCustomerEmail)
    );
  });

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveView('order-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold block mb-1">
            Client Order Tracking
          </span>
          <h1 className="text-3xl font-serif-title font-semibold text-stone-900">
            My Orders ({userOrders.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track your order status, delivery progress, and download official tax invoices.
          </p>
        </div>

        {currentUser ? (
          <span className="text-xs text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
            Logged in as: <strong className="text-stone-800">{currentUser.name}</strong> ({currentUser.email})
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Have an account?</span>
            <button
              onClick={() => setActiveView('login')}
              className="text-xs font-semibold text-[#8c5220] hover:underline"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Guest order lookup tool */}
      {!currentUser && (
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-600">
            <strong>Track a specific order:</strong> Enter your Order ID (e.g. NL-2026-645307) or email:
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter Order ID or Email..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#DB9558]"
            />
          </div>
        </div>
      )}

      {userOrders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-lg border border-stone-200 space-y-4">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif-title text-xl text-stone-700">No Orders Found</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {lookupQuery
              ? `No matching order found for "${lookupQuery}". Please check your Order ID or contact support.`
              : 'You have not placed any orders yet on this device. Explore our luxury pret collection.'}
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="px-6 py-2.5 bg-[#97A87A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#839367] cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-stone-200/80 p-5 sm:p-6 shadow-xs hover:border-[#DB9558]/50 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
                    <span
                      className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#DB9558]/15 text-[#8f5321]'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Placed {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} · Payment: <strong className="text-stone-800">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'JazzCash'}</strong> ({order.paymentStatus === 'paid' ? <span className="font-semibold uppercase text-emerald-700">Paid</span> : order.paymentMethod === 'cod' ? <span className="font-semibold text-emerald-700">Pay on Delivery</span> : <span className="font-semibold uppercase text-amber-700">Pending Verification</span>})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">Total Amount</span>
                    <span className="font-mono font-bold text-stone-900 text-sm tabular-nums">
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="px-3.5 py-2 bg-stone-900 text-[#FCF9EA] text-xs font-semibold rounded hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Track & Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Items Thumbnails */}
              <div className="flex items-center gap-4 overflow-x-auto pb-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 shrink-0 bg-[#FCF9EA]/50 p-2 rounded border border-stone-200/60">
                    <img
                      src={normalizeAssetUrl(item.image)}
                      alt=""
                      className="w-10 h-12 object-cover rounded bg-stone-100"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.dataset.triedFallback !== 'true') {
                          target.dataset.triedFallback = 'true';
                          target.src = fallbackProductImage;
                        }
                      }}
                    />
                    <div className="text-xs">
                      <p className="font-medium text-stone-800 line-clamp-1 max-w-[140px]">{item.productName}</p>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {item.colorName} · {item.size} · x{item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
