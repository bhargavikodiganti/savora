export type DietaryType = 'veg' | 'non-veg';

export type OrderStatus =
  | 'ORDER PLACED'
  | 'ORDER CONFIRMED'
  | 'PREPARING'
  | 'READY FOR PICKUP'
  | 'OUT FOR DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Address {
  id: string;
  customerId: string;
  type: 'Home' | 'Work' | 'Other';
  fullAddress: string;
  landmark: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  cuisine: string[];
  logoUrl: string;
  coverImageUrl: string;
  openingHours: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string; // e.g. "30-40 mins"
  minOrder: number; // e.g. 250
  deliveryFee: number; // e.g. 40
  isActive: boolean;
  priceLevel: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface CustomizationOption {
  name: string;
  priceDelta: number;
}

export interface MenuItemCustomizations {
  sizes?: { name: string; priceDelta: number }[];
  spiceLevels?: string[];
  addons?: { name: string; priceDelta: number }[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  dietaryType: DietaryType;
  availability: boolean;
  rating: number;
  customizationOptions?: MenuItemCustomizations;
  isBestseller?: boolean;
}

export interface CartCustomizationSelection {
  size?: { name: string; priceDelta: number };
  spiceLevel?: string;
  selectedAddons?: { name: string; priceDelta: number }[];
  specialInstructions?: string;
}

export interface CartItem {
  id: string; // unique cart entry id
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  unitPrice: number;
  customization: CartCustomizationSelection;
  itemSubtotal: number;
}

export interface OrderDetail {
  id: string;
  orderId: string;
  itemId: string;
  itemNameSnapshot: string;
  quantity: number;
  unitPrice: number;
  customizationSummary: string;
  subtotal: number;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId: string;
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  updatedAt: string;
  remarks: string;
}

export interface Order {
  id: string;
  orderReference: string; // e.g. "SAV-849201"
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  orderDate: string;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  items: OrderDetail[];
  subtotal: number;
  tax: number; // 5% GST
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  estimatedDeliveryTime: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  restaurantId: string;
  orderId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Offer {
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  badge: string;
}
