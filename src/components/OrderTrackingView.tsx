import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ORDER_LIFECYCLE } from '../utils/orderCalculator';
import { OrderStatus } from '../types';
import {
  Clock,
  CheckCircle2,
  Package,
  Bike,
  Utensils,
  AlertCircle,
  RefreshCw,
  Phone,
  ArrowLeft,
  XCircle,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    activeTrackingOrderId,
    setActiveTrackingOrderId,
    cancelOrder,
    navigateTo,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');

  // Select active order or fallback to first order
  const activeOrder =
    orders.find((o) => o.id === activeTrackingOrderId) || orders[0] || null;

  // Periodic status refresh simulation (polling backend state)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate periodic polling check
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  if (!activeOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">No Active Orders Found</h2>
        <p className="text-sm text-stone-600">You do not have any orders to track currently.</p>
        <button
          onClick={() => navigateTo('restaurants')}
          className="px-5 py-2.5 bg-[#E65100] text-white rounded-xl text-sm font-semibold hover:bg-[#D84315]"
        >
          Discover Restaurants
        </button>
      </div>
    );
  }

  const isCancelled = activeOrder.orderStatus === 'CANCELLED';
  const isDelivered = activeOrder.orderStatus === 'DELIVERED';
  const canCancel =
    activeOrder.orderStatus === 'ORDER PLACED' || activeOrder.orderStatus === 'ORDER CONFIRMED';

  const currentStepIndex = ORDER_LIFECYCLE.indexOf(activeOrder.orderStatus);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'ORDER PLACED':
        return <Package className="w-5 h-5" />;
      case 'ORDER CONFIRMED':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'PREPARING':
        return <Utensils className="w-5 h-5" />;
      case 'READY FOR PICKUP':
        return <Package className="w-5 h-5" />;
      case 'OUT FOR DELIVERY':
        return <Bike className="w-5 h-5" />;
      case 'DELIVERED':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const handleConfirmCancel = () => {
    cancelOrder(activeOrder.id, cancelReason);
    setCancelModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigateTo('account')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Account</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Live Order Progress
            </h1>
            <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-[#E65100] border border-stone-200">
              {activeOrder.orderReference}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {orders.length > 1 && (
            <select
              value={activeOrder.id}
              onChange={(e) => setActiveTrackingOrderId(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-700"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderReference} · {o.restaurantName} ({o.orderStatus})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
            title="Refresh order status from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
              {isCancelled ? 'Order Status' : 'Estimated Arrival'}
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                {isCancelled
                  ? 'Cancelled'
                  : isDelivered
                  ? 'Delivered to You'
                  : activeOrder.estimatedDeliveryTime}
              </h2>
              {!isCancelled && !isDelivered && (
                <span className="text-xs text-stone-500 font-medium">
                  from {activeOrder.restaurantName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canCancel && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
              >
                Cancel Order
              </button>
            )}
            <div className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold">
              Status: <span className="text-[#E65100]">{activeOrder.orderStatus}</span>
            </div>
          </div>
        </div>

        {/* Desktop Horizontal Lifecycle Progress Tracker */}
        {!isCancelled && (
          <div className="hidden lg:block py-4">
            <div className="grid grid-cols-6 gap-2 relative">
              {/* Connector line */}
              <div className="absolute top-5 left-1/12 right-1/12 h-1 bg-stone-200 -z-0">
                <div
                  className="h-full bg-[#E65100] transition-all duration-700 ease-in-out"
                  style={{
                    width: `${Math.max(
                      0,
                      (currentStepIndex / (ORDER_LIFECYCLE.length - 1)) * 100
                    )}%`,
                  }}
                />
              </div>

              {ORDER_LIFECYCLE.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#E65100] text-white ring-4 ring-[#E65100]/20 shadow-md scale-110'
                          : isPassed
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      {getStatusIcon(step)}
                    </div>
                    <span
                      className={`mt-3 text-[11px] font-bold uppercase tracking-wider ${
                        isCurrent
                          ? 'text-[#E65100]'
                          : isPassed
                          ? 'text-stone-900'
                          : 'text-stone-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile & Tablet Vertical Progress Tracker */}
        {!isCancelled && (
          <div className="lg:hidden space-y-4">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Order Timeline
            </h3>
            <div className="space-y-4 relative pl-6 border-l-2 border-stone-200">
              {ORDER_LIFECYCLE.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="relative">
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isCurrent
                          ? 'bg-[#E65100] text-white ring-2 ring-[#E65100]/30'
                          : isPassed
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-[#E65100]'
                            : isPassed
                            ? 'text-stone-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {step}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled Alert */}
        {isCancelled && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-900 space-y-1">
              <h4 className="font-bold">This order has been cancelled</h4>
              <p>
                No charges have been incurred for Cash on Delivery. If paid online, your refund will
                be processed within standard banking cycles.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Details Grid: Left Items List, Right Timeline & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Left: Items in this order */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Kitchen
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {activeOrder.restaurantName}
              </h3>
            </div>
            <span className="text-xs text-stone-500">
              {new Date(activeOrder.orderDate).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="space-y-3">
            {activeOrder.items.map((it) => (
              <div
                key={it.id}
                className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-start justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-stone-900">
                    {it.quantity} × {it.itemNameSnapshot}
                  </div>
                  {it.customizationSummary && (
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {it.customizationSummary}
                    </p>
                  )}
                </div>
                <span className="font-bold text-stone-900 tabular-nums">
                  ₹{it.subtotal}
                </span>
              </div>
            ))}
          </div>

          {/* Bill summary */}
          <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900 tabular-nums">₹{activeOrder.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-stone-900 tabular-nums">
                {activeOrder.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5% GST)</span>
              <span className="font-semibold text-stone-900 tabular-nums">₹{activeOrder.tax}</span>
            </div>
            {activeOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="tabular-nums">-₹{activeOrder.discount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
              <span>Paid via {activeOrder.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : 'Online'}</span>
              <span className="text-[#E65100] tabular-nums">₹{activeOrder.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Right: Status History Audit Log & Delivery Address */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status History */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
              Status Audit Trail
            </h3>

            <div className="space-y-3">
              {activeOrder.statusHistory.map((h) => (
                <div key={h.id} className="text-xs flex items-start justify-between gap-3 p-2.5 rounded-xl bg-stone-50">
                  <div>
                    <span className="font-bold text-stone-900">{h.newStatus}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">{h.remarks}</p>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400 shrink-0">
                    {h.updatedAt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Delivery Destination
            </h3>
            <p className="text-xs font-semibold text-stone-900">
              {activeOrder.deliveryAddress.type} · {activeOrder.deliveryAddress.city} - {activeOrder.deliveryAddress.postalCode}
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              {activeOrder.deliveryAddress.fullAddress}
            </p>
            {activeOrder.deliveryInstructions && (
              <p className="text-xs text-stone-500 italic">
                Note: "{activeOrder.deliveryInstructions}"
              </p>
            )}
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-600">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>Contact: {activeOrder.customerPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <AlertCircle className="w-5 h-5" />
              <span>Cancel Order {activeOrder.orderReference}?</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Cancellation is only permitted while your order is under review or confirmation before kitchen preparation begins.
            </p>
            <div>
              <label
                htmlFor="cancel-reason"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Reason for Cancellation
              </label>
              <select
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300"
              >
                <option value="Change of plans">Change of plans</option>
                <option value="Incorrect delivery address">Incorrect delivery address</option>
                <option value="Want to modify dishes">Want to modify dishes</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
