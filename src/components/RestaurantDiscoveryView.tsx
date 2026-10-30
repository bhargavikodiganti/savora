import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RestaurantCard } from './RestaurantCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Clock,
  X,
  Sparkles,
} from 'lucide-react';

export const RestaurantDiscoveryView: React.FC = () => {
  const {
    restaurants,
    categories,
    activeCategoryFilter,
    setActiveCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [deliveryMaxTime, setDeliveryMaxTime] = useState<number>(60);
  const [onlyVegFriendly, setOnlyVegFriendly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'delivery' | 'price'>(
    'popularity'
  );

  // Extract all unique cuisines
  const allCuisines = useMemo(() => {
    const set = new Set<string>();
    restaurants.forEach((r) => r.cuisine.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [restaurants]);

  // Filtered & sorted restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchCuisine = r.cuisine.some((c) => c.toLowerCase().includes(q));
          const matchDesc = r.description.toLowerCase().includes(q);
          if (!matchName && !matchCuisine && !matchDesc) return false;
        }

        // Category filter if active
        if (activeCategoryFilter) {
          const categoryObj = categories.find((c) => c.id === activeCategoryFilter);
          if (categoryObj) {
            const catName = categoryObj.name.toLowerCase();
            const matchCuisine = r.cuisine.some((c) => c.toLowerCase().includes(catName));
            if (!matchCuisine) return false;
          }
        }

        // Cuisine filter dropdown
        if (selectedCuisine !== 'all') {
          if (!r.cuisine.includes(selectedCuisine)) return false;
        }

        // Min rating
        if (minRating > 0 && r.rating < minRating) return false;

        // Price filter
        if (priceFilter !== 'all' && r.priceLevel !== priceFilter) return false;

        // Max delivery time
        const timeNum = parseInt(r.deliveryTime.split('-')[0]) || 30;
        if (timeNum > deliveryMaxTime) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'delivery') {
          const timeA = parseInt(a.deliveryTime.split('-')[0]) || 30;
          const timeB = parseInt(b.deliveryTime.split('-')[0]) || 30;
          return timeA - timeB;
        }
        if (sortBy === 'price') return a.minOrder - b.minOrder;
        // popularity
        return b.reviewCount - a.reviewCount;
      });
  }, [
    restaurants,
    searchQuery,
    activeCategoryFilter,
    selectedCuisine,
    minRating,
    priceFilter,
    deliveryMaxTime,
    sortBy,
    categories,
  ]);

  const activeFilterCount =
    (selectedCuisine !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (deliveryMaxTime < 60 ? 1 : 0) +
    (activeCategoryFilter ? 1 : 0);

  const resetFilters = () => {
    setSelectedCuisine('all');
    setMinRating(0);
    setPriceFilter('all');
    setDeliveryMaxTime(60);
    setActiveCategoryFilter(null);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
          Culinary Establishments
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
          Discover Exceptional Restaurants
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-xl">
          Browse gourmet kitchens, heritage Awadhi dining, wood-fired artisanal pizzerias, and clean botanical bowls.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs mb-8 space-y-4">
        {/* Top search & sort row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant name, cuisine or specialty dish..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#E65100]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By segmented control */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="p-2.5 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-hidden focus:border-[#E65100]"
            >
              <option value="popularity">Most Popular (Reviews)</option>
              <option value="rating">Highest Rated (★)</option>
              <option value="delivery">Fastest Delivery</option>
              <option value="price">Cost: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-3 text-xs">
          {/* Cuisine select */}
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 font-medium text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Cuisines</option>
            {allCuisines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Rating filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 font-medium text-stone-700 focus:outline-hidden"
          >
            <option value={0}>Any Rating</option>
            <option value={4.5}>4.5+ ★ Superior</option>
            <option value={4.8}>4.8+ ★ Exceptional</option>
          </select>

          {/* Price level */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 font-medium text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Price Tiers</option>
            <option value="₹">₹ (Budget Friendly)</option>
            <option value="₹₹">₹₹ (Moderate)</option>
            <option value="₹₹₹">₹₹₹ (Fine Dining)</option>
          </select>

          {/* Delivery time limit */}
          <select
            value={deliveryMaxTime}
            onChange={(e) => setDeliveryMaxTime(parseInt(e.target.value))}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 font-medium text-stone-700 focus:outline-hidden"
          >
            <option value={60}>Delivery: Any Time</option>
            <option value={30}>Under 30 mins</option>
            <option value={40}>Under 40 mins</option>
          </select>

          {/* Active category clear button */}
          {activeCategoryFilter && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-xs">
              <span>Category: {categories.find((c) => c.id === activeCategoryFilter)?.name}</span>
              <button
                onClick={() => setActiveCategoryFilter(null)}
                className="hover:text-amber-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs font-semibold text-[#E65100] hover:underline"
            >
              Reset Filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Restaurant Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <SlidersHorizontal className="w-8 h-8 stroke-1" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              No matching restaurants found
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your filters, searching for a different dish, or clearing criteria.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#19191C] text-white text-xs font-semibold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};
