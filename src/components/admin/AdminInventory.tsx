import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ClothingSize } from '../../types';
import { Boxes, Plus, Minus, Search, History, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const AdminInventory: React.FC = () => {
  const { products, adjustStock, stockHistory, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Selected item for adjustment
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    sku: string;
    color: string;
    size: ClothingSize;
    currentStock: number;
  } | null>(null);

  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(5);
  const [adjustmentReason, setAdjustmentReason] = useState<
    'sale' | 'restock' | 'adjustment' | 'return' | 'cancellation'
  >('restock');

  // Flatten products into variant rows
  const inventoryRows = products.flatMap((product) =>
    product.colors.flatMap((color) =>
      color.sizes.map((s) => {
        const currentStock = s.stock;
        const reservedStock = 0; // live available
        const availableStock = currentStock - reservedStock;

        let stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (currentStock === 0) stockStatus = 'Out of Stock';
        else if (currentStock <= product.lowStockThreshold) stockStatus = 'Low Stock';

        return {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          image: product.images[0],
          colorName: color.name,
          colorHex: color.hex,
          size: s.size,
          currentStock,
          reservedStock,
          availableStock,
          threshold: product.lowStockThreshold,
          stockStatus
        };
      })
    )
  );

  // Filter rows
  const filteredRows = inventoryRows.filter((r) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.productName.toLowerCase().includes(q);
      const matchSku = r.sku.toLowerCase().includes(q);
      const matchColor = r.colorName.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchColor) return false;
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'in_stock' && r.stockStatus !== 'In Stock') return false;
      if (statusFilter === 'low_stock' && r.stockStatus !== 'Low Stock') return false;
      if (statusFilter === 'out_of_stock' && r.stockStatus !== 'Out of Stock') return false;
    }
    return true;
  });

  const handleOpenAdjust = (row: typeof inventoryRows[0]) => {
    setSelectedProduct({
      id: row.productId,
      name: row.productName,
      sku: row.sku,
      color: row.colorName,
      size: row.size,
      currentStock: row.currentStock
    });
    setAdjustmentDelta(5);
    setAdjustmentReason('restock');
    setIsAdjustModalOpen(true);
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    adjustStock(
      selectedProduct.id,
      selectedProduct.color,
      selectedProduct.size,
      adjustmentDelta,
      adjustmentReason
    );
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Inventory & Stock Reconciliation
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Inventory Management
          </h1>
          <p className="text-xs text-stone-500">
            Live SKU variant stock tracking with automated low-stock warnings and audit logs.
          </p>
        </div>

        <button
          onClick={() => setIsHistoryModalOpen(true)}
          className="px-4 py-2 bg-stone-900 text-[#FCF9EA] text-xs font-semibold rounded hover:bg-stone-800 transition-colors flex items-center gap-2"
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Stock History</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search variant, SKU or shade..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FCF9EA]/40 border border-stone-300 rounded text-xs text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-700"
          >
            <option value="all">All Levels</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Matrix Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 font-semibold text-stone-400 uppercase tracking-wider bg-stone-50">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-2">SKU</th>
                <th className="py-3 px-2">Color Variant</th>
                <th className="py-3 px-2 text-center">Size</th>
                <th className="py-3 px-2 text-right">Current Stock</th>
                <th className="py-3 px-2 text-right">Reserved</th>
                <th className="py-3 px-2 text-right">Available</th>
                <th className="py-3 px-2 text-center">Stock Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={normalizeAssetUrl(row.image)}
                        alt=""
                        className="w-8 h-10 object-cover rounded bg-stone-100 shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.dataset.triedFallback !== 'true') {
                            target.dataset.triedFallback = 'true';
                            target.src = fallbackProductImage;
                          }
                        }}
                      />
                      <span className="font-semibold text-stone-900 line-clamp-1">
                        {row.productName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-stone-800">{row.sku}</td>
                  <td className="py-3 px-2">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-stone-300 inline-block"
                        style={{ backgroundColor: row.colorHex }}
                      />
                      <span>{row.colorName}</span>
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-stone-800 font-mono">
                    {row.size}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-stone-900 tabular-nums">
                    {row.currentStock}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-stone-400 tabular-nums">
                    {row.reservedStock}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-stone-900 tabular-nums">
                    {row.availableStock}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        row.stockStatus === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : row.stockStatus === 'Low Stock'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {row.stockStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() =>
                          adjustStock(row.productId, row.colorName, row.size, -1, 'adjustment')
                        }
                        disabled={row.currentStock <= 0}
                        className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-700"
                        title="Quick Decrease -1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() =>
                          adjustStock(row.productId, row.colorName, row.size, 1, 'restock')
                        }
                        className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
                        title="Quick Increase +1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleOpenAdjust(row)}
                        className="ml-1 px-2 py-1 bg-stone-800 text-white rounded text-[11px] font-medium hover:bg-stone-900"
                      >
                        Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="text-lg font-serif-title font-semibold text-stone-900">
              Adjust Inventory Stock
            </h3>
            <div className="text-xs text-stone-600 space-y-1 bg-[#FCF9EA] p-3 rounded">
              <p>Product: <strong className="text-stone-900">{selectedProduct.name}</strong></p>
              <p>SKU: <strong className="font-mono">{selectedProduct.sku}</strong></p>
              <p>Variant: {selectedProduct.color} · Size: <strong className="font-bold">{selectedProduct.size}</strong></p>
              <p>Current In Hand: <strong className="font-mono text-stone-900">{selectedProduct.currentStock} units</strong></p>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Stock Adjustment (+ to add, - to deduct)
                </label>
                <input
                  type="number"
                  required
                  value={adjustmentDelta}
                  onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded font-mono font-bold text-stone-800"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  New resulting stock:{' '}
                  <strong className="text-stone-900 font-mono">
                    {Math.max(0, selectedProduct.currentStock + adjustmentDelta)} units
                  </strong>
                </span>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Reason for Audit Log</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
                >
                  <option value="restock">New Atelier Restock Batch</option>
                  <option value="adjustment">Physical Inventory Audit Discrepancy</option>
                  <option value="return">Customer Return Restock</option>
                  <option value="sale">VIP Direct Atelier Sale</option>
                  <option value="cancellation">Order Cancellation Restoration</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#97A87A] text-white font-semibold rounded hover:bg-[#839367]"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock History Audit Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-lg font-serif-title font-semibold text-stone-900">
                  Stock Adjustment Audit Trail
                </h3>
                <span className="text-xs text-stone-400">
                  All automated and manual inventory modifications logged with timestamp.
                </span>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 font-semibold text-stone-400 uppercase">
                    <th className="py-2.5">Date & Time</th>
                    <th className="py-2.5">Product & SKU</th>
                    <th className="py-2.5">Variant</th>
                    <th className="py-2.5 text-center">Change</th>
                    <th className="py-2.5">Reason</th>
                    <th className="py-2.5">Initiated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {stockHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50">
                      <td className="py-2.5 font-mono text-stone-500">
                        {new Date(item.date).toLocaleString()}
                      </td>
                      <td className="py-2.5 font-semibold text-stone-900">
                        {item.productName} <span className="font-mono text-stone-400">({item.sku})</span>
                      </td>
                      <td className="py-2.5">
                        {item.color} - {item.size}
                      </td>
                      <td className="py-2.5 text-center font-mono font-bold tabular-nums">
                        <span className={item.change > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                          {item.change > 0 ? `+${item.change}` : item.change}
                        </span>
                      </td>
                      <td className="py-2.5 uppercase text-[10px] font-semibold text-stone-600">
                        {item.reason}
                      </td>
                      <td className="py-2.5 text-stone-500">{item.updatedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
