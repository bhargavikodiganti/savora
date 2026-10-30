import React from 'react';
import { MenuItem } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Plus, SlidersHorizontal } from 'lucide-react';

interface DishCardProps {
  item: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ item }) => {
  const { setCustomizingMenuItem, addToCart, cartItems } = useApp();

  const isVeg = item.dietaryType === 'veg';
  const hasCustomizations =
    item.customizationOptions &&
    ((item.customizationOptions.sizes && item.customizationOptions.sizes.length > 0) ||
      (item.customizationOptions.addons && item.customizationOptions.addons.length > 0) ||
      (item.customizationOptions.spiceLevels && item.customizationOptions.spiceLevels.length > 0));

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasCustomizations) {
      setCustomizingMenuItem(item);
    } else {
      addToCart(item, {});
    }
  };

  // Check if item is already in cart
  const cartItemCount = cartItems
    .filter((c) => c.menuItem.id === item.id)
    .reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div
      onClick={() => setCustomizingMenuItem(item)}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Dish Image */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Dietary Indicator (Veg / Non-Veg square dot) */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs">
            <div
              className={`w-4 h-4 border flex items-center justify-center ${
                isVeg ? 'border-emerald-600' : 'border-red-700'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isVeg ? 'bg-emerald-600' : 'bg-red-700'
                }`}
              />
            </div>
          </div>

          {/* Bestseller banner */}
          {item.isBestseller && (
            <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              Bestseller
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-[#E65100] transition-colors line-clamp-1">
            {item.name}
          </h3>

          <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer pricing and add button */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
        <div>
          <span className="text-sm font-bold text-stone-900 tabular-nums">
            ₹{item.price}
          </span>
          {hasCustomizations && (
            <span className="block text-[10px] text-stone-400 font-medium">
              Customizable
            </span>
          )}
        </div>

        <div>
          {!item.availability ? (
            <span className="text-[11px] font-semibold text-stone-400">Sold Out</span>
          ) : (
            <button
              type="button"
              onClick={handleAddClick}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                cartItemCount > 0
                  ? 'bg-stone-900 text-white hover:bg-[#E65100]'
                  : 'bg-[#FFF8F5] text-[#E65100] border border-[#E65100]/30 hover:bg-[#E65100] hover:text-white'
              }`}
              aria-label={`Add ${item.name} to cart`}
            >
              {hasCustomizations ? (
                <>
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Customize</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
              {cartItemCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px] tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
