import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  CreditCard,
  FileText,
  Tag,
  Star,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentTab, setCurrentTab, children }) => {
  const {
    orders,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    storeSettings,
    setActiveView,
    adminUser,
    logoutAdmin
  } = useStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  const unreadNotifs = notifications.filter((n) => !n.read);
  const newOrdersCount = orders.filter((o) => o.orderStatus === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    {
      id: 'orders',
      label: newOrdersCount > 0 ? `Orders (${newOrdersCount})` : 'Orders',
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? newOrdersCount : undefined
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'billing', label: 'Billing & Invoices', icon: FileText },
    { id: 'marketing', label: 'Marketing', icon: Tag },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col antialiased text-stone-800">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="font-serif-title font-bold text-xl text-stone-900 tracking-wider uppercase">
              Nailash
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-[#DB9558]/15 text-[#8e5220] rounded text-[11px] font-bold font-mono">
              ERP Suite
            </span>
          </div>

          {/* Store status badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-medium ml-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Store Online & Live</span>
          </div>
        </div>

        {/* Center / Search */}
        <div className="hidden md:flex items-center relative max-w-xs w-full mx-4">
          <Search className="w-4 h-4 text-stone-400 absolute left-3" />
          <input
            type="text"
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            placeholder="Search orders, SKU, customer..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:border-[#DB9558]"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 relative"
              title="Admin Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-stone-200 overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="px-4 py-3 bg-[#FCF9EA] border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Notifications
                    </span>
                    <span className="text-[10px] bg-[#DB9558] text-white px-1.5 py-0.5 rounded font-mono">
                      {unreadNotifs.length} new
                    </span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-[#DB9558] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.linkTab) handleTabChange(n.linkTab);
                          setNotificationsOpen(false);
                        }}
                        className={`p-3 text-xs cursor-pointer hover:bg-stone-50 transition-colors ${
                          !n.read ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-stone-900">{n.title}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/80 p-2 rounded border border-stone-100 font-mono">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="w-8 h-8 rounded-full bg-[#DB9558] text-stone-950 font-bold flex items-center justify-center text-xs shadow-xs">
              {adminUser?.avatar || 'NS'}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <span className="font-semibold text-stone-900 block leading-tight">
                {adminUser?.name || 'Naila Sher'}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {adminUser?.email || 'nailasher020@gmail.com'}
              </span>
            </div>
          </div>

          {/* Switch to Customer Storefront button */}
          <button
            onClick={() => setActiveView('home')}
            className="ml-2 px-3 py-1.5 bg-[#97A87A] text-white text-xs font-semibold rounded hover:bg-[#839367] transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
            title="View Live Storefront"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={logoutAdmin}
            className="ml-1 sm:ml-2 px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-semibold rounded transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer border border-stone-200 hover:border-rose-200"
            title="Sign out of Administrator ERP"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar (260px) */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-stone-200 flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-stone-400">
              Operations & Commerce
            </div>

            {navItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#DB9558] text-white shadow-xs font-semibold'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <ItemIcon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-stone-100 bg-[#FCF9EA]/50 text-xs space-y-1">
            <span className="font-serif-title font-semibold text-stone-900 block">
              {storeSettings.storeName}
            </span>
            <p className="text-[10px] text-stone-500">
              v2.6 Enterprise · Currency: <strong className="text-stone-700">{storeSettings.currency}</strong>
            </p>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50"
            />
            <div className="relative w-64 bg-white flex flex-col justify-between h-full z-10 shadow-xl overflow-y-auto">
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <span className="font-serif-title font-bold text-lg text-stone-900 uppercase">
                    Nailash Admin
                  </span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-stone-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-2 space-y-1">
                  {navItems.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                          isActive
                            ? 'bg-[#DB9558] text-white font-semibold'
                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        <ItemIcon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
