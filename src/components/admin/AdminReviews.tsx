import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle, XCircle, Trash2, Search } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCust = r.customerName.toLowerCase().includes(q);
      const matchProd = r.productName.toLowerCase().includes(q);
      const matchComm = r.comment.toLowerCase().includes(q);
      if (!matchCust && !matchProd && !matchComm) return false;
    }
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Feedback & Moderation
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Client Product Reviews ({reviews.length})
          </h1>
          <p className="text-xs text-stone-500">
            Moderate submitted ratings and testimonials before publication on the storefront.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, garment or review text..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FCF9EA]/40 border border-stone-300 rounded text-xs text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Status:</span>
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs rounded uppercase font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 font-semibold text-stone-400 uppercase tracking-wider bg-stone-50">
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Product</th>
                <th className="py-3 px-2 max-w-sm">Review Comments</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 pr-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-stone-900">{rev.customerName}</p>
                    <span className="text-[10px] text-stone-400">{rev.customerEmail}</span>
                  </td>
                  <td className="py-3 px-2 font-medium text-stone-800">{rev.productName}</td>
                  <td className="py-3 px-2 max-w-sm">
                    <p className="text-stone-600 line-clamp-2 leading-relaxed">{rev.comment}</p>
                  </td>
                  <td className="py-3 px-2 text-stone-500 font-mono">{rev.date}</td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        rev.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rev.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'approved')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'rejected')}
                          className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] font-semibold hover:bg-amber-700"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
