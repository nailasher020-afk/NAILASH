import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardHome } from './AdminDashboardHome';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminPayments } from './AdminPayments';
import { AdminBilling } from './AdminBilling';
import { AdminMarketing } from './AdminMarketing';
import { AdminReviews } from './AdminReviews';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';
import { AdminLoginView } from './AdminLoginView';

export const AdminView: React.FC = () => {
  const { isAdminAuthenticated, adminTab, setAdminTab } = useStore();

  // Defense in depth: Verify admin session
  if (!isAdminAuthenticated) {
    return <AdminLoginView />;
  }

  const activeTab = adminTab || 'dashboard';

  return (
    <AdminLayout currentTab={activeTab} setCurrentTab={setAdminTab}>
      {activeTab === 'dashboard' && <AdminDashboardHome onNavigateTab={setAdminTab} />}
      {activeTab === 'products' && <AdminProducts />}
      {activeTab === 'categories' && <AdminCategories />}
      {activeTab === 'inventory' && <AdminInventory />}
      {activeTab === 'orders' && <AdminOrders />}
      {activeTab === 'customers' && <AdminCustomers />}
      {activeTab === 'payments' && <AdminPayments />}
      {activeTab === 'billing' && <AdminBilling />}
      {(activeTab === 'marketing' || activeTab === 'coupons') && <AdminMarketing />}
      {activeTab === 'reviews' && <AdminReviews />}
      {activeTab === 'analytics' && <AdminAnalytics />}
      {activeTab === 'reports' && <AdminReports />}
      {activeTab === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
};
