import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DishCard } from './DishCard';
import {
  Star,
  Clock,
  MapPin,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const RestaurantDetailView: React.FC = () => {
  const {
    selectedRestaurantId,
    restaurants,
    menuItems,
    categories,
    navigateTo,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const restaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  // Filter menu items for this restaurant
  const restaurantItems = useMemo(() => {
    return menuItems.filter((m) => m.restaurantId === restaurant.id);
  }, [menuItems, restaurant.id]);

  // Distinct category tabs present in this restaurant's menu
  const availableCategories = useMemo(() => {
    const catIds = new Set(restaurantItems.map((m) => m.categoryId));
    return categories.filter((c) => catIds.has(c.id));
  }, [restaurantItems, categories]);

  // Filtered items
  const filteredDishes = useMemo(() => {
    return restaurantItems.filter((item) => {
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) return false;
      if (dietaryFilter !== 'all' && item.dietaryType !== dietaryFilter) return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [restaurantItems, activeCategory, dietaryFilter, menuSearch]);

  return (
    <div className="pb-20">
      {/* Restaurant Hero Cover Header */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-stone-900">
        <img
          src={restaurant.coverImageUrl}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Back navigation button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigateTo('restaurants')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md text-xs font-semibold transition-all border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Restaurants</span>
          </button>
        </div>

        {/* Restaurant Header Details on Scrim */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 text-white max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-1">
                <Star className="w-4 h-4 fill-amber-300" />
                <span className="font-bold text-sm text-white">
                  {restaurant.rating.toFixed(1)}
                </span>
                <span className="text-stone-300">({restaurant.reviewCount} reviews)</span>
                <span className="text-stone-400">·</span>
                <span className="text-white font-mono">{restaurant.priceLevel}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md">
                {restaurant.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-200">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{restaurant.address}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>{restaurant.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Delivery card badge */}
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs shrink-0 flex items-center gap-4">
              <div>
                <span className="text-stone-300 block text-[10px] uppercase font-semibold">
                  Delivery In
                </span>
                <span className="text-white font-bold">{restaurant.deliveryTime}</span>
              </div>
              <div className="border-l border-white/20 pl-4">
                <span className="text-stone-300 block text-[10px] uppercase font-semibold">
                  Min Order
                </span>
                <span className="text-white font-bold">₹{restaurant.minOrder}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Restaurant Editorial Description */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
              About the Kitchen
            </h2>
            <p className="text-sm text-stone-700 mt-1 leading-relaxed">
              {restaurant.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs text-stone-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>FSSAI Certified Fine Dining Partner</span>
          </div>
        </div>

        {/* Sticky Menu Navigation Bar */}
        <div className="sticky top-20 z-30 bg-[#FDFBF7]/95 backdrop-blur-md py-4 border-b border-stone-200/90 mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[#19191C] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Full Menu ({restaurantItems.length})
              </button>

              {availableCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === c.id
                      ? 'bg-[#19191C] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Search & Dietary filter */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Veg / Non Veg toggles */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-stone-200 text-xs font-medium">
                <button
                  onClick={() => setDietaryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    dietaryFilter === 'all'
                      ? 'bg-stone-100 font-bold text-stone-900'
                      : 'text-stone-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietaryFilter('veg')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    dietaryFilter === 'veg'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-stone-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Veg</span>
                </button>
                <button
                  onClick={() => setDietaryFilter('non-veg')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    dietaryFilter === 'non-veg'
                      ? 'bg-red-50 text-red-800 font-bold'
                      : 'text-stone-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-700" />
                  <span>Non-Veg</span>
                </button>
              </div>

              {/* Menu dish search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Find in menu..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:border-[#E65100]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              No dishes found matching your selection
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Try resetting your category or vegetarian filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} item={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
