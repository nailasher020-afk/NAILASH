import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentStatus } from '../../types';
import { CreditCard, CheckCircle2, XCircle, Clock, Search, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { orders, updatePaymentStatus, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'jazzcash' | 'cod'>('jazzcash');
  const [search, setSearch] = useState('');

  const jazzCashOrders = orders.filter((o) => o.paymentMethod === 'jazzcash');
  const codOrders = orders.filter((o) => o.paymentMethod === 'cod');

  const currentList = activeTab === 'jazzcash' ? jazzCashOrders : codOrders;

  const filtered = currentList.filter((o) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchRef = o.jazzCashReference?.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      if (!matchId && !matchRef && !matchName) return false;
    }
    return true;
  });

  const handleSetStatus = (orderId: string, status: PaymentStatus) => {
    updatePaymentStatus(orderId, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Financial Settlements
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Payment Verification & Gateways
          </h1>
          <p className="text-xs text-stone-500">
            Reconcile incoming JazzCash transaction references (TID) and COD courier cash returns.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('jazzcash')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'jazzcash'
              ? 'border-[#DB9558] text-[#DB9558]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>JazzCash Mobile Transfers ({jazzCashOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cod')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'cod'
              ? 'border-[#97A87A] text-[#97A87A]'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Cash on Delivery Logistics ({codOrders.length})</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-stone-200">
        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by TID reference, order ID, client..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FCF9EA]/40 border border-stone-300 rounded text-xs text-stone-800"
          />
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 font-semibold text-stone-400 uppercase tracking-wider bg-stone-50">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                {activeTab === 'jazzcash' && <th className="py-3 px-2">JazzCash Reference (TID)</th>}
                {activeTab === 'jazzcash' && <th className="py-3 px-2">Sender Phone</th>}
                <th className="py-3 px-2 text-right">Amount Payable</th>
                <th className="py-3 px-2 text-center">Payment Status</th>
                <th className="py-3 pr-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">{order.id}</td>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
                    <span className="text-[10px] text-stone-400">{order.customer.city}</span>
                  </td>

                  {activeTab === 'jazzcash' && (
                    <td className="py-3 px-2">
                      {order.jazzCashReference ? (
                        <span className="font-mono font-bold text-stone-900 bg-[#FCF9EA] px-2 py-0.5 rounded border border-stone-300">
                          {order.jazzCashReference}
                        </span>
                      ) : (
                        <span className="text-stone-400 italic">Reference pending</span>
                      )}
                    </td>
                  )}

                  {activeTab === 'jazzcash' && (
                    <td className="py-3 px-2 font-mono text-stone-600">
                      {order.jazzCashPhone || order.customer.phone}
                    </td>
                  )}

                  <td className="py-3 px-2 text-right font-mono font-bold text-stone-900 tabular-nums">
                    Rs. {order.total.toLocaleString()}
                  </td>

                  <td className="py-3 px-2 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : order.paymentStatus === 'failed'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : order.paymentStatus === 'refunded'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => handleSetStatus(order.id, 'paid')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Confirm Paid
                        </button>
                      )}
                      {order.paymentStatus !== 'failed' && (
                        <button
                          onClick={() => handleSetStatus(order.id, 'failed')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold"
                        >
                          Mark Failed
                        </button>
                      )}
                      {order.paymentStatus === 'paid' && (
                        <button
                          onClick={() => handleSetStatus(order.id, 'refunded')}
                          className="px-2.5 py-1 bg-stone-700 hover:bg-stone-800 text-white rounded text-[11px] font-semibold"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
