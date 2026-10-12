import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import {
  ShoppingBag,
  Search,
  Eye,
  Printer,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  RotateCcw,
  XCircle,
  X,
  CreditCard,
  AlertCircle,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  Check,
  DollarSign
} from 'lucide-react';
import { InvoiceModal } from '../common/InvoiceModal';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [timelineNote, setTimelineNote] = useState('');

  // Confirmation Dialog State for Payment Status -> Paid
  const [isConfirmPaymentModalOpen, setIsConfirmPaymentModalOpen] = useState(false);
  const [orderToConfirmPayment, setOrderToConfirmPayment] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCust = o.customer.fullName.toLowerCase().includes(q);
      const matchEmail = o.customer.email.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchAddress = o.customer.address.toLowerCase().includes(q) || o.customer.city.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchEmail && !matchPhone && !matchAddress) return false;
    }
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    return true;
  });

  // Handle Order Status change
  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, timelineNote);

    // Refresh selected order state
    const updated = orders.find((o) => o.id === selectedOrder.id);
    if (updated) {
      setSelectedOrder({
        ...updated,
        orderStatus: newStatus
      });
    } else {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
    setTimelineNote('');
  };

  // Trigger Payment Status change
  const handlePaymentStatusChange = (order: Order, newPayStatus: PaymentStatus) => {
    if (newPayStatus === 'paid') {
      // User requested confirmation dialog when selecting "Paid"
      setOrderToConfirmPayment(order);
      setIsConfirmPaymentModalOpen(true);
    } else {
      // Direct update for Pending, Failed, Refunded
      updatePaymentStatus(order.id, newPayStatus);
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: newPayStatus, paidAt: undefined } : null));
      }
    }
  };

  // Confirm Payment Modal Action
  const handleConfirmPaid = () => {
    if (!orderToConfirmPayment) return;
    const now = new Date().toISOString();
    updatePaymentStatus(orderToConfirmPayment.id, 'paid', now);

    if (selectedOrder && selectedOrder.id === orderToConfirmPayment.id) {
      setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: 'paid', paidAt: now } : null));
    }

    setIsConfirmPaymentModalOpen(false);
    setOrderToConfirmPayment(null);
  };

  const handleCancelPaymentModal = () => {
    setIsConfirmPaymentModalOpen(false);
    setOrderToConfirmPayment(null);
  };

  // Format date helper
  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Commerce & Fulfillment
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Order Management ({orders.length})
          </h1>
          <p className="text-xs text-stone-500">
            Monitor client orders, update order status, verify cash on delivery, and generate official tax invoices.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, phone, address..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FCF9EA]/40 border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:border-[#DB9558]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-stone-500 font-medium">Order Status:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 font-semibold text-stone-500 uppercase tracking-wider bg-stone-50 text-[11px]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer Details</th>
                <th className="py-3 px-3">Delivery Address</th>
                <th className="py-3 px-2 text-center">Items (Qty)</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3">Payment Status</th>
                <th className="py-3 px-3 text-center">Order Status</th>
                <th className="py-3 px-3">Order Date/Time</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-stone-400">
                    No orders match the current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const paymentMethodLabel = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'JazzCash';
                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Order ID */}
                      <td className="py-3 px-3 font-mono font-bold text-stone-900 whitespace-nowrap">
                        {order.id}
                      </td>

                      {/* Customer Details: Name, Phone, Email */}
                      <td className="py-3 px-3">
                        <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
                        <p className="text-[11px] text-stone-500 font-mono">{order.customer.phone}</p>
                        <p className="text-[11px] text-stone-400">{order.customer.email}</p>
                      </td>

                      {/* Delivery Address */}
                      <td className="py-3 px-3 max-w-[180px]">
                        <p className="text-stone-800 truncate" title={order.customer.address}>
                          {order.customer.address}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {order.customer.city}
                        </p>
                      </td>

                      {/* Ordered Products & Qty */}
                      <td className="py-3 px-2 text-center">
                        <span className="font-mono font-bold text-stone-800">
                          {order.items.reduce((acc, it) => acc + it.quantity, 0)} pcs
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          ({order.items.length} sku{order.items.length > 1 ? 's' : ''})
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-stone-900 tabular-nums whitespace-nowrap">
                        Rs. {order.total.toLocaleString()}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                            order.paymentMethod === 'cod'
                              ? 'bg-amber-50 text-amber-900 border border-amber-200'
                              : 'bg-orange-50 text-orange-900 border border-orange-200'
                          }`}
                        >
                          {paymentMethodLabel}
                        </span>
                      </td>

                      {/* Payment Status with Dropdown selector */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(order, e.target.value as PaymentStatus)}
                          className={`text-[11px] font-bold uppercase px-2 py-1 rounded border cursor-pointer focus:outline-none ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.paymentStatus === 'failed'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : order.paymentStatus === 'refunded'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                          title="Change payment status"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Order Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded ${
                            order.orderStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : order.orderStatus === 'cancelled'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : order.orderStatus === 'shipped'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : order.orderStatus === 'processing'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : order.orderStatus === 'confirmed'
                              ? 'bg-teal-100 text-teal-800 border border-teal-200'
                              : 'bg-[#DB9558]/20 text-[#8c5220] border border-[#DB9558]/30'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Order Date/Time */}
                      <td className="py-3 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                        {formatDateTime(order.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3 pr-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-stone-900 text-[#FCF9EA] text-xs font-semibold rounded hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Order Details Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 my-6 relative animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FCF9EA] px-6 py-4 border-b border-stone-200 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <span className="font-serif-title font-bold text-xl text-stone-900">
                  Order #{selectedOrder.id}
                </span>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded ${
                    selectedOrder.orderStatus === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOrder.orderStatus === 'cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-[#DB9558]/20 text-[#8c5220]'
                  }`}
                >
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-3.5 py-1.5 bg-[#97A87A] text-white text-xs font-semibold rounded hover:bg-[#839367] flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Generate Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-xs">
              {/* Controls Bar: Payment Status [ ▼ ] and Order Status [ ▼ ] as requested */}
              <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="font-bold uppercase tracking-wider text-stone-800 text-xs">
                    Order & Payment Management Controls
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Placed: {formatDateTime(selectedOrder.createdAt)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Payment Status Dropdown Control */}
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Payment Status:
                    </label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(selectedOrder, e.target.value as PaymentStatus)}
                      className={`w-full px-3 py-2 border rounded-md text-xs font-bold uppercase focus:outline-none cursor-pointer ${
                        selectedOrder.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : selectedOrder.paymentStatus === 'failed'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : selectedOrder.paymentStatus === 'refunded'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>

                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {selectedOrder.paymentMethod === 'cod'
                        ? 'For Cash on Delivery: Keep as Pending until cash is physically received by courier/agent.'
                        : 'For JazzCash: Verify transaction ID before marking as Paid.'}
                    </p>

                    {selectedOrder.paidAt && (
                      <div className="pt-1 text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Payment Received: <strong>{formatDateTime(selectedOrder.paidAt)}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Order Status Dropdown Control */}
                  <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Order Status:
                    </label>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-xs font-bold uppercase text-stone-800 focus:outline-none focus:border-[#DB9558] cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Recommended COD flow: Pending → Confirmed → Processing → Shipped → Delivered.
                    </p>

                    {selectedOrder.orderStatus === 'delivered' && selectedOrder.paymentStatus !== 'paid' && (
                      <div className="pt-1 text-[11px] text-amber-700 font-medium flex items-center justify-between">
                        <span>Parcel delivered. Received cash?</span>
                        <button
                          onClick={() => handlePaymentStatusChange(selectedOrder, 'paid')}
                          className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[10px] hover:bg-emerald-700"
                        >
                          Mark Paid
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Note input */}
                <div className="flex gap-2 pt-2 border-t border-stone-200">
                  <input
                    type="text"
                    value={timelineNote}
                    onChange={(e) => setTimelineNote(e.target.value)}
                    placeholder="Optional tracking or fulfillment note (e.g. TCS Dispatch #839128)..."
                    className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded text-xs"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderStatus)}
                    className="px-3.5 py-1.5 bg-stone-800 text-white rounded font-medium hover:bg-stone-900 cursor-pointer"
                  >
                    Add Audit Note
                  </button>
                </div>
              </div>

              {/* Customer & Delivery Address details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-5 rounded-lg border border-stone-200">
                <div className="space-y-1.5">
                  <h4 className="font-semibold uppercase tracking-wider text-stone-400 text-[10px]">
                    Customer Information
                  </h4>
                  <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-stone-400" />
                    <span>{selectedOrder.customer.fullName}</span>
                  </p>
                  <p className="text-stone-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedOrder.customer.email}</span>
                  </p>
                  <p className="text-stone-600 font-mono flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedOrder.customer.phone}</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-semibold uppercase tracking-wider text-stone-400 text-[10px]">
                    Delivery Address
                  </h4>
                  <p className="text-stone-800 font-medium flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>{selectedOrder.customer.address}</span>
                  </p>
                  <p className="text-stone-600 pl-5">
                    {selectedOrder.customer.area}, {selectedOrder.customer.city} - {selectedOrder.customer.postalCode}
                  </p>
                  <p className="text-stone-500 pl-5 pt-1 text-[11px]">
                    Payment Method:{' '}
                    <strong className="text-stone-800 uppercase">
                      {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'JazzCash Mobile Account'}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Ordered Products Table with Qty, Product Price, Subtotal */}
              <div className="border border-stone-200 rounded-lg overflow-hidden">
                <div className="bg-stone-50 px-4 py-2 border-b border-stone-200 font-semibold uppercase text-stone-500 text-[10px]">
                  Ordered Products & Quantities ({selectedOrder.items.length})
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50 border-b border-stone-200 font-semibold text-stone-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-2">SKU</th>
                      <th className="py-2.5 px-2">Color</th>
                      <th className="py-2.5 px-2 text-center">Size</th>
                      <th className="py-2.5 px-2 text-right">Product Price</th>
                      <th className="py-2.5 px-2 text-center">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3 font-semibold text-stone-900">{item.productName}</td>
                        <td className="py-2.5 px-2 font-mono text-stone-500">{item.sku}</td>
                        <td className="py-2.5 px-2">{item.colorName}</td>
                        <td className="py-2.5 px-2 text-center font-bold text-stone-800">{item.size}</td>
                        <td className="py-2.5 px-2 text-right font-mono">
                          Rs. {item.price.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-stone-900">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                          Rs. {item.subtotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Totals */}
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-stone-900">
                      Rs. {selectedOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({selectedOrder.couponCode || 'Promo'}):</span>
                      <span className="font-mono">- Rs. {selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span className="font-mono text-stone-900">
                      {selectedOrder.shippingFee === 0 ? 'Complimentary' : `Rs. ${selectedOrder.shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 text-sm border-t border-stone-200 pt-2">
                    <span className="uppercase font-serif-title">Total Amount:</span>
                    <span className="font-mono text-[#DB9558]">
                      Rs. {selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Log */}
              <div className="border-t border-stone-200 pt-4 space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-stone-700 text-xs">
                  Order Status Audit Trail
                </h4>
                <div className="space-y-1.5">
                  {selectedOrder.timeline.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-stone-600">
                      <span className="font-mono text-[10px] text-stone-400 shrink-0 mt-0.5">
                        {formatDateTime(entry.timestamp)}
                      </span>
                      <span>
                        <strong className="text-stone-800 uppercase text-[10px]">{entry.status}</strong>: {entry.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Payment Status -> Paid */}
      {isConfirmPaymentModalOpen && orderToConfirmPayment && (
        <div
          onClick={handleCancelPaymentModal}
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif-title font-bold text-stone-900">
                  Confirm Cash Payment
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  Confirm that cash payment has been received from the customer.
                </p>
              </div>
            </div>

            <div className="bg-[#FCF9EA] p-3.5 rounded-lg border border-stone-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-mono font-bold text-stone-900">{orderToConfirmPayment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Customer:</span>
                <span className="font-medium text-stone-900">{orderToConfirmPayment.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Amount:</span>
                <span className="font-mono font-bold text-[#DB9558]">Rs. {orderToConfirmPayment.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Method:</span>
                <span className="font-semibold text-stone-800 uppercase">
                  {orderToConfirmPayment.paymentMethod === 'cod' ? 'Cash on Delivery' : 'JazzCash'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              Upon confirmation, the payment status will permanently change to <strong>Paid</strong> and the payment received timestamp will be saved.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelPaymentModal}
                className="px-4 py-2 border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPaid}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal with Visible Close Button (×) */}
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
