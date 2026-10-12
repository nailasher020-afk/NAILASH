import React from 'react';
import { useStore } from '../../context/StoreContext';
import { User, Package, MapPin, LogOut, Phone, Mail, ShoppingBag, Shield } from 'lucide-react';

export const MyAccountView: React.FC = () => {
  const { currentUser, orders, logout, setActiveView } = useStore();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif-title text-xl text-stone-800">You are currently not signed in.</p>
        <button
          onClick={() => setActiveView('login')}
          className="px-6 py-2.5 bg-[#97A87A] text-white rounded text-xs uppercase tracking-wider font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(
    (o) => o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#97A87A]/15 text-[#97A87A] flex items-center justify-center font-serif-title text-2xl font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#DB9558] font-bold">
              {currentUser.email.toLowerCase() === 'nailasher020@gmail.com' ? '👑 Store Owner & Administrator' : 'VIP Client Account'}
            </span>
            <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
              {currentUser.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{currentUser.email}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{currentUser.phone}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            setActiveView('home');
          }}
          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded hover:bg-stone-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Exclusive Store Owner Admin Banner - ONLY for nailasher020@gmail.com */}
      {currentUser.email.toLowerCase() === 'nailasher020@gmail.com' && (
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 rounded-xl border border-[#DB9558]/50 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#DB9558]" />
              <span className="text-xs uppercase tracking-widest text-[#DB9558] font-bold">
                Store Owner & Management Portal
              </span>
            </div>
            <h3 className="font-serif-title text-xl font-semibold text-white">
              NAILASH ERP & Admin Dashboard
            </h3>
            <p className="text-xs text-stone-300 max-w-xl">
              Manage incoming customer orders, verify Cash on Delivery cash receipts, update catalog products, adjust stock levels, and review revenue reports.
            </p>
          </div>
          <button
            onClick={() => setActiveView('admin')}
            className="px-5 py-2.5 bg-[#DB9558] hover:bg-[#c68246] text-white text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <span>Open Admin Dashboard</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Account Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-stone-200/80 space-y-1">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
            Total Orders
          </span>
          <p className="text-2xl font-bold font-mono text-stone-900">{userOrders.length}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200/80 space-y-1">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
            Total Investment
          </span>
          <p className="text-2xl font-bold font-mono text-[#DB9558]">
            Rs. {userOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-stone-200/80 space-y-1">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
            Primary City
          </span>
          <p className="text-2xl font-serif-title font-bold text-stone-800">{currentUser.city}</p>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#97A87A]" />
              <span>Recent Orders</span>
            </h3>
            <button
              onClick={() => setActiveView('my-orders')}
              className="text-xs text-[#DB9558] hover:underline font-medium"
            >
              View All ({userOrders.length})
            </button>
          </div>

          {userOrders.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">No orders recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {userOrders.slice(0, 2).map((order) => (
                <div key={order.id} className="p-3 bg-[#FCF9EA]/50 rounded border border-stone-200/70 text-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-stone-900">
                    <span>{order.id}</span>
                    <span>Rs. {order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="uppercase font-semibold text-[#97A87A]">{order.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#DB9558]" />
              <span>Saved Shipping Address</span>
            </h3>
          </div>
          <div className="text-xs text-stone-600 space-y-1">
            <p className="font-semibold text-stone-900">{currentUser.name}</p>
            <p>House 42-B, Street 7, Phase 5, DHA</p>
            <p>{currentUser.city}, Pakistan</p>
            <p>Phone: {currentUser.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
