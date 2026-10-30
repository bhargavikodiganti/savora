import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Restaurant,
  Category,
  MenuItem,
  CartItem,
  CartCustomizationSelection,
  Offer,
  Customer,
  Address,
  Order,
  OrderStatus,
  PaymentMethod,
  Review,
  OrderDetail,
  OrderStatusHistoryItem,
} from '../types';
import {
  initialCategories,
  initialRestaurants,
  initialMenuItems,
  initialOffers,
  initialCustomer,
  initialAddresses,
  initialOrders,
  initialReviews,
} from '../data/initialData';
import {
  calculateCartTotals,
  calculateItemUnitPrice,
  generateOrderReference,
  isValidStatusTransition,
} from '../utils/orderCalculator';

export type AppView =
  | 'home'
  | 'restaurants'
  | 'restaurant-detail'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'account'
  | 'admin';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  navigateTo: (
    view: AppView,
    params?: { restaurantId?: string; categoryId?: string; orderId?: string }
  ) => void;

  // Selected entities for deep view
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  activeCategoryFilter: string | null;
  setActiveCategoryFilter: (catId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Domain data
  restaurants: Restaurant[];
  categories: Category[];
  menuItems: MenuItem[];
  offers: Offer[];
  appliedOffer: Offer | null;

  // Cart operations
  cartItems: CartItem[];
  cartTotals: ReturnType<typeof calculateCartTotals>;
  addToCart: (
    item: MenuItem,
    customization: CartCustomizationSelection,
    quantity?: number
  ) => { success: boolean; error?: string };
  updateCartItemQuantity: (cartItemId: string, newQuantity: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Customization modal
  customizingMenuItem: MenuItem | null;
  setCustomizingMenuItem: (item: MenuItem | null) => void;

  // Delivery & Customer
  customer: Customer;
  updateCustomer: (data: Partial<Customer>) => void;
  deliveryAddress: Address;
  setDeliveryAddress: (addr: Address) => void;
  savedAddresses: Address[];
  addSavedAddress: (addr: Omit<Address, 'id' | 'customerId'>) => Address;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Orders & Tracking
  orders: Order[];
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  placeOrder: (options: {
    address: Address;
    instructions?: string;
    paymentMethod: PaymentMethod;
  }) => Order;
  cancelOrder: (orderId: string, reason?: string) => boolean;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, remarks?: string) => boolean;

  // Admin management actions
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
  toggleRestaurantStatus: (id: string) => void;
  addRestaurant: (rest: Omit<Restaurant, 'id'>) => Restaurant;

  // Reviews
  reviews: Review[];
  addReview: (restaurantId: string, rating: number, comment: string, orderId?: string) => void;

  // SAVI Assistant
  isSaviOpen: boolean;
  setIsSaviOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  ORDERS: 'savora_orders_v1',
  CART: 'savora_cart_v1',
  MENU: 'savora_menu_v1',
  RESTAURANTS: 'savora_restaurants_v1',
  ADDRESSES: 'savora_addresses_v1',
  CUSTOMER: 'savora_customer_v1',
  OFFER: 'savora_offer_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    return saved ? JSON.parse(saved) : initialRestaurants;
  });

  const [categories] = useState<Category[]>(initialCategories);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU);
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [offers] = useState<Offer[]>(initialOffers);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFER);
    return saved ? JSON.parse(saved) : null;
  });

  const [customer, setCustomer] = useState<Customer>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
    return saved ? JSON.parse(saved) : initialCustomer;
  });

  const [savedAddresses, setSavedAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
    return saved ? JSON.parse(saved) : initialAddresses;
  });

  const [deliveryAddress, setDeliveryAddress] = useState<Address>(
    savedAddresses[0] || initialAddresses[0]
  );

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );

  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [customizingMenuItem, setCustomizingMenuItem] = useState<MenuItem | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSaviOpen, setIsSaviOpen] = useState(false);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  // Derived delivery fee from active restaurant in cart
  const activeCartRestaurant = restaurants.find(
    (r) => cartItems.length > 0 && r.id === cartItems[0].restaurantId
  );
  const cartTotals = calculateCartTotals(
    cartItems,
    appliedOffer,
    activeCartRestaurant?.deliveryFee ?? 40
  );

  const navigateTo = (
    view: AppView,
    params?: { restaurantId?: string; categoryId?: string; orderId?: string }
  ) => {
    if (params?.restaurantId) setSelectedRestaurantId(params.restaurantId);
    if (params?.categoryId) setActiveCategoryFilter(params.categoryId);
    if (params?.orderId) setActiveTrackingOrderId(params.orderId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (
    item: MenuItem,
    customization: CartCustomizationSelection,
    quantity: number = 1
  ): { success: boolean; error?: string } => {
    if (!item.availability) {
      return { success: false, error: 'This item is currently unavailable.' };
    }

    // Single-restaurant enforcement
    if (cartItems.length > 0 && cartItems[0].restaurantId !== item.restaurantId) {
      const currentRestaurant = restaurants.find((r) => r.id === cartItems[0].restaurantId);
      return {
        success: false,
        error: `Your cart contains items from ${currentRestaurant?.name || 'another restaurant'}. Reset cart to order from here?`,
      };
    }

    const restaurant = restaurants.find((r) => r.id === item.restaurantId);
    const sizeDelta = customization.size?.priceDelta || 0;
    const unitPrice = calculateItemUnitPrice(
      item.price,
      sizeDelta,
      customization.selectedAddons || []
    );

    // Check if matching item + customization already exists
    const customizationKey = JSON.stringify({
      size: customization.size?.name,
      spice: customization.spiceLevel,
      addons: customization.selectedAddons?.map((a) => a.name).sort(),
      instructions: customization.specialInstructions?.trim() || '',
    });

    const existingIndex = cartItems.findIndex(
      (c) =>
        c.menuItem.id === item.id &&
        JSON.stringify({
          size: c.customization.size?.name,
          spice: c.customization.spiceLevel,
          addons: c.customization.selectedAddons?.map((a) => a.name).sort(),
          instructions: c.customization.specialInstructions?.trim() || '',
        }) === customizationKey
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + quantity;
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].itemSubtotal = newQty * updated[existingIndex].unitPrice;
      setCartItems(updated);
    } else {
      const newEntry: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        menuItem: item,
        restaurantId: item.restaurantId,
        restaurantName: restaurant?.name || 'SAVORA Restaurant',
        quantity,
        unitPrice,
        customization,
        itemSubtotal: unitPrice * quantity,
      };
      setCartItems([...cartItems, newEntry]);
    }

    setIsCartDrawerOpen(true);
    return { success: true };
  };

  const updateCartItemQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeCartItem(cartItemId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity: newQuantity,
              itemSubtotal: newQuantity * item.unitPrice,
            }
          : item
      )
    );
  };

  const removeCartItem = (cartItemId: string) => {
    const next = cartItems.filter((i) => i.id !== cartItemId);
    setCartItems(next);
    if (next.length === 0) {
      setAppliedOffer(null);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedOffer(null);
  };

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const formatted = code.trim().toUpperCase();
    const offer = offers.find((o) => o.code.toUpperCase() === formatted);
    if (!offer) {
      return { success: false, message: 'Invalid promo code. Try SAVORA50 or FIRSTSAVOR.' };
    }

    const subtotal = cartItems.reduce((s, i) => s + i.itemSubtotal, 0);
    if (subtotal < offer.minOrderValue) {
      return {
        success: false,
        message: `Add ₹${offer.minOrderValue - subtotal} more items to activate ${offer.code}.`,
      };
    }

    setAppliedOffer(offer);
    localStorage.setItem(STORAGE_KEYS.OFFER, JSON.stringify(offer));
    return { success: true, message: `Promo code ${offer.code} applied successfully!` };
  };

  const removePromoCode = () => {
    setAppliedOffer(null);
    localStorage.removeItem(STORAGE_KEYS.OFFER);
  };

  const updateCustomer = (data: Partial<Customer>) => {
    const updated = { ...customer, ...data };
    setCustomer(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(updated));
  };

  const addSavedAddress = (addr: Omit<Address, 'id' | 'customerId'>): Address => {
    const newAddress: Address = {
      ...addr,
      id: `addr_${Date.now()}`,
      customerId: customer.id,
      isDefault: savedAddresses.length === 0,
    };
    const next = [...savedAddresses, newAddress];
    setSavedAddresses(next);
    setDeliveryAddress(newAddress);
    return newAddress;
  };

  const placeOrder = ({
    address,
    instructions,
    paymentMethod,
  }: {
    address: Address;
    instructions?: string;
    paymentMethod: PaymentMethod;
  }): Order => {
    const ref = generateOrderReference();
    const restaurantId = cartItems[0]?.restaurantId || 'rest-royal-awadh';
    const restaurant = restaurants.find((r) => r.id === restaurantId);

    const orderDetails: OrderDetail[] = cartItems.map((c, index) => {
      const summaryParts = [];
      if (c.customization.size) summaryParts.push(c.customization.size.name);
      if (c.customization.spiceLevel) summaryParts.push(c.customization.spiceLevel);
      if (c.customization.selectedAddons && c.customization.selectedAddons.length > 0) {
        summaryParts.push(c.customization.selectedAddons.map((a) => a.name).join(', '));
      }
      if (c.customization.specialInstructions) {
        summaryParts.push(`Note: ${c.customization.specialInstructions}`);
      }

      return {
        id: `detail_${Date.now()}_${index}`,
        orderId: `ord_${Date.now()}`,
        itemId: c.menuItem.id,
        itemNameSnapshot: c.menuItem.name,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        customizationSummary: summaryParts.join(' · ') || 'Standard',
        subtotal: c.itemSubtotal,
      };
    });

    const initialHistory: OrderStatusHistoryItem = {
      id: `h_${Date.now()}`,
      orderId: `ord_${Date.now()}`,
      previousStatus: null,
      newStatus: 'ORDER PLACED',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remarks: 'Order placed by customer via ' + (paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : 'Online Payment') + '.',
    };

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderReference: ref,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      restaurantId,
      restaurantName: restaurant?.name || 'SAVORA Restaurant',
      orderDate: new Date().toISOString(),
      deliveryAddress: address,
      deliveryInstructions: instructions,
      items: orderDetails,
      subtotal: cartTotals.subtotal,
      tax: cartTotals.tax,
      deliveryFee: cartTotals.deliveryFee,
      discount: cartTotals.discount,
      totalAmount: cartTotals.finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      orderStatus: 'ORDER PLACED',
      estimatedDeliveryTime: restaurant?.deliveryTime || '35 mins',
      statusHistory: [initialHistory],
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    setActiveTrackingOrderId(newOrder.id);
    clearCart();
    return newOrder;
  };

  const cancelOrder = (orderId: string, reason: string = 'Cancelled by customer'): boolean => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return false;
    if (!isValidStatusTransition(target.orderStatus, 'CANCELLED')) {
      return false;
    }

    const historyItem: OrderStatusHistoryItem = {
      id: `h_${Date.now()}`,
      orderId,
      previousStatus: target.orderStatus,
      newStatus: 'CANCELLED',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remarks: reason,
    };

    const updatedOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            orderStatus: 'CANCELLED' as OrderStatus,
            statusHistory: [...o.statusHistory, historyItem],
          }
        : o
    );

    setOrders(updatedOrders);
    return true;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    remarks: string = `Status updated to ${newStatus}`
  ): boolean => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return false;

    const historyItem: OrderStatusHistoryItem = {
      id: `h_${Date.now()}`,
      orderId,
      previousStatus: target.orderStatus,
      newStatus,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remarks,
    };

    const updatedOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            orderStatus: newStatus,
            paymentStatus: newStatus === 'DELIVERED' ? ('PAID' as const) : o.paymentStatus,
            statusHistory: [...o.statusHistory, historyItem],
          }
        : o
    );

    setOrders(updatedOrders);
    return true;
  };

  // Admin menu actions
  const addMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
    const newItem: MenuItem = {
      ...item,
      id: `menu_${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, availability: !m.availability } : m))
    );
  };

  const toggleRestaurantStatus = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const addRestaurant = (rest: Omit<Restaurant, 'id'>): Restaurant => {
    const newRest: Restaurant = {
      ...rest,
      id: `rest_${Date.now()}`,
    };
    setRestaurants((prev) => [newRest, ...prev]);
    return newRest;
  };

  const addReview = (
    restaurantId: string,
    rating: number,
    comment: string,
    orderId?: string
  ) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      restaurantId,
      orderId,
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateTo,
        selectedRestaurantId,
        setSelectedRestaurantId,
        activeCategoryFilter,
        setActiveCategoryFilter,
        searchQuery,
        setSearchQuery,
        restaurants,
        categories,
        menuItems,
        offers,
        appliedOffer,
        cartItems,
        cartTotals,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        applyPromoCode,
        removePromoCode,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        customizingMenuItem,
        setCustomizingMenuItem,
        customer,
        updateCustomer,
        deliveryAddress,
        setDeliveryAddress,
        savedAddresses,
        addSavedAddress,
        isLocationModalOpen,
        setIsLocationModalOpen,
        orders,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemAvailability,
        toggleRestaurantStatus,
        addRestaurant,
        reviews,
        addReview,
        isSaviOpen,
        setIsSaviOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
