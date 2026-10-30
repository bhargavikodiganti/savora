import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from './HeroSection';
import { CategorySection } from './CategorySection';
import { RestaurantCard } from './RestaurantCard';
import { DishCard } from './DishCard';
import {
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Clock,
  Compass,
  Utensils,
  ShoppingBag,
  Bike,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    restaurants,
    menuItems,
    offers,
    applyPromoCode,
    setIsCartDrawerOpen,
    navigateTo,
  } = useApp();

  // Featured top 3 restaurants
  const featuredRestaurants = restaurants.slice(0, 3);

  // Bestseller dishes
  const bestsellingDishes = menuItems.filter((m) => m.isBestseller).slice(0, 4);

  const handleApplyOffer = (code: string) => {
    const res = applyPromoCode(code);
    alert(res.message);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Popular Categories Section */}
      <CategorySection />

      {/* 3. Featured Restaurants Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
              Curated Fine Dining
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Featured Restaurants
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Handpicked culinary institutions with verified heritage standards.
            </p>
          </div>

          <button
            onClick={() => navigateTo('restaurants')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-[#E65100] transition-colors"
          >
            <span>Explore All ({restaurants.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 4. Special Promotional Offers Banners */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
            Member Privileges
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Exclusive Dining Offers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {offers.map((offer) => (
            <div
              key={offer.code}
              className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {offer.badge}
                  </span>
                  <Tag className="w-3.5 h-3.5 text-[#E65100]" />
                </div>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  {offer.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block font-medium">Use Code</span>
                  <span className="font-mono text-xs font-bold text-stone-900">
                    {offer.code}
                  </span>
                </div>
                <button
                  onClick={() => handleApplyOffer(offer.code)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#E65100] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                >
                  Apply Code
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bestselling Dishes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
              Signature Creations
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Bestselling Masterpieces
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Most ordered gastronomy favourites celebrated by city patrons.
            </p>
          </div>

          <button
            onClick={() => navigateTo('restaurants')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-[#E65100] transition-colors"
          >
            <span>Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellingDishes.map((dish) => (
            <DishCard key={dish.id} item={dish} />
          ))}
        </div>
      </section>

      {/* 6. How It Works Section */}
      <section className="bg-white py-16 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
              The SAVORA Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              From historic kitchens to your dining table in 5 refined steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Discover a restaurant',
                desc: 'Explore curated culinary venues and heritage kitchens in your city.',
                icon: Compass,
              },
              {
                step: '02',
                title: 'Select your food',
                desc: 'Browse bespoke menus with portion sizes, spice levels, and accompaniments.',
                icon: Utensils,
              },
              {
                step: '03',
                title: 'Add items to cart',
                desc: 'Review itemized pricing, transparent taxes, and apply promo savings.',
                icon: ShoppingBag,
              },
              {
                step: '04',
                title: 'Place your order',
                desc: 'Confirm delivery instructions and checkout with Cash on Delivery or digital options.',
                icon: CheckCircle2,
              },
              {
                step: '05',
                title: 'Track delivery',
                desc: 'Follow live progress through 6 verified stages from kitchen hearth to doorstep.',
                icon: Bike,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-6 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#E65100]">
                        {st.step}
                      </span>
                      <Icon className="w-5 h-5 text-stone-400" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      {st.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
