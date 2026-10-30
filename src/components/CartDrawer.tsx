import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cartItems,
    cartTotals,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    appliedOffer,
    applyPromoCode,
    removePromoCode,
    navigateTo,
    offers,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  if (!isCartDrawerOpen) return null;

  const handleApplyCode = (codeToApply?: string) => {
    const code = codeToApply || promoInput;
    if (!code.trim()) return;

    const res = applyPromoCode(code);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigateTo('checkout');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-[#FDFBF7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E65100]" />
            <div>
              <h2 id="cart-drawer-heading" className="text-base font-bold text-stone-900">
                Your Culinary Order
              </h2>
              {cartItems.length > 0 && (
                <p className="text-xs text-stone-500 font-medium">
                  {cartItems[0].restaurantName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close cart drawer"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-10 h-10 stroke-1 text-stone-400" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                  Explore hand-crafted menus from the city’s top gourmet kitchens.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('restaurants');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#E65100] text-white text-xs font-semibold hover:bg-[#D84315] transition-colors"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Restaurant Banner */}
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                <span>Ordering from:</span>
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cartItems.map((c) => {
                  const summaryParts: string[] = [];
                  if (c.customization.size) summaryParts.push(c.customization.size.name);
                  if (c.customization.spiceLevel) summaryParts.push(c.customization.spiceLevel);
                  if (c.customization.selectedAddons && c.customization.selectedAddons.length > 0) {
                    summaryParts.push(c.customization.selectedAddons.map((a) => a.name).join(', '));
                  }
                  if (c.customization.specialInstructions) {
                    summaryParts.push(`Note: "${c.customization.specialInstructions}"`);
                  }

                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl border border-stone-200/90 bg-[#FAF9F5] flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-3 h-3 border flex items-center justify-center shrink-0 rounded-2xs ${
                              c.menuItem.dietaryType === 'veg'
                                ? 'border-emerald-600'
                                : 'border-red-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                c.menuItem.dietaryType === 'veg'
                                  ? 'bg-emerald-600'
                                  : 'bg-red-700'
                              }`}
                            />
                          </span>
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {c.menuItem.name}
                          </h4>
                        </div>

                        {summaryParts.length > 0 && (
                          <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                            {summaryParts.join(' · ')}
                          </p>
                        )}

                        <div className="mt-2 text-xs font-semibold text-stone-800 tabular-nums">
                          ₹{c.unitPrice} × {c.quantity} ={' '}
                          <span className="font-bold">₹{c.itemSubtotal}</span>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white shrink-0 shadow-2xs">
                        <button
                          onClick={() => updateCartItemQuantity(c.id, c.quantity - 1)}
                          className="p-1 text-stone-600 hover:text-stone-900"
                          aria-label={`Decrease quantity of ${c.menuItem.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold tabular-nums text-stone-900">
                          {c.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(c.id, c.quantity + 1)}
                          className="p-1 text-stone-600 hover:text-stone-900"
                          aria-label={`Increase quantity of ${c.menuItem.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code section */}
              <div className="pt-2 border-t border-stone-200">
                <label
                  htmlFor="promo-code-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2"
                >
                  Apply Promo Code
                </label>

                {appliedOffer ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-emerald-900">{appliedOffer.code}</span>
                        <span className="text-emerald-700 ml-1.5 font-medium">
                          Saved ₹{cartTotals.discount}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-stone-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          id="promo-code-input"
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="e.g. SAVORA50"
                          className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
                        />
                      </div>
                      <button
                        onClick={() => handleApplyCode()}
                        className="px-4 py-2 bg-[#19191C] text-white rounded-xl text-xs font-semibold hover:bg-[#E65100] transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {promoMessage && (
                      <p
                        className={`text-[11px] font-medium ${
                          promoMessage.isError ? 'text-red-600' : 'text-emerald-700'
                        }`}
                      >
                        {promoMessage.text}
                      </p>
                    )}

                    {/* Quick clickable promo suggestions */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {offers.slice(0, 2).map((off) => (
                        <button
                          key={off.code}
                          onClick={() => handleApplyCode(off.code)}
                          className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 border border-stone-200 transition-colors"
                        >
                          {off.code} ({off.badge})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-[#FDFBF7] space-y-3">
            {/* Bill breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₹{cartTotals.subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                {cartTotals.deliveryFee === 0 ? (
                  <span className="font-semibold text-emerald-700">FREE</span>
                ) : (
                  <span className="font-semibold text-stone-900 tabular-nums">
                    ₹{cartTotals.deliveryFee}
                  </span>
                )}
              </div>

              <div className="flex justify-between">
                <span>Government Taxes (GST 5%)</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₹{cartTotals.tax}
                </span>
              </div>

              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount ({appliedOffer?.code})</span>
                  <span className="tabular-nums">-₹{cartTotals.discount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="font-serif text-base text-[#E65100] tabular-nums">
                  ₹{cartTotals.finalTotal}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-sm font-semibold shadow-md transition-all group"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-2">
                <span className="font-bold tabular-nums">₹{cartTotals.finalTotal}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
