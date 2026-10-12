import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { FileSpreadsheet, Printer, Download, Calendar, Filter, FileText } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { orders, products, customers, storeSettings, showToast } = useStore();

  const [reportType, setReportType] = useState<
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'product'
    | 'customer'
    | 'order'
    | 'inventory'
    | 'payment'
  >('daily');

  const [dateRange, setDateRange] = useState('March 2026');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    // Generate CSV content based on report type
    let csvHeader = '';
    let csvRows = '';

    if (reportType === 'product') {
      csvHeader = 'Product Name,SKU,Category,Price,Total Stock,Status\n';
      csvRows = products
        .map(
          (p) =>
            `"${p.name}","${p.sku}","${p.category}",${p.salePrice ?? p.price},${p.colors.reduce(
              (acc, c) => acc + c.sizes.reduce((s, sz) => s + sz.stock, 0),
              0
            )},${p.status}`
        )
        .join('\n');
    } else {
      csvHeader = 'Order ID,Customer,Date,Total,Payment Method,Payment Status,Order Status\n';
      csvRows = orders
        .map(
          (o) =>
            `"${o.id}","${o.customer.fullName}","${o.createdAt}",${o.total},"${o.paymentMethod}","${o.paymentStatus}","${o.orderStatus}"`
        )
        .join('\n');
    }

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nailash_report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report CSV exported and downloaded successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs no-print">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Audit & Executive Reporting
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-stone-500">
            Generate printable ledgers and downloadable spreadsheets across any business metric.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-stone-900 text-[#FCF9EA] text-xs font-semibold rounded hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-[#97A87A] text-white text-xs font-semibold rounded hover:bg-[#839367] transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Controls (Hidden in print) */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-wrap gap-4 items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Select Report:</span>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="px-3 py-1.5 bg-[#FCF9EA] border border-stone-300 rounded text-xs font-semibold text-stone-800"
          >
            <option value="daily">Daily Sales Report</option>
            <option value="weekly">Weekly Sales Report</option>
            <option value="monthly">Monthly Sales Report</option>
            <option value="yearly">Yearly Sales Report</option>
            <option value="product">Product Sales & Stock Report</option>
            <option value="customer">Customer Growth Report</option>
            <option value="order">Order Fulfillment Report</option>
            <option value="inventory">Inventory Stock Matrix Report</option>
            <option value="payment">Payment Gateway Reconciliation</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800"
          />
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white p-8 sm:p-10 rounded-xl border border-stone-200 shadow-sm space-y-6">
        {/* Printable Document Header */}
        <div className="border-b border-stone-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-serif-title font-bold text-stone-900 uppercase">
              {storeSettings.storeName}
            </h2>
            <p className="text-xs text-[#DB9558] font-bold uppercase tracking-wider">
              {reportType.toUpperCase()} FINANCIAL & AUDIT REPORT
            </p>
            <p className="text-xs text-stone-500 mt-1">Period: {dateRange}</p>
          </div>
          <div className="text-right text-xs text-stone-500">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p className="font-mono">Currency: {storeSettings.currency}</p>
          </div>
        </div>

        {/* Dynamic content table */}
        {reportType === 'product' || reportType === 'inventory' ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-300 font-semibold text-stone-500 uppercase">
                  <th className="py-2.5">Product Name</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-center">Available Stock</th>
                  <th className="py-2.5 text-right">Inventory Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {products.map((p) => {
                  const stock = p.colors.reduce(
                    (acc, c) => acc + c.sizes.reduce((sum, s) => sum + s.stock, 0),
                    0
                  );
                  const val = (p.salePrice ?? p.price) * stock;
                  return (
                    <tr key={p.id}>
                      <td className="py-2.5 font-semibold text-stone-900">{p.name}</td>
                      <td className="py-2.5 font-mono">{p.sku}</td>
                      <td className="py-2.5">{p.category}</td>
                      <td className="py-2.5 text-right font-mono">
                        Rs. {(p.salePrice ?? p.price).toLocaleString()}
                      </td>
                      <td className="py-2.5 text-center font-mono font-bold">{stock} units</td>
                      <td className="py-2.5 text-right font-mono font-bold text-stone-900">
                        Rs. {val.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-300 font-semibold text-stone-500 uppercase">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Customer Name</th>
                  <th className="py-2.5">City</th>
                  <th className="py-2.5">Payment Method</th>
                  <th className="py-2.5">Payment Status</th>
                  <th className="py-2.5">Fulfillment</th>
                  <th className="py-2.5 text-right">Order Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 font-mono font-bold text-stone-900">{o.id}</td>
                    <td className="py-2.5">{o.customer.fullName}</td>
                    <td className="py-2.5">{o.customer.city}</td>
                    <td className="py-2.5 uppercase font-semibold">{o.paymentMethod}</td>
                    <td className="py-2.5 uppercase font-semibold text-stone-600">{o.paymentStatus}</td>
                    <td className="py-2.5 uppercase text-[10px] font-semibold">{o.orderStatus}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-stone-900">
                      Rs. {o.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report Total Ledger */}
        <div className="border-t border-stone-200 pt-4 flex justify-between items-baseline text-xs">
          <span className="font-semibold uppercase text-stone-500">Summary Total:</span>
          <span className="font-mono text-base font-bold text-[#DB9558]">
            Rs. {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
