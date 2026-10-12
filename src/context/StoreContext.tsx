import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  WishlistItem,
  Order,
  Customer,
  Coupon,
  Review,
  AdminNotification,
  StoreSettings,
  StockHistoryItem,
  ClothingSize,
  PaymentMethod,
  OrderStatus,
  PaymentStatus,
  AdminUser
} from '../types';
import {
  initialProducts,
  initialOrders,
  initialCustomers,
  initialCoupons,
  initialReviews,
  initialNotifications,
  initialStoreSettings
} from '../data/seedData';
import { normalizeAssetUrl } from '../utils/assets';
import {
  getAdminSession,
  validateAdminCredentials,
  saveAdminSession,
  clearAdminSession,
  isCurrentSessionAdmin,
  AUTHORIZED_OWNER_EMAIL,
  isAuthorizedOwnerEmail
} from '../utils/adminAuth';

interface StoreContextType {
  // Navigation & Routing State
  activeView: string;
  setActiveView: (view: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchKeyword: string;
  setSearchKeyword: (query: string) => void;

  // Role & Auth State
  userRole: 'customer' | 'admin';
  setUserRole: (role: 'customer' | 'admin') => void;
  currentUser: Customer | null;
  loginAsCustomer: (email: string) => boolean;
  registerCustomer: (customerData: Partial<Customer>) => boolean;
  logout: () => void;

  // Admin Authentication & Access Control
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (identifier: string, password: string, rememberMe?: boolean) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  togglePublishProduct: (id: string) => void;

  // Inventory
  stockHistory: StockHistoryItem[];
  adjustStock: (
    productId: string,
    colorName: string,
    size: ClothingSize,
    delta: number,
    reason: 'sale' | 'restock' | 'adjustment' | 'return' | 'cancellation'
  ) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    colorName: string,
    colorHex: string,
    size: ClothingSize,
    quantity: number
  ) => boolean;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeAppliedCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  toggleCouponActive: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customer: Order['customer'];
    paymentMethod: PaymentMethod;
    jazzCashReference?: string;
    jazzCashPhone?: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, paidAt?: string) => void;

  // Customers
  customers: Customer[];

  // Reviews
  reviews: Review[];
  submitReview: (review: Omit<Review, 'id' | 'status' | 'date'>) => void;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'rejected') => void;
  deleteReview: (reviewId: string) => void;

  // Notifications
  notifications: AdminNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  // Toast
  toast: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Toast state
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Admin Auth State (strictly restricted to store manager nailasher020@gmail.com)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const session = getAdminSession();
    if (session && session.user && isAuthorizedOwnerEmail(session.user.email)) {
      return session.user;
    }
    return null;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const session = getAdminSession();
    return Boolean(session && session.user && isAuthorizedOwnerEmail(session.user.email));
  });
  const [adminTab, setAdminTabState] = useState<string>('dashboard');

  // Customer Roles & User
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('nailash_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_) {}
    return null; // Public visitors are guests by default
  });

  // Synchronize currentUser with localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('nailash_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('nailash_current_user');
      }
    } catch (_) {}
  }, [currentUser]);

  // If currentUser is verified store owner (nailasher020@gmail.com), unlock admin capability
  useEffect(() => {
    if (currentUser && isAuthorizedOwnerEmail(currentUser.email)) {
      if (!isAdminAuthenticated) {
        const ownerUser: AdminUser = {
          id: 'adm-nailasher',
          name: 'Naila Sher',
          email: 'nailasher020@gmail.com',
          role: 'super_admin',
          avatar: 'NS'
        };
        saveAdminSession(ownerUser, true);
        setAdminUser(ownerUser);
        setIsAdminAuthenticated(true);
      }
    }
  }, [currentUser, isAdminAuthenticated]);

  // URL Routing resolver
  const resolveRouteFromUrl = (): { view: string; tab?: string } => {
    try {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

      // Check admin login specifically
      if (path === '/admin/login' || hash === 'admin/login' || hash === 'admin-login') {
        return { view: 'admin-login' };
      }

      // Check admin routes - if authenticated, show admin dashboard; otherwise show admin login
      if (path.startsWith('/admin') || hash.startsWith('admin')) {
        const isAuthed = isCurrentSessionAdmin();
        if (!isAuthed) {
          return { view: 'admin-login' };
        }
        const parts = path.startsWith('/admin')
          ? path.split('/').filter(Boolean)
          : hash.split('/').filter(Boolean);
        const tab = parts[1] || 'dashboard';
        return { view: 'admin', tab };
      }

      // Customer routes
      const route = path.replace(/^\//, '') || hash;
      if (route.startsWith('shop')) return { view: 'shop' };
      if (route.startsWith('new-arrivals')) return { view: 'new-arrivals' };
      if (route.startsWith('collections')) return { view: 'collections' };
      if (route.startsWith('categories')) return { view: 'categories' };
      if (route.startsWith('cart')) return { view: 'cart' };
      if (route.startsWith('checkout')) return { view: 'checkout' };
      if (route.startsWith('wishlist')) return { view: 'wishlist' };
      if (route.startsWith('login')) return { view: 'login' };
      if (route.startsWith('register')) return { view: 'register' };
      if (route.startsWith('account')) return { view: 'account' };
      if (route.startsWith('my-orders')) return { view: 'my-orders' };
      if (route.startsWith('about')) return { view: 'about' };
      if (route.startsWith('contact')) return { view: 'contact' };
      if (route.startsWith('faq')) return { view: 'faq' };
      if (route.startsWith('privacy')) return { view: 'privacy' };
      if (route.startsWith('terms')) return { view: 'terms' };

      return { view: 'home' };
    } catch (_) {
      return { view: 'home' };
    }
  };

  const initialRoute = resolveRouteFromUrl();
  const [activeView, setActiveViewRaw] = useState<string>(initialRoute.view);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Synchronize route on popstate and hashchange
  useEffect(() => {
    const handleRouteSync = () => {
      const route = resolveRouteFromUrl();
      if (route.view === 'admin' && !isCurrentSessionAdmin()) {
        setActiveViewRaw('admin-login');
        try {
          window.history.replaceState(null, '', '/admin/login');
        } catch (_) {}
      } else {
        setActiveViewRaw(route.view);
        if (route.tab) setAdminTabState(route.tab);
      }
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  // Secure navigation dispatch
  const setActiveView = (nextView: string) => {
    // If navigating to admin, check authentication
    if (nextView === 'admin') {
      const isOwner = Boolean(
        isCurrentSessionAdmin() ||
        (isAdminAuthenticated && isAuthorizedOwnerEmail(adminUser?.email)) ||
        isAuthorizedOwnerEmail(currentUser?.email)
      );

      if (!isOwner) {
        // Not authenticated yet - smoothly direct to admin login
        setActiveViewRaw('admin-login');
        try {
          window.history.pushState(null, '', '/admin/login');
        } catch (_) {}
        return;
      }
      setActiveViewRaw('admin');
      try {
        window.history.pushState(null, '', '/admin');
      } catch (_) {}
      return;
    }

    if (nextView === 'admin-login') {
      setActiveViewRaw('admin-login');
      try {
        window.history.pushState(null, '', '/admin/login');
      } catch (_) {}
      return;
    }

    // Customer views
    setActiveViewRaw(nextView);
    try {
      const urlPath = nextView === 'home' ? '/' : `/${nextView}`;
      window.history.pushState(null, '', urlPath);
    } catch (_) {}
  };

  const setAdminTab = (tab: string) => {
    setAdminTabState(tab);
    try {
      window.history.pushState(null, '', tab === 'dashboard' ? '/admin' : `/admin/${tab}`);
    } catch (_) {}
  };

  const loginAdmin = (identifier: string, password: string, rememberMe: boolean = false) => {
    const result = validateAdminCredentials(identifier, password);
    if (result.success && result.user) {
      saveAdminSession(result.user, rememberMe);
      setAdminUser(result.user);
      setIsAdminAuthenticated(true);
      setUserRole('admin');

      const ownerCust: Customer = {
        id: 'cust-nailasher',
        name: 'Naila Sher',
        email: 'nailasher020@gmail.com',
        phone: '03001234567',
        city: 'Lahore',
        totalOrders: 0,
        totalSpent: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(ownerCust);
      try {
        localStorage.setItem('nailash_current_user', JSON.stringify(ownerCust));
      } catch (_) {}

      setActiveViewRaw('admin');
      try {
        window.history.pushState(null, '', '/admin');
      } catch (_) {}
      return { success: true };
    }
    return { success: false, error: result.error || 'Authentication failed' };
  };

  const logoutAdmin = () => {
    clearAdminSession();
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    setUserRole('customer');
    setActiveViewRaw('home');
    try {
      window.history.pushState(null, '', '/');
    } catch (_) {}
    showToast('Administrator session closed.', 'info');
  };

  // Helper to normalize image paths for reliable production bundling
  const sanitizeImages = (imgList: string[]) =>
    imgList.map((img) => normalizeAssetUrl(img));

  // Load from localStorage or seed
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nailash_products');
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map((p) => ({
          ...p,
          images: sanitizeImages(p.images)
        }));
      } catch (e) {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nailash_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.map((o) => ({
          ...o,
          items: o.items.map((it) => ({
            ...it,
            image: normalizeAssetUrl(it.image)
          }))
        }));
      } catch (e) {
        return initialOrders;
      }
    }
    return initialOrders;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('nailash_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('nailash_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('nailash_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem('nailash_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('nailash_settings');
    return saved ? JSON.parse(saved) : initialStoreSettings;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nailash_cart');
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          image: normalizeAssetUrl(item.image)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('nailash_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>(() => {
    const saved = localStorage.getItem('nailash_stock_history');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'sh-001',
            productId: 'prod-001',
            productName: 'Embroidered Lawn Suit (3-Piece)',
            sku: 'NL-LWN-001',
            color: 'Sage Green',
            size: 'M',
            change: -1,
            reason: 'sale',
            date: '2026-03-29T11:42:00Z',
            updatedBy: 'Order NL-2026-000101'
          }
        ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nailash_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nailash_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nailash_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('nailash_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('nailash_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('nailash_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nailash_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('nailash_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nailash_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('nailash_stock_history', JSON.stringify(stockHistory));
  }, [stockHistory]);

  // Auth operations
  const loginAsCustomer = (email: string) => {
    const clean = email.trim().toLowerCase();
    const found = customers.find((c) => c.email.toLowerCase() === clean);
    if (found) {
      setCurrentUser(found);
      setUserRole('customer');
      if (clean === 'nailasher020@gmail.com') {
        loginAdmin('nailasher020@gmail.com', 'nailash123', true);
        showToast('Welcome back Naila Sher! Store manager session activated.', 'success');
      } else {
        showToast(`Welcome back, ${found.name}!`, 'success');
      }
      return true;
    } else {
      // Create quick account if not found
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: clean === 'nailasher020@gmail.com' ? 'Naila Sher' : email.split('@')[0],
        email: clean,
        phone: '03001234567',
        city: 'Lahore',
        totalOrders: 0,
        totalSpent: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setCustomers((prev) => [newCust, ...prev]);
      setCurrentUser(newCust);
      setUserRole('customer');
      if (clean === 'nailasher020@gmail.com') {
        loginAdmin('nailasher020@gmail.com', 'nailash123', true);
        showToast('Welcome Naila Sher! Store manager session activated.', 'success');
      } else {
        showToast(`Welcome to Nailash, ${newCust.name}!`, 'success');
      }
      return true;
    }
  };

  const registerCustomer = (customerData: Partial<Customer>) => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: customerData.name || 'Valued Client',
      email: customerData.email || `client_${Date.now()}@nailash.com`,
      phone: customerData.phone || '03000000000',
      city: customerData.city || 'Lahore',
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) => [newCust, ...prev]);
    setCurrentUser(newCust);
    setUserRole('customer');

    // Add admin notification
    addNotification({
      type: 'customer',
      title: 'New Customer Registered',
      message: `${newCust.name} (${newCust.city}) created an account.`
    });

    showToast(`Account created successfully! Welcome, ${newCust.name}`, 'success');
    return true;
  };

  const logout = () => {
    if (currentUser && isAuthorizedOwnerEmail(currentUser.email)) {
      clearAdminSession();
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      setUserRole('customer');
    }
    setCurrentUser(null);
    showToast('Signed out of session', 'info');
  };

  // Notifications helper
  const addNotification = (item: {
    type: AdminNotification['type'];
    title: string;
    message: string;
    linkTab?: string;
    orderId?: string;
  }) => {
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: item.type,
      title: item.title,
      message: item.message,
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: item.linkTab,
      orderId: item.orderId
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Product Operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProd: Product = {
      ...productData,
      images: sanitizeImages(productData.images),
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" added to catalog`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              ...(updates.images ? { images: sanitizeImages(updates.images) } : {}),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product "${target?.name || ''}" removed`, 'info');
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copy)`,
      sku: `${target.sku}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts((prev) => [duplicated, ...prev]);
    showToast(`Product duplicated as "${duplicated.name}"`, 'success');
  };

  const togglePublishProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'published' ? 'draft' : 'published';
          return { ...p, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
    showToast('Product status updated', 'info');
  };

  // Inventory Management
  const adjustStock = (
    productId: string,
    colorName: string,
    size: ClothingSize,
    delta: number,
    reason: 'sale' | 'restock' | 'adjustment' | 'return' | 'cancellation'
  ) => {
    let prodName = '';
    let prodSku = '';
    let newStockLevel = 0;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        prodName = p.name;
        prodSku = p.sku;

        const updatedColors = p.colors.map((c) => {
          if (c.name.toLowerCase() !== colorName.toLowerCase()) return c;
          const updatedSizes = c.sizes.map((s) => {
            if (s.size !== size) return s;
            const updatedStock = Math.max(0, s.stock + delta);
            newStockLevel = updatedStock;
            return { ...s, stock: updatedStock };
          });
          return { ...c, sizes: updatedSizes };
        });

        // Check if low stock threshold reached
        if (newStockLevel <= p.lowStockThreshold && newStockLevel > 0) {
          addNotification({
            type: 'stock',
            title: 'Low Stock Alert',
            message: `${p.name} (${colorName} - ${size}) is down to ${newStockLevel} units!`,
            linkTab: 'inventory'
          });
        } else if (newStockLevel === 0) {
          addNotification({
            type: 'stock',
            title: 'Out of Stock Alert',
            message: `${p.name} (${colorName} - ${size}) is now OUT OF STOCK!`,
            linkTab: 'inventory'
          });
        }

        return { ...p, colors: updatedColors, updatedAt: new Date().toISOString() };
      })
    );

    // Record stock history audit
    const historyEntry: StockHistoryItem = {
      id: `sh-${Date.now()}`,
      productId,
      productName: prodName,
      sku: prodSku,
      color: colorName,
      size,
      change: delta,
      reason,
      date: new Date().toISOString(),
      updatedBy: 'Admin Adjustment'
    };
    setStockHistory((prev) => [historyEntry, ...prev]);
    showToast(`Inventory adjusted: ${delta > 0 ? '+' : ''}${delta} for ${size}`, 'info');
  };

  // Cart operations
  const addToCart = (
    product: Product,
    colorName: string,
    colorHex: string,
    size: ClothingSize,
    quantity: number
  ) => {
    // Check available stock
    const colorObj = product.colors.find((c) => c.name === colorName);
    const sizeObj = colorObj?.sizes.find((s) => s.size === size);
    const availableStock = sizeObj?.stock ?? 0;

    if (availableStock <= 0) {
      showToast(`Selected size ${size} is currently out of stock`, 'error');
      return false;
    }

    const cartItemId = `${product.id}-${colorName}-${size}`;
    const effectivePrice = product.salePrice ?? product.price;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const targetQty = Math.min(existing.quantity + quantity, availableStock);
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: targetQty, maxStock: availableStock }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          image: normalizeAssetUrl(product.images[0] || ''),
          colorName,
          colorHex,
          size,
          price: effectivePrice,
          quantity: Math.min(quantity, availableStock),
          maxStock: availableStock
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.name} (${size})" to your bag`, 'success');
    return true;
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const clamped = Math.min(newQty, item.maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from shopping bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.productId === productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((w) => w.productId !== productId);
      } else {
        showToast('Saved to Wishlist', 'success');
        return [{ productId, addedAt: new Date().toISOString() }, ...prev];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((w) => w.productId === productId);

  // Coupons
  const applyCouponCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === clean && c.isActive);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (cartTotal < coupon.minOrder) {
      return {
        success: false,
        message: `Minimum order of Rs. ${coupon.minOrder.toLocaleString()} required for this code`
      };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { success: false, message: 'This coupon usage limit has been reached' };
    }

    setAppliedCoupon(coupon);
    showToast(`Coupon "${coupon.code}" applied!`, 'success');
    return { success: true, message: `Coupon applied successfully!` };
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      usedCount: 0
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon code ${newCoupon.code} created!`, 'success');
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Orders creation and stock management
  const createOrder = ({
    customer,
    paymentMethod,
    jazzCashReference,
    jazzCashPhone
  }: {
    customer: Order['customer'];
    paymentMethod: PaymentMethod;
    jazzCashReference?: string;
    jazzCashPhone?: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    // Calculate discount
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.round((cartTotal * appliedCoupon.discountValue) / 100);
        if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
      } else {
        discount = appliedCoupon.discountValue;
      }
    }

    // Shipping calculation
    const shippingFee = cartTotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.defaultShippingFee;
    const finalTotal = Math.max(0, cartTotal - discount + shippingFee);

    // Generate unique order ID: NL-2026-XXXXXX
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `NL-2026-${randomSuffix}`;

    // Map cart items to order items
    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      image: normalizeAssetUrl(item.image),
      colorName: item.colorName,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }));

    // Payment initial status
    // For JazzCash, status remains 'pending' until verified or confirmed
    const paymentStatus: PaymentStatus = 'pending';

    const newOrder: Order = {
      id: orderId,
      customer,
      items: orderItems,
      itemCount: cartCount,
      subtotal: cartTotal,
      discount,
      couponCode: appliedCoupon?.code,
      shippingFee,
      total: finalTotal,
      paymentMethod,
      paymentStatus,
      jazzCashReference: jazzCashReference || undefined,
      jazzCashPhone: jazzCashPhone || undefined,
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: paymentMethod === 'jazzcash'
            ? `Order placed via JazzCash (Ref: ${jazzCashReference || 'Awaiting verification'})`
            : 'Order placed via Cash on Delivery'
        }
      ]
    };

    // 1. Reduce inventory automatically
    cart.forEach((item) => {
      adjustStock(item.productId, item.colorName, item.size, -item.quantity, 'sale');
    });

    // 2. Increment coupon used count if used
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c
        )
      );
    }

    // 3. Update customer stats
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.email.toLowerCase() === customer.email.toLowerCase()
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + finalTotal,
                lastOrderDate: new Date().toISOString()
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          city: customer.city,
          totalOrders: 1,
          totalSpent: finalTotal,
          lastOrderDate: new Date().toISOString(),
          status: 'active',
          createdAt: new Date().toISOString()
        };
        return [newCust, ...prev];
      }
    });

    // 4. Save order
    setOrders((prev) => [newOrder, ...prev]);

    try {
      const storedMyOrderIds: string[] = JSON.parse(localStorage.getItem('nailash_my_orders') || '[]');
      if (!storedMyOrderIds.includes(orderId)) {
        localStorage.setItem('nailash_my_orders', JSON.stringify([orderId, ...storedMyOrderIds]));
      }
      localStorage.setItem('nailash_last_customer_email', customer.email);
    } catch {
      // fallback
    }

    // 5. Create admin notification
    const paymentLabel = paymentMethod === 'cod' ? 'Cash on Delivery' : 'JazzCash';
    addNotification({
      type: 'order',
      title: 'New NAILASH Order Received',
      message: `Order: ${orderId}\nCustomer: ${customer.fullName}\nTotal: Rs. ${finalTotal.toLocaleString()}\nPayment: ${paymentLabel}`,
      linkTab: 'orders',
      orderId
    });

    // 6. Reset cart & applied coupon
    setCart([]);
    setAppliedCoupon(null);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        // If transitioning to cancelled or returned, restore inventory
        if (
          (status === 'cancelled' || status === 'returned') &&
          o.orderStatus !== 'cancelled' &&
          o.orderStatus !== 'returned'
        ) {
          o.items.forEach((item) => {
            adjustStock(
              item.productId,
              item.colorName,
              item.size,
              item.quantity,
              status === 'cancelled' ? 'cancellation' : 'return'
            );
          });
        }

        const newTimeline = [
          ...o.timeline,
          {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Order status updated to ${status}`
          }
        ];

        return {
          ...o,
          orderStatus: status,
          updatedAt: new Date().toISOString(),
          timeline: newTimeline
        };
      })
    );
    showToast(`Order #${orderId} marked as ${status}`, 'success');
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus, customPaidAt?: string) => {
    const paymentReceivedTime = status === 'paid' ? (customPaidAt || new Date().toISOString()) : undefined;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        const updatedTimeline = [
          ...o.timeline,
          {
            status: o.orderStatus,
            timestamp: new Date().toISOString(),
            note: status === 'paid'
              ? `Payment confirmed as PAID (${o.paymentMethod === 'cod' ? 'Cash on Delivery received' : 'Verified'})`
              : `Payment status changed to ${status.toUpperCase()}`
          }
        ];

        return {
          ...o,
          paymentStatus: status,
          paidAt: paymentReceivedTime !== undefined ? paymentReceivedTime : (status === 'paid' ? o.paidAt : undefined),
          updatedAt: new Date().toISOString(),
          timeline: updatedTimeline
        };
      })
    );

    addNotification({
      type: 'payment',
      title: 'Payment Status Updated',
      message: `Payment for Order #${orderId} set to ${status.toUpperCase()}${status === 'paid' ? ' (Cash verified & saved)' : ''}`,
      linkTab: 'orders',
      orderId
    });

    showToast(`Payment status for #${orderId} updated to ${status.toUpperCase()}`, 'success');
  };

  // Review Operations
  const submitReview = (reviewData: Omit<Review, 'id' | 'status' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => [newRev, ...prev]);

    addNotification({
      type: 'review',
      title: 'New Product Review Submitted',
      message: `${newRev.customerName} reviewed "${newRev.productName}" (${newRev.rating} stars).`,
      linkTab: 'reviews'
    });

    showToast('Thank you! Your review has been submitted for review.', 'success');
  };

  const updateReviewStatus = (reviewId: string, status: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    showToast(`Review marked as ${status}`, 'info');
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Review deleted', 'info');
  };

  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...updates }));
    showToast('Store settings saved successfully', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        selectedCategory,
        setSelectedCategory,
        searchKeyword,
        setSearchKeyword,
        userRole,
        setUserRole,
        currentUser,
        loginAsCustomer,
        registerCustomer,
        logout,
        adminUser,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        adminTab,
        setAdminTab,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        togglePublishProduct,
        stockHistory,
        adjustStock,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCouponCode,
        removeAppliedCoupon,
        addCoupon,
        toggleCouponActive,
        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        customers,
        reviews,
        submitReview,
        updateReviewStatus,
        deleteReview,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        storeSettings,
        updateStoreSettings,
        toast,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
