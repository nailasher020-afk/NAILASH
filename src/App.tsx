import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';

// Customer Pages
import { HomeView } from './components/customer/HomeView';
import { ShopView } from './components/customer/ShopView';
import { ProductDetailsView } from './components/customer/ProductDetailsView';
import { CategoriesView } from './components/customer/CategoriesView';
import { NewArrivalsView } from './components/customer/NewArrivalsView';
import { CollectionsView } from './components/customer/CollectionsView';
import { WishlistView } from './components/customer/WishlistView';
import { CartView } from './components/customer/CartView';
import { CheckoutView } from './components/customer/CheckoutView';
import { OrderSuccessView } from './components/customer/OrderSuccessView';
import { CustomerAuthView } from './components/customer/CustomerAuthView';
import { MyAccountView } from './components/customer/MyAccountView';
import { MyOrdersView } from './components/customer/MyOrdersView';
import { OrderDetailsView } from './components/customer/OrderDetailsView';
import {
  AboutView,
  ContactView,
  FaqView,
  PrivacyView,
  TermsView
} from './components/customer/StaticPages';

// Admin Views
import { AdminView } from './components/admin/AdminView';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { isCurrentSessionAdmin, isAuthorizedOwnerEmail } from './utils/adminAuth';

const MainAppContent: React.FC = () => {
  const { activeView, isAdminAuthenticated, adminUser, currentUser } = useStore();

  const isOwner = Boolean(
    isCurrentSessionAdmin() ||
    (isAdminAuthenticated && isAuthorizedOwnerEmail(adminUser?.email)) ||
    isAuthorizedOwnerEmail(currentUser?.email)
  );

  // Route Guard: Direct admin access without nailasher020@gmail.com authorization is strictly prohibited
  if (activeView === 'admin') {
    if (!isOwner) {
      return (
        <>
          <Toast />
          <AdminLoginView />
        </>
      );
    }
    return (
      <>
        <Toast />
        <AdminView />
      </>
    );
  }

  if (activeView === 'admin-login') {
    return (
      <>
        <Toast />
        <AdminLoginView />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9EA] text-stone-800 antialiased selection:bg-[#DB9558]/20 selection:text-[#8e5220]">
      <Toast />
      <Header />

      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'shop' && <ShopView />}
        {activeView === 'product-details' && <ProductDetailsView />}
        {activeView === 'categories' && <CategoriesView />}
        {activeView === 'new-arrivals' && <NewArrivalsView />}
        {activeView === 'collections' && <CollectionsView />}
        {activeView === 'wishlist' && <WishlistView />}
        {activeView === 'cart' && <CartView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'order-success' && <OrderSuccessView />}
        {(activeView === 'login' || activeView === 'register') && <CustomerAuthView />}
        {activeView === 'account' && <MyAccountView />}
        {activeView === 'my-orders' && <MyOrdersView />}
        {activeView === 'order-details' && <OrderDetailsView />}
        {activeView === 'about' && <AboutView />}
        {activeView === 'contact' && <ContactView />}
        {activeView === 'faq' && <FaqView />}
        {activeView === 'privacy' && <PrivacyView />}
        {activeView === 'terms' && <TermsView />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
