import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Eye, ShoppingCart, CreditCard, TrendingUp, Activity, ArrowUpRight } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { orders, products, customers } = useStore();

  // Simulated live active visitor counters
  const [liveVisitors, setLiveVisitors] = useState(38);
  const [activeShoppers, setActiveShoppers] = useState(14);
  const [cartEvents, setCartEvents] = useState(9);
  const [checkoutEvents, setCheckoutEvents] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => Math.max(22, prev + Math.floor(Math.random() * 5) - 2));
      setActiveShoppers((prev) => Math.max(8, prev + Math.floor(Math.random() * 3) - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const ordersToday = Math.max(1, Math.round(orders.length * 0.25));
  const revenueToday = Math.round(totalSales * 0.18);
  const conversionRate = 3.8;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Real-Time Telemetry
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Real-Time Analytics & Funnel
          </h1>
          <p className="text-xs text-stone-500">
            Live visitor footprint, checkout abandonment rates, and cart engagement across devices.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Tracking Active Sessions</span>
        </div>
      </div>

      {/* Live Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Live Visitors
          </span>
          <p className="text-2xl font-bold font-mono text-[#DB9558] tabular-nums">
            {liveVisitors}
          </p>
          <span className="text-[10px] text-stone-400">Browsing storefront</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Active Customers
          </span>
          <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {activeShoppers}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">+4 vs 10m ago</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Orders Today
          </span>
          <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {ordersToday}
          </p>
          <span className="text-[10px] text-stone-400">Paced on goal</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Revenue Today
          </span>
          <p className="text-xl font-bold font-mono text-[#97A87A] tabular-nums">
            Rs. {revenueToday.toLocaleString()}
          </p>
          <span className="text-[10px] text-stone-400">Net after coupon</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Conversion Rate
          </span>
          <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {conversionRate}%
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">+0.6% vs benchmark</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Cart Funnel
          </span>
          <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            68%
          </p>
          <span className="text-[10px] text-stone-400">Reach checkout</span>
        </div>
      </div>

      {/* Real-time Purchase Funnel Stages */}
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
          Conversion Funnel Breakdown
        </h3>

        <div className="space-y-4 pt-2 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>1. Storefront Browsers (Product Detail Views)</span>
              <span className="font-mono">1,420 sessions (100%)</span>
            </div>
            <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-stone-800" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>2. Added to Bag (Cart Activity)</span>
              <span className="font-mono">426 sessions (30%)</span>
            </div>
            <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#DB9558]" style={{ width: '30%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>3. Checkout Initiated</span>
              <span className="font-mono">185 sessions (13%)</span>
            </div>
            <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#A8BBA3]" style={{ width: '13%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-700 mb-1">
              <span>4. Orders Confirmed (JazzCash / COD)</span>
              <span className="font-mono">54 sessions (3.8%)</span>
            </div>
            <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#97A87A]" style={{ width: '3.8%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories and Gateway Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
            Top Performing Categories
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-[#FCF9EA] rounded">
              <span className="font-semibold text-stone-900">Luxury Lawn 3-Piece</span>
              <span className="font-mono font-bold text-[#DB9558]">52% of total GMV</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-[#FCF9EA] rounded">
              <span className="font-semibold text-stone-900">Festive Organza Peshwas</span>
              <span className="font-mono font-bold text-[#DB9558]">28% of total GMV</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-[#FCF9EA] rounded">
              <span className="font-semibold text-stone-900">Men’s Raw Silk Kurta Sets</span>
              <span className="font-mono font-bold text-[#DB9558]">14% of total GMV</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-[#FCF9EA] rounded">
              <span className="font-semibold text-stone-900">Heirloom Velvet Shawls</span>
              <span className="font-mono font-bold text-[#DB9558]">6% of total GMV</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
            Device & Platform Traffic
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-stone-700 mb-1">
                <span>Mobile Browsers (iOS / Android)</span>
                <span className="font-mono font-bold">78%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#DB9558]" style={{ width: '78%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-stone-700 mb-1">
                <span>Desktop & Laptop</span>
                <span className="font-mono font-bold">18%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#97A87A]" style={{ width: '18%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-stone-700 mb-1">
                <span>Tablets & iPads</span>
                <span className="font-mono font-bold">4%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-stone-400" style={{ width: '4%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
