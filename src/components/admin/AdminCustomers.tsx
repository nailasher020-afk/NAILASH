import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types';
import { Users, Search, ShoppingBag, Eye, Phone, Mail, MapPin, X } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchCity = c.city.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  // Calculate customer metrics when selected
  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.customer.email.toLowerCase() === selectedCustomer.email.toLowerCase())
    : [];

  const pendingCount = customerOrders.filter((o) => o.orderStatus === 'pending').length;
  const completedCount = customerOrders.filter((o) => o.orderStatus === 'delivered' || o.orderStatus === 'shipped').length;
  const cancelledCount = customerOrders.filter((o) => o.orderStatus === 'cancelled').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Clientele & VIP Accounts
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Customers Directory ({customers.length})
          </h1>
          <p className="text-xs text-stone-500">
            Inspect customer lifetime spending, purchased garments, and individual order history.
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
            placeholder="Search by name, email, phone, city..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FCF9EA]/40 border border-stone-300 rounded text-xs text-stone-800"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 font-semibold text-stone-400 uppercase tracking-wider bg-stone-50">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-2">Contact Details</th>
                <th className="py-3 px-2">City</th>
                <th className="py-3 px-2 text-center">Orders</th>
                <th className="py-3 px-2 text-right">Total Spending</th>
                <th className="py-3 px-2">Last Order</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-stone-900">{cust.name}</p>
                    <span className="text-[10px] text-stone-400">Member since {new Date(cust.createdAt).getFullYear()}</span>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-stone-800 font-medium">{cust.email}</p>
                    <span className="text-[10px] text-stone-400 font-mono">{cust.phone}</span>
                  </td>
                  <td className="py-3 px-2 font-medium text-stone-800">{cust.city}</td>
                  <td className="py-3 px-2 text-center font-mono font-bold">{cust.totalOrders}</td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-stone-900 tabular-nums">
                    Rs. {cust.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 font-mono text-stone-500">
                    {cust.lastOrderDate ? new Date(cust.lastOrderDate).toLocaleDateString() : 'No orders yet'}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1 bg-stone-900 text-[#FCF9EA] text-xs font-semibold rounded hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-stone-200 p-6 space-y-6">
            <div className="flex justify-between items-start border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#97A87A]/20 text-[#97A87A] flex items-center justify-center font-serif-title text-xl font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif-title font-bold text-xl text-stone-900">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedCustomer.email} · {selectedCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-[#FCF9EA] rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase">Total Spending</span>
                <p className="text-sm font-bold font-mono text-[#DB9558] mt-0.5">
                  Rs. {selectedCustomer.totalSpent.toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <span className="text-[10px] text-amber-700 uppercase">Pending</span>
                <p className="text-sm font-bold font-mono text-amber-900 mt-0.5">{pendingCount}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase">Completed</span>
                <p className="text-sm font-bold font-mono text-emerald-900 mt-0.5">{completedCount}</p>
              </div>

              <div className="p-3 bg-rose-50 rounded border border-rose-200">
                <span className="text-[10px] text-rose-700 uppercase">Cancelled</span>
                <p className="text-sm font-bold font-mono text-rose-900 mt-0.5">{cancelledCount}</p>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                Past Order History ({customerOrders.length})
              </h4>

              {customerOrders.length === 0 ? (
                <p className="text-xs text-stone-400 py-3">No orders placed by this customer yet.</p>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-stone-50 rounded border border-stone-200 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between font-semibold">
                        <span className="font-mono text-stone-900">{ord.id}</span>
                        <span className="font-mono text-[#DB9558] font-bold">
                          Rs. {ord.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                        <span className="uppercase font-semibold text-[#97A87A]">{ord.orderStatus}</span>
                      </div>
                      <div className="text-[11px] text-stone-600">
                        {ord.items.map((it) => `${it.productName} (${it.size})`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
