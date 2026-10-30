import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  calculateCartTotals,
  isValidStatusTransition,
  generateOrderReference,
  FREE_DELIVERY_THRESHOLD,
} from './orderCalculator';
import { CartItem, Offer } from '../types';

test('calculateItemUnitPrice adds base price, size delta, and addons correctly', () => {
  const basePrice = 350;
  const sizeDelta = 100; // Large
  const addons = [{ priceDelta: 40 }, { priceDelta: 20 }];
  const unitPrice = calculateItemUnitPrice(basePrice, sizeDelta, addons);
  assert.equal(unitPrice, 510);
});

test('calculateCartTotals calculates standard delivery fee below free threshold', () => {
  const dummyItem: CartItem = {
    id: 'c1',
    menuItem: {
      id: 'm1',
      restaurantId: 'r1',
      categoryId: 'cat1',
      name: 'Paneer Tikka',
      description: 'Charred cottage cheese',
      price: 300,
      imageUrl: '',
      dietaryType: 'veg',
      availability: true,
      rating: 4.8,
    },
    restaurantId: 'r1',
    restaurantName: 'The Royal Awadh',
    quantity: 1,
    unitPrice: 300,
    customization: {},
    itemSubtotal: 300,
  };

  const totals = calculateCartTotals([dummyItem], null, 40);
  assert.equal(totals.subtotal, 300);
  assert.equal(totals.deliveryFee, 40);
  assert.equal(totals.tax, 15); // 5% of 300
  assert.equal(totals.discount, 0);
  assert.equal(totals.finalTotal, 355);
});

test('calculateCartTotals waives delivery fee when subtotal >= free delivery threshold', () => {
  const dummyItem: CartItem = {
    id: 'c2',
    menuItem: {
      id: 'm2',
      restaurantId: 'r1',
      categoryId: 'cat1',
      name: 'Awadhi Biryani Feast',
      description: 'Royal biryani',
      price: 600,
      imageUrl: '',
      dietaryType: 'non-veg',
      availability: true,
      rating: 4.9,
    },
    restaurantId: 'r1',
    restaurantName: 'The Royal Awadh',
    quantity: 1,
    unitPrice: 600,
    customization: {},
    itemSubtotal: 600,
  };

  const totals = calculateCartTotals([dummyItem], null, 40);
  assert.equal(totals.subtotal, 600);
  assert.equal(totals.deliveryFee, 0);
  assert.equal(totals.tax, 30); // 5% of 600
  assert.equal(totals.finalTotal, 630);
});

test('calculateCartTotals applies percentage discount up to max cap with code validation', () => {
  const dummyItem: CartItem = {
    id: 'c3',
    menuItem: {
      id: 'm3',
      restaurantId: 'r1',
      categoryId: 'cat1',
      name: 'Truffle Pizza',
      description: 'Artisanal pizza',
      price: 800,
      imageUrl: '',
      dietaryType: 'veg',
      availability: true,
      rating: 4.9,
    },
    restaurantId: 'r1',
    restaurantName: 'Artisan Crust & Co.',
    quantity: 1,
    unitPrice: 800,
    customization: {},
    itemSubtotal: 800,
  };

  const offer: Offer = {
    code: 'SAVORA50',
    title: '50% Off Gourmet',
    description: '50% off up to ₹150',
    discountPercent: 50,
    maxDiscount: 150,
    minOrderValue: 400,
    badge: '50% OFF',
  };

  const totals = calculateCartTotals([dummyItem], offer, 40);
  assert.equal(totals.subtotal, 800);
  // 50% of 800 is 400, but capped at maxDiscount 150
  assert.equal(totals.discount, 150);
  assert.equal(totals.finalTotal, 800 + 0 + 40 - 150); // 690
});

test('calculateCartTotals rejects promo if below minOrderValue', () => {
  const dummyItem: CartItem = {
    id: 'c4',
    menuItem: {
      id: 'm4',
      restaurantId: 'r1',
      categoryId: 'cat1',
      name: 'Garlic Bread',
      description: 'Herbed sourdough',
      price: 200,
      imageUrl: '',
      dietaryType: 'veg',
      availability: true,
      rating: 4.7,
    },
    restaurantId: 'r1',
    restaurantName: 'Artisan Crust & Co.',
    quantity: 1,
    unitPrice: 200,
    customization: {},
    itemSubtotal: 200,
  };

  const offer: Offer = {
    code: 'SAVORA50',
    title: '50% Off Gourmet',
    description: '50% off on orders above 400',
    discountPercent: 50,
    maxDiscount: 150,
    minOrderValue: 400,
    badge: '50% OFF',
  };

  const totals = calculateCartTotals([dummyItem], offer, 40);
  assert.equal(totals.discount, 0);
  assert.ok(totals.discountError?.includes('Add items worth ₹200 more'));
});

test('isValidStatusTransition validates sequential order flow and cancellation', () => {
  assert.equal(isValidStatusTransition('ORDER PLACED', 'ORDER CONFIRMED'), true);
  assert.equal(isValidStatusTransition('ORDER CONFIRMED', 'PREPARING'), true);
  assert.equal(isValidStatusTransition('PREPARING', 'READY FOR PICKUP'), true);
  assert.equal(isValidStatusTransition('READY FOR PICKUP', 'OUT FOR DELIVERY'), true);
  assert.equal(isValidStatusTransition('OUT FOR DELIVERY', 'DELIVERED'), true);

  // Cancellation allowed early
  assert.equal(isValidStatusTransition('ORDER PLACED', 'CANCELLED'), true);
  assert.equal(isValidStatusTransition('ORDER CONFIRMED', 'CANCELLED'), true);

  // Cancellation disallowed once preparing or out
  assert.equal(isValidStatusTransition('PREPARING', 'CANCELLED'), false);
  assert.equal(isValidStatusTransition('OUT FOR DELIVERY', 'CANCELLED'), false);

  // Moving backwards is disallowed
  assert.equal(isValidStatusTransition('OUT FOR DELIVERY', 'PREPARING'), false);

  // Delivered cannot transition
  assert.equal(isValidStatusTransition('DELIVERED', 'CANCELLED'), false);
});

test('generateOrderReference formats valid reference string', () => {
  const ref = generateOrderReference(123456);
  assert.equal(ref, 'SAV-123456');
  const randomRef = generateOrderReference();
  assert.match(randomRef, /^SAV-\d{6}$/);
});
