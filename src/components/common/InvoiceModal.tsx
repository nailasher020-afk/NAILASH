import React, { useRef, useEffect } from 'react';
import { Order } from '../../types';
import { Printer, Download, X, Mail, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface InvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const { storeSettings, showToast } = useStore();
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const invoiceNumber = `INV-${order.id.replace('NL-', '')}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
    showToast('Print dialog opened. Choose "Save as PDF" to download.', 'info');
  };

  const handleSendInvoice = () => {
    showToast(`Invoice successfully sent to ${order.customer.email}`, 'success');
  };

  const paymentMethodLabel = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'JazzCash';
  const paymentStatusDisplay =
    order.paymentStatus === 'paid'
      ? 'Paid'
      : order.paymentStatus === 'failed'
      ? 'Failed'
      : order.paymentStatus === 'refunded'
      ? 'Refunded'
      : 'Pending';

  const orderStatusDisplay =
    order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col my-6 border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Top Actions Header (Hidden when printed) */}
        <div className="no-print bg-[#FCF9EA] px-5 sm:px-6 py-3.5 border-b border-stone-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-serif-title font-bold text-stone-900 text-lg tracking-wide">
              NAILASH INVOICE
            </span>
            <span className="text-xs text-stone-500 font-mono font-medium">#{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#97A87A] text-white text-xs font-semibold rounded hover:bg-[#839367] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Print official tax invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-stone-800 text-[#FCF9EA] text-xs font-semibold rounded hover:bg-stone-900 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={handleSendInvoice}
              className="px-3 py-1.5 border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer hidden md:flex"
              title="Email invoice to customer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            {/* Prominent, Clearly Visible CLOSE / CROSS BUTTON (×) */}
            <button
              onClick={onClose}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-stone-200/80 hover:bg-rose-100 text-stone-700 hover:text-rose-700 font-bold transition-all flex items-center gap-1 cursor-pointer border border-stone-300 hover:border-rose-300 ml-1"
              title="Close Invoice (Esc)"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5 text-current" />
              <span className="text-xs font-semibold hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div ref={invoiceRef} className="invoice-container p-6 sm:p-10 md:p-12 text-stone-800 bg-white">
          {/* Header & Branding with Brand Name and Invoice Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-stone-200 pb-7 gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-stone-900 tracking-wider uppercase">
                  {storeSettings.storeName || 'NAILASH'}
                </h1>
              </div>
              <p className="text-xs text-[#DB9558] font-semibold tracking-widest uppercase mt-1">
                {storeSettings.tagline || 'Luxury Pret & Couture'}
              </p>
              <div className="text-xs text-stone-500 mt-3 space-y-0.5 leading-relaxed">
                <p>{storeSettings.address}</p>
                <p>{storeSettings.city}, Pakistan</p>
                <p>Phone: {storeSettings.phone}</p>
                <p>Email: {storeSettings.supportEmail}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1.5 w-full sm:w-auto">
              <span className="text-xs uppercase tracking-widest text-[#97A87A] font-bold block">
                Commercial Tax Invoice
              </span>
              <p className="text-xl font-mono font-bold text-stone-900">{invoiceNumber}</p>
              <p className="text-xs text-stone-600">
                Order ID: <span className="font-mono font-bold text-stone-900">{order.id}</span>
              </p>
              <p className="text-xs text-stone-500">
                Order Date: <span className="font-medium text-stone-700">{orderDate} at {orderTime}</span>
              </p>

              {/* Status Badges */}
              <div className="pt-2 flex flex-wrap gap-2 justify-start sm:justify-end">
                <div
                  className={`text-xs font-semibold uppercase px-2.5 py-1 rounded inline-flex items-center gap-1.5 ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : order.paymentStatus === 'failed'
                      ? 'bg-rose-50 text-rose-800 border border-rose-300'
                      : order.paymentStatus === 'refunded'
                      ? 'bg-purple-50 text-purple-800 border border-purple-300'
                      : order.paymentMethod === 'cod'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border border-amber-300'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : order.paymentMethod === 'cod' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>
                    Payment: <strong>{order.paymentStatus === 'paid' ? 'Paid' : order.paymentMethod === 'cod' ? 'Cash Payable Upon Delivery' : paymentStatusDisplay}</strong>
                  </span>
                </div>

                <div
                  className={`text-xs font-semibold uppercase px-2.5 py-1 rounded border ${
                    order.orderStatus === 'delivered'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : order.orderStatus === 'cancelled'
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : order.orderStatus === 'shipped'
                      ? 'bg-blue-50 text-blue-900 border-blue-300'
                      : 'bg-[#DB9558]/15 text-[#8c5220] border-[#DB9558]/30'
                  }`}
                >
                  <span>Order Status: <strong>{orderStatusDisplay}</strong></span>
                </div>
              </div>

              {order.paidAt && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  Payment Received: {new Date(order.paidAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Customer & Delivery Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-stone-200 text-xs">
            <div>
              <h3 className="uppercase tracking-widest font-semibold text-stone-400 mb-2">
                Customer Information
              </h3>
              <p className="text-sm font-bold text-stone-900">{order.customer.fullName}</p>
              <p className="text-stone-600 mt-1">Email: <span className="text-stone-800 font-medium">{order.customer.email}</span></p>
              <p className="text-stone-600">Phone: <span className="font-mono text-stone-800 font-medium">{order.customer.phone}</span></p>
            </div>

            <div>
              <h3 className="uppercase tracking-widest font-semibold text-stone-400 mb-2">
                Delivery Address & Payment
              </h3>
              <p className="text-stone-800 font-medium">{order.customer.address}</p>
              <p className="text-stone-600">
                {order.customer.area}, {order.customer.city} - {order.customer.postalCode}
              </p>
              <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-1">
                <p className="text-stone-600">
                  Payment Method:{' '}
                  <span className="font-bold text-stone-900 uppercase">
                    {paymentMethodLabel}
                  </span>
                </p>
                {order.paymentMethod === 'cod' ? (
                  <p className="text-stone-600">
                    Payment Terms:{' '}
                    <span className="font-semibold text-stone-800">
                      {order.paymentStatus === 'paid' ? 'Cash Received in Full' : 'Cash payable upon delivery'}
                    </span>
                  </p>
                ) : null}
                <p className="text-stone-600">
                  Payment Status:{' '}
                  <span
                    className={`font-bold uppercase ${
                      order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid'
                      ? 'Cash Payable Upon Delivery'
                      : paymentStatusDisplay}
                  </span>
                </p>
                <p className="text-stone-600">
                  Order Status:{' '}
                  <span className="font-bold text-stone-900 uppercase">
                    {orderStatusDisplay}
                  </span>
                </p>
                {order.jazzCashReference && (
                  <p className="text-stone-600">
                    JazzCash Ref: <span className="font-mono font-bold text-stone-900">{order.jazzCashReference}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-300 text-stone-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 pr-4">Product Name</th>
                  <th className="py-3 px-2 text-center">Size</th>
                  <th className="py-3 px-2 text-center">Color</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-center">Quantity</th>
                  <th className="py-3 pl-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="py-3.5 pr-4 font-medium text-stone-900">
                      <div>{item.productName}</div>
                      <span className="text-[10px] text-stone-400 font-mono">SKU: {item.sku}</span>
                    </td>
                    <td className="py-3.5 px-2 text-center font-semibold text-stone-800">{item.size}</td>
                    <td className="py-3.5 px-2 text-center text-stone-600">{item.colorName}</td>
                    <td className="py-3.5 px-2 text-right tabular-nums text-stone-800">
                      Rs. {item.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums font-semibold">{item.quantity}</td>
                    <td className="py-3.5 pl-4 text-right font-semibold tabular-nums text-stone-900">
                      Rs. {item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="border-t border-stone-200 pt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="tabular-nums font-medium text-stone-900">
                  Rs. {order.subtotal.toLocaleString()}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="tabular-nums font-medium">
                    - Rs. {order.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping Charges:</span>
                <span className="tabular-nums font-medium text-stone-900">
                  {order.shippingFee === 0 ? 'Complimentary (Free)' : `Rs. ${order.shippingFee.toLocaleString()}`}
                </span>
              </div>
              {storeSettings.taxRate > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Sales Tax ({storeSettings.taxRate}%):</span>
                  <span className="tabular-nums font-medium text-stone-900">
                    Rs. {Math.round((order.subtotal * storeSettings.taxRate) / 100).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-300 pt-3">
                <span className="font-serif-title uppercase">Total Amount:</span>
                <span className="tabular-nums text-[#DB9558]">
                  Rs. {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Footer / Terms */}
          <div className="mt-10 pt-6 border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700">Terms & Conditions:</p>
            <p>1. Please verify garment condition upon delivery. Any exchange request must be initiated within 7 business days.</p>
            <p>2. Products must be unworn, undamaged with all original tags attached.</p>
            <p>3. For inquiries regarding this invoice, contact {storeSettings.supportEmail} or WhatsApp {storeSettings.whatsapp}.</p>
            <div className="mt-5 text-center text-xs font-serif-title text-[#DB9558] italic">
              Thank you for choosing Nailash. Elegance, Made for You.
            </div>
          </div>

          {/* Bottom Close Button (no-print) */}
          <div className="no-print mt-8 pt-4 border-t border-stone-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-[#FCF9EA] text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Close Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
