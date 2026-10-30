import React from 'react';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, ArrowRight } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { navigateTo } = useApp();

  return (
    <div
      onClick={() =>
        navigateTo('restaurant-detail', { restaurantId: restaurant.id })
      }
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
        <img
          src={restaurant.coverImageUrl}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Rating and Delivery Badge on Image */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-stone-900 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.rating.toFixed(1)}</span>
          <span className="text-stone-400 font-normal">({restaurant.reviewCount})</span>
        </div>

        {/* Status overlay if closed */}
        {!restaurant.isActive && (
          <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-md bg-stone-800 border border-stone-700">
              Currently Closed
            </span>
          </div>
        )}

        {/* Bottom image overlay metadata */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <span className="text-white/90 font-medium">
            Min ₹{restaurant.minOrder}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#E65100] transition-colors leading-snug">
              {restaurant.name}
            </h3>
            <span className="text-xs font-mono font-medium text-stone-500 shrink-0">
              {restaurant.priceLevel}
            </span>
          </div>

          {/* Cuisines (Zero-Pill discipline: unboxed text with separators) */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
            {restaurant.cuisine.map((c, i) => (
              <React.Fragment key={c}>
                <span>{c}</span>
                {i < restaurant.cuisine.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>

          <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>
            {restaurant.deliveryFee === 0 ? (
              <strong className="text-emerald-700 font-semibold">Free Delivery</strong>
            ) : (
              `₹${restaurant.deliveryFee} Delivery`
            )}
          </span>

          <span className="inline-flex items-center gap-1 text-[#E65100] font-semibold group-hover:translate-x-1 transition-transform">
            <span>Explore Menu</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
