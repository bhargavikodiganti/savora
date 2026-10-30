import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateItemUnitPrice } from '../utils/orderCalculator';
import { X, Plus, Minus, Star, AlertCircle } from 'lucide-react';

export const CustomizationModal: React.FC = () => {
  const { customizingMenuItem, setCustomizingMenuItem, addToCart, clearCart } = useApp();

  const item = customizingMenuItem;

  const [selectedSize, setSelectedSize] = useState<{ name: string; priceDelta: number } | undefined>(
    undefined
  );
  const [selectedSpice, setSelectedSpice] = useState<string | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; priceDelta: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [conflictPrompt, setConflictPrompt] = useState<string | null>(null);

  // Initialize defaults whenever item changes
  useEffect(() => {
    if (item?.customizationOptions) {
      if (item.customizationOptions.sizes && item.customizationOptions.sizes.length > 0) {
        setSelectedSize(item.customizationOptions.sizes[0]);
      } else {
        setSelectedSize(undefined);
      }

      if (item.customizationOptions.spiceLevels && item.customizationOptions.spiceLevels.length > 0) {
        setSelectedSpice(item.customizationOptions.spiceLevels[0]);
      } else {
        setSelectedSpice(undefined);
      }

      setSelectedAddons([]);
      setSpecialInstructions('');
      setQuantity(1);
      setConflictPrompt(null);
    }
  }, [item]);

  if (!item) return null;

  const currentUnitPrice = calculateItemUnitPrice(
    item.price,
    selectedSize?.priceDelta || 0,
    selectedAddons
  );
  const currentTotal = currentUnitPrice * quantity;

  const toggleAddon = (addon: { name: string; priceDelta: number }) => {
    const exists = selectedAddons.some((a) => a.name === addon.name);
    if (exists) {
      setSelectedAddons(selectedAddons.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleConfirmAdd = () => {
    const result = addToCart(
      item,
      {
        size: selectedSize,
        spiceLevel: selectedSpice,
        selectedAddons,
        specialInstructions: specialInstructions.trim() || undefined,
      },
      quantity
    );

    if (!result.success) {
      if (result.error?.includes('Reset cart')) {
        setConflictPrompt(result.error);
      } else {
        alert(result.error || 'Failed to add item');
      }
      return;
    }

    setCustomizingMenuItem(null);
  };

  const handleResetAndAdd = () => {
    clearCart();
    addToCart(
      item,
      {
        size: selectedSize,
        spiceLevel: selectedSpice,
        selectedAddons,
        specialInstructions: specialInstructions.trim() || undefined,
      },
      quantity
    );
    setConflictPrompt(null);
    setCustomizingMenuItem(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dish-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with image */}
        <div className="relative aspect-16/9 w-full bg-stone-100 shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={() => setCustomizingMenuItem(null)}
            aria-label="Close customization modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-3.5 h-3.5 border flex items-center justify-center bg-white rounded-xs ${
                  item.dietaryType === 'veg' ? 'border-emerald-600' : 'border-red-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.dietaryType === 'veg' ? 'bg-emerald-600' : 'bg-red-700'
                  }`}
                />
              </span>
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-300" />
                {item.rating.toFixed(1)}
              </span>
            </div>
            <h2 id="modal-dish-title" className="font-serif text-xl sm:text-2xl font-bold leading-tight">
              {item.name}
            </h2>
            <p className="text-xs text-stone-200 line-clamp-2 mt-1">{item.description}</p>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {conflictPrompt && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Single Restaurant Order Policy</span>
              </div>
              <p>{conflictPrompt}</p>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleResetAndAdd}
                  className="px-3 py-1.5 bg-[#E65100] text-white rounded-lg font-medium hover:bg-[#D84315]"
                >
                  Clear Cart & Add This Item
                </button>
                <button
                  type="button"
                  onClick={() => setConflictPrompt(null)}
                  className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium"
                >
                  Keep Existing Cart
                </button>
              </div>
            </div>
          )}

          {/* Portion Size options */}
          {item.customizationOptions?.sizes && item.customizationOptions.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Select Portion Size
                </h3>
                <span className="text-[11px] font-medium text-[#E65100]">Required</span>
              </div>
              <div className="space-y-2">
                {item.customizationOptions.sizes.map((size) => {
                  const isChecked = selectedSize?.name === size.name;
                  return (
                    <label
                      key={size.name}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#E65100] bg-[#FFF8F5]'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="size-option"
                          checked={isChecked}
                          onChange={() => setSelectedSize(size)}
                          className="accent-[#E65100] w-4 h-4"
                        />
                        <span className="text-sm font-medium text-stone-900">{size.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-stone-700 tabular-nums">
                        {size.priceDelta === 0 ? 'Base' : `+₹${size.priceDelta}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level options */}
          {item.customizationOptions?.spiceLevels &&
            item.customizationOptions.spiceLevels.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2.5">
                  Choose Spice Intensity
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {item.customizationOptions.spiceLevels.map((lvl) => {
                    const isSelected = selectedSpice === lvl;
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setSelectedSpice(lvl)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors ${
                          isSelected
                            ? 'bg-[#19191C] text-white border-[#19191C]'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Add-ons / Extras */}
          {item.customizationOptions?.addons && item.customizationOptions.addons.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Add Accompaniments & Extras
                </h3>
                <span className="text-[11px] text-stone-400">Optional</span>
              </div>
              <div className="space-y-2">
                {item.customizationOptions.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.name === addon.name);
                  return (
                    <label
                      key={addon.name}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#E65100] bg-[#FFF8F5]'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(addon)}
                          className="accent-[#E65100] w-4 h-4 rounded-sm"
                        />
                        <span className="text-sm font-medium text-stone-900">{addon.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-stone-700 tabular-nums">
                        +₹{addon.priceDelta}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label
              htmlFor="special-instructions"
              className="block text-xs font-bold uppercase tracking-wider text-stone-900 mb-1.5"
            >
              Chef Instructions
            </label>
            <input
              id="special-instructions"
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra cutlery, dressing on the side..."
              className="w-full p-2.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#E65100]"
            />
          </div>
        </div>

        {/* Footer with quantity & price */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FDFBF7] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity stepper */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-stone-600 hover:text-stone-900"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold tabular-nums text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-stone-600 hover:text-stone-900"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add button with dynamic price */}
          <button
            type="button"
            onClick={handleConfirmAdd}
            className="flex-1 flex items-center justify-between px-5 py-3 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-sm font-semibold shadow-md transition-colors"
          >
            <span>Add to Order</span>
            <span className="font-bold tabular-nums">₹{currentTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
