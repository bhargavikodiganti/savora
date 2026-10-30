import { CartItem, Offer, OrderStatus } from '../types';

export const TAX_RATE = 0.05; // 5% GST
export const FREE_DELIVERY_THRESHOLD = 500;
export const STANDARD_DELIVERY_FEE = 40;

/**
 * Calculates the unit price of an item including size and addon customizations
 */
export function calculateItemUnitPrice(
  basePrice: number,
  sizeDelta: number = 0,
  addons: { priceDelta: number }[] = []
): number {
  const addonsTotal = addons.reduce((sum, a) => sum + (a.priceDelta || 0), 0);
  return Math.max(0, basePrice + sizeDelta + addonsTotal);
}

/**
 * Calculates the total breakdown for a list of cart items and an optional offer
 */
export function calculateCartTotals(
  items: CartItem[],
  appliedOffer: Offer | null = null,
  restaurantDeliveryFee: number = STANDARD_DELIVERY_FEE
): {
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  finalTotal: number;
  discountError?: string;
} {
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.itemSubtotal, 0);

  if (subtotal === 0) {
    return {
      itemsCount: 0,
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      discount: 0,
      finalTotal: 0,
    };
  }

  // Free delivery if above threshold
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : restaurantDeliveryFee;
  const tax = Math.round(subtotal * TAX_RATE);

  let discount = 0;
  let discountError: string | undefined;

  if (appliedOffer) {
    if (subtotal < appliedOffer.minOrderValue) {
      discountError = `Add items worth ₹${appliedOffer.minOrderValue - subtotal} more to apply code ${appliedOffer.code}`;
    } else {
      const calculatedDiscount = Math.round((subtotal * appliedOffer.discountPercent) / 100);
      discount = Math.min(calculatedDiscount, appliedOffer.maxDiscount);
    }
  }

  const finalTotal = Math.max(0, subtotal + deliveryFee + tax - discount);

  return {
    itemsCount,
    subtotal,
    deliveryFee,
    tax,
    discount,
    finalTotal,
    discountError,
  };
}

/**
 * Status sequence order for SAVORA order lifecycle
 */
export const ORDER_LIFECYCLE: OrderStatus[] = [
  'ORDER PLACED',
  'ORDER CONFIRMED',
  'PREPARING',
  'READY FOR PICKUP',
  'OUT FOR DELIVERY',
  'DELIVERED',
];

/**
 * Validates whether transitioning from currentStatus to nextStatus is permissible
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean {
  if (currentStatus === nextStatus) return true;
  if (currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') {
    return false; // Terminal states
  }

  if (nextStatus === 'CANCELLED') {
    // Only allowed before preparation starts
    return currentStatus === 'ORDER PLACED' || currentStatus === 'ORDER CONFIRMED';
  }

  const currentIndex = ORDER_LIFECYCLE.indexOf(currentStatus);
  const nextIndex = ORDER_LIFECYCLE.indexOf(nextStatus);

  if (currentIndex === -1 || nextIndex === -1) return false;

  // Moving forward in lifecycle is allowed
  return nextIndex > currentIndex;
}

/**
 * Generates an authentic order reference ID e.g. "SAV-849201"
 */
export function generateOrderReference(seed?: number): string {
  const num = seed !== undefined ? seed : Math.floor(100000 + Math.random() * 900000);
  return `SAV-${num}`;
}
