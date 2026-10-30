import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import {
  MapPin,
  Phone,
  User,
  Banknote,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  ArrowLeft,
  FileText,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cartItems,
    cartTotals,
    deliveryAddress,
    setDeliveryAddress,
    savedAddresses,
    setIsLocationModalOpen,
    customer,
    updateCustomer,
    placeOrder,
    navigateTo,
  } = useApp();

  const [customerName, setCustomerName] = useState(customer.name);
  const [customerPhone, setCustomerPhone] = useState(customer.phone);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [placedOrderRef, setPlacedOrderRef] = useState<string | null>(null);

  if (cartItems.length === 0 && !placedOrderRef) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-sm text-stone-600">Please add dishes from a restaurant before checking out.</p>
        <button
          onClick={() => navigateTo('restaurants')}
          className="px-5 py-2.5 bg-[#E65100] text-white rounded-xl text-sm font-semibold hover:bg-[#D84315]"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    // Save updated contact info to customer profile
    updateCustomer({ name: customerName.trim(), phone: customerPhone.trim() });

    const newOrder = placeOrder({
      address: deliveryAddress,
      instructions: deliveryInstructions.trim() || undefined,
      paymentMethod,
    });

    setPlacedOrderRef(newOrder.orderReference);
  };

  // Order Confirmation Screen
  if (placedOrderRef) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
              Order Confirmed & Transmitted
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Thank You, {customerName.split(' ')[0]}!
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
              Your order has been acknowledged by the restaurant kitchen and is being prepped.
            </p>
          </div>

          {/* Reference Box */}
          <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-stone-200 max-w-sm mx-auto">
            <span className="text-xs text-stone-500 font-medium">Order Reference Number</span>
            <p className="font-mono text-xl font-bold text-[#E65100] mt-0.5 tracking-wider">
              {placedOrderRef}
            </p>
          </div>

          {/* Delivery & Payment brief */}
          <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto p-4 rounded-xl bg-stone-50 text-xs">
            <div>
              <span className="text-stone-500 font-medium">Delivery To:</span>
              <p className="font-semibold text-stone-900 mt-0.5 truncate">
                {deliveryAddress.type}: {deliveryAddress.city}
              </p>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Payment Mode:</span>
              <p className="font-semibold text-stone-900 mt-0.5">
                {paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('order-tracking')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-sm font-semibold shadow-md transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Track Live Delivery Progress</span>
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const restaurantName = cartItems[0]?.restaurantName || 'SAVORA Gourmet Kitchen';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <button
        onClick={() => navigateTo('restaurants')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Continue Exploring Menus</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customer & Delivery Details */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <User className="w-5 h-5 text-[#E65100]" />
              <h2 className="text-base font-bold text-stone-900">1. Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="customer-name"
                  className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                >
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E65100]" />
                <h2 className="text-base font-bold text-stone-900">2. Delivery Address</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="text-xs font-semibold text-[#E65100] hover:underline"
              >
                Change Address
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#19191C] text-white">
                  {deliveryAddress.type}
                </span>
                <span className="text-xs font-semibold text-stone-900">
                  {deliveryAddress.city} - {deliveryAddress.postalCode}
                </span>
              </div>
              <p className="text-xs text-stone-700 mt-2 font-medium">
                {deliveryAddress.fullAddress}
              </p>
              {deliveryAddress.landmark && (
                <p className="text-xs text-stone-500 mt-1">
                  Landmark: {deliveryAddress.landmark}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="delivery-instructions"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Delivery Instructions (Optional)
              </label>
              <textarea
                id="delivery-instructions"
                rows={2}
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="e.g. Leave with security guard, don't ring the bell, gate code #482..."
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Banknote className="w-5 h-5 text-[#E65100]" />
              <h2 className="text-base font-bold text-stone-900">3. Payment Option</h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery (Functional) */}
              <label
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-[#E65100] bg-[#FFF8F5] shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className="accent-[#E65100] w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span>Cash on Delivery (COD)</span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Fully Supported
                      </span>
                    </span>
                    <p className="text-xs text-stone-500 mt-1">
                      Pay safely via Cash, UPI QR code or card at your doorstep upon arrival.
                    </p>
                  </div>
                </div>
              </label>

              {/* Online Payment (Placeholder for future gateway integration per spec) */}
              <label
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'ONLINE_PAYMENT'
                    ? 'border-[#E65100] bg-[#FFF8F5]'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'ONLINE_PAYMENT'}
                    onChange={() => setPaymentMethod('ONLINE_PAYMENT')}
                    className="accent-[#E65100] w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-stone-500" />
                      <span>Online Payment (UPI, Credit/Debit Card, NetBanking)</span>
                    </span>
                    <p className="text-xs text-stone-500 mt-1">
                      Pre-payment gateway readiness interface. (Transaction simulator will trigger instant order receipt).
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span>Confirm & Place Order</span>
            <div className="flex items-center gap-2">
              <span className="font-bold tabular-nums">₹{cartTotals.finalTotal}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </form>

        {/* Right Order Summary Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5 sticky top-28">
          <div>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Order Summary
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
              {restaurantName}
            </h3>
          </div>

          {/* Items breakdown */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cartItems.map((c) => (
              <div key={c.id} className="flex items-start justify-between text-xs py-2 border-b border-stone-100">
                <div className="flex-1 pr-3">
                  <div className="font-semibold text-stone-900">
                    {c.quantity} × {c.menuItem.name}
                  </div>
                  {c.customization.size && (
                    <div className="text-[11px] text-stone-500">{c.customization.size.name}</div>
                  )}
                  {c.customization.selectedAddons && c.customization.selectedAddons.length > 0 && (
                    <div className="text-[11px] text-stone-500">
                      + {c.customization.selectedAddons.map((a) => a.name).join(', ')}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₹{c.itemSubtotal}
                </span>
              </div>
            ))}
          </div>

          {/* Bill summary */}
          <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-semibold text-stone-900 tabular-nums">₹{cartTotals.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              {cartTotals.deliveryFee === 0 ? (
                <span className="font-semibold text-emerald-700">FREE</span>
              ) : (
                <span className="font-semibold text-stone-900 tabular-nums">₹{cartTotals.deliveryFee}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span>Taxes (GST 5%)</span>
              <span className="font-semibold text-stone-900 tabular-nums">₹{cartTotals.tax}</span>
            </div>
            {cartTotals.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Promo Discount</span>
                <span className="tabular-nums">-₹{cartTotals.discount}</span>
              </div>
            )}
            <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
              <span>Final Payable</span>
              <span className="font-serif text-lg text-[#E65100] tabular-nums">
                ₹{cartTotals.finalTotal}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>SAVORA Assured Hygiene & Contactless Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
