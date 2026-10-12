import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Heart, ShoppingBag, User, Shield, Lock, X, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    wishlist,
    searchKeyword,
    setSearchKeyword,
    isAdminAuthenticated,
    adminUser,
    currentUser,
    storeSettings
  } = useStore();

  const isOwner = Boolean(
    isAdminAuthenticated &&
    (adminUser?.email?.toLowerCase() === 'nailasher020@gmail.com' ||
     currentUser?.email?.toLowerCase() === 'nailasher020@gmail.com')
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleNav = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      setActiveView('shop');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9EA]/95 backdrop-blur-md border-b border-stone-200/70">
      {/* Top Announcement Banner (<= 40px, dismissible) */}
      {!bannerDismissed && (
        <div className="bg-[#97A87A] text-[#FCF9EA] px-4 py-2 text-xs text-center tracking-wide font-medium flex items-center justify-between">
          <div className="flex-1 text-center truncate">
            {storeSettings.bannerAnnouncement}
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="p-1 hover:opacity-75 transition-opacity text-[#FCF9EA] ml-2"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-800 hover:text-[#DB9558] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center">
          <button
            onClick={() => handleNav('home')}
            className="text-2xl sm:text-3xl font-serif-title tracking-wider text-stone-900 uppercase font-semibold hover:opacity-90 transition-opacity"
          >
            Nailash
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-stone-700">
          <button
            onClick={() => handleNav('home')}
            className={`transition-colors py-1 relative ${
              activeView === 'home'
                ? 'text-[#DB9558] font-semibold border-b-2 border-[#DB9558]'
                : 'hover:text-[#DB9558]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('shop')}
            className={`transition-colors py-1 relative ${
              activeView === 'shop'
                ? 'text-[#DB9558] font-semibold border-b-2 border-[#DB9558]'
                : 'hover:text-[#DB9558]'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => handleNav('new-arrivals')}
            className={`transition-colors py-1 relative ${
              activeView === 'new-arrivals'
                ? 'text-[#DB9558] font-semibold border-b-2 border-[#DB9558]'
                : 'hover:text-[#DB9558]'
            }`}
          >
            New Arrivals
          </button>
          <button
            onClick={() => handleNav('collections')}
            className={`transition-colors py-1 relative ${
              activeView === 'collections'
                ? 'text-[#DB9558] font-semibold border-b-2 border-[#DB9558]'
                : 'hover:text-[#DB9558]'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`transition-colors py-1 relative ${
              activeView === 'about'
                ? 'text-[#DB9558] font-semibold border-b-2 border-[#DB9558]'
                : 'hover:text-[#DB9558]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Interactive action controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-stone-700 hover:text-[#DB9558] transition-colors"
            title="Search Products"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => handleNav('wishlist')}
            className="p-2 text-stone-700 hover:text-[#DB9558] transition-colors relative"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-[#DB9558] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag */}
          <button
            onClick={() => handleNav('cart')}
            className="p-2 text-stone-700 hover:text-[#DB9558] transition-colors relative"
            title="Shopping Bag"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#97A87A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Login */}
          <button
            onClick={() => handleNav(currentUser ? 'account' : 'login')}
            className="p-2 text-stone-700 hover:text-[#DB9558] transition-colors hidden sm:flex items-center gap-1.5"
            title={currentUser ? `Account (${currentUser.name})` : 'Sign In'}
            aria-label="Account"
          >
            <User className="w-5 h-5" />
            {currentUser && (
              <span className="text-xs font-medium text-stone-700 truncate max-w-[80px]">
                {currentUser.name.split(' ')[0]}
              </span>
            )}
          </button>

          {/* Exclusive Store Owner Admin Entry - STRICTLY only for nailasher020@gmail.com */}
          {isOwner && (
            <button
              onClick={() => handleNav('admin')}
              className="ml-1 sm:ml-2 px-3 py-1.5 text-xs font-semibold rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer border border-[#DB9558]/40"
              title="Open Admin ERP Dashboard (Naila Sher)"
            >
              <Shield className="w-3.5 h-3.5 text-[#DB9558]" />
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="bg-[#FCF9EA] border-b border-stone-200 px-4 py-3 shadow-inner animate-in fade-in duration-200">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search lawn, silk, formals, peshwas, kurtas..."
              className="w-full bg-transparent border-none text-sm text-stone-800 focus:outline-none placeholder:text-stone-400"
              autoFocus
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#97A87A] text-white text-xs uppercase tracking-wider rounded font-medium hover:bg-[#85956a] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCF9EA] border-b border-stone-200 px-6 py-5 shadow-lg space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-medium text-stone-800">
            <button
              onClick={() => handleNav('home')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#DB9558]"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('shop')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#DB9558]"
            >
              Shop All
            </button>
            <button
              onClick={() => handleNav('new-arrivals')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#DB9558]"
            >
              New Arrivals
            </button>
            <button
              onClick={() => handleNav('collections')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#DB9558]"
            >
              Collections
            </button>
            <button
              onClick={() => handleNav('about')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#DB9558]"
            >
              About Nailash
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#DB9558]"
            >
              Contact & Concierge
            </button>
            <button
              onClick={() => handleNav(currentUser ? 'account' : 'login')}
              className="text-left py-2 border-b border-stone-100 hover:text-[#DB9558] flex items-center justify-between"
            >
              <span>{currentUser ? `Account: ${currentUser.name}` : 'Sign In / Register'}</span>
              <User className="w-4 h-4 text-stone-500" />
            </button>

            {/* Mobile Owner Access - Strictly for nailasher020@gmail.com only */}
            {isOwner && (
              <button
                onClick={() => handleNav('admin')}
                className="text-left py-2.5 text-[#DB9558] font-bold flex items-center justify-between"
              >
                <span>Open Admin Dashboard (Naila Sher)</span>
                <Shield className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
