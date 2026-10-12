import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { FileText, Printer, Download, Mail, Eye, Search } from 'lucide-react';
import { InvoiceModal } from '../common/InvoiceModal';

export const AdminBilling: React.FC = () => {
  const { orders, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCust = o.customer.fullName.toLowerCase().includes(q);
      const matchEmail = o.customer.email.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchEmail) return false;
    }
    return true;
  });

  const handleOpenInvoice = (order: Order) => {
    setSelectedOrder(order);
    setIsInvoiceOpen(true);
  };

  const handleSendEmail = (order: Order) => {
    showToast(`Invoice INV-${order.id.replace('NL-', '')} dispatched to ${order.customer.email}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Invoicing & Commercial Documents
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Billing & Invoices ({orders.length})
          </h1>
          <p className="text-xs text-stone-500">
            Generate, view, download, print, or email luxury branded customer invoices.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-stone-200">
        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice # or customer..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FCF9EA]/40 border border-stone-300 rounded text-xs text-stone-800"
          />
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 font-semibold text-stone-400 uppercase tracking-wider bg-stone-50">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Billed To</th>
                <th className="py-3 px-2">Issue Date</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredOrders.map((order) => {
                const invoiceNumber = `INV-${order.id.replace('NL-', '')}`;
                return (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{invoiceNumber}</td>
                    <td className="py-3 px-2 font-mono text-stone-600">{order.id}</td>
                    <td className="py-3 px-2">
                      <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
                      <span className="text-[10px] text-stone-400">{order.customer.email}</span>
                    </td>
                    <td className="py-3 px-2 font-mono text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-stone-900 tabular-nums">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenInvoice(order)}
                          className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-[#FCF9EA] rounded text-xs font-semibold flex items-center gap-1"
                          title="View & Print Invoice"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleSendEmail(order)}
                          className="p-1 border border-stone-300 hover:bg-stone-100 rounded text-stone-700"
                          title="Email Invoice to Client"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <InvoiceModal
          order={selectedOrder}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}
    </div>
  );
};
