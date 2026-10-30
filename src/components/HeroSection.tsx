import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    navigateTo,
    deliveryAddress,
    setIsLocationModalOpen,
    searchQuery,
    setSearchQuery,
    setActiveCategoryFilter,
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigateTo('restaurants');
  };

  const quickPills = [
    { label: 'Royal Biryani', catId: 'cat-biryani' },
    { label: 'Artisanal Pizza', catId: 'cat-pizza' },
    { label: 'Awadhi Curries', catId: 'cat-indian' },
    { label: 'Healthy Bowls', catId: 'cat-healthy' },
    { label: 'Dim Sums', catId: 'cat-chinese' },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-gradient-to-b from-[#FDFBF7] via-[#FAF6EE] to-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Editorial Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#E65100]">
              <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
              <span>SAVORA Culinary Concierge</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-600 font-medium">Finest Epicurean Dining</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#19191C] leading-[1.12] text-balance">
              Good Food. <br />
              <span className="text-[#E65100] italic font-serif">Great Moments.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
              Explore exceptional flavours, discover your favourite restaurants and
              get delicious food delivered to your doorstep with white-glove precision.
            </p>

            {/* Location Selector Bar */}
            <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-stone-200 shadow-xs max-w-xl">
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs text-stone-800 transition-colors shrink-0 border border-stone-100"
              >
                <MapPin className="w-4 h-4 text-[#E65100]" />
                <span className="font-semibold text-stone-900">{deliveryAddress.type}:</span>
                <span className="max-w-[130px] truncate text-stone-600">
                  {deliveryAddress.landmark || deliveryAddress.city}
                </span>
              </button>

              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
                <Search className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search dishes, cuisines or restaurants..."
                  className="w-full text-sm text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#19191C] hover:bg-[#E65100] text-white transition-colors shrink-0"
                  aria-label="Search"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Filter Links (Zero-Pill discipline) */}
            <div className="flex items-center flex-wrap gap-2 text-xs text-stone-600 pt-1">
              <span className="font-medium text-stone-500">Popular:</span>
              {quickPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => {
                    setActiveCategoryFilter(pill.catId);
                    navigateTo('restaurants');
                  }}
                  className="hover:text-[#E65100] transition-colors underline-offset-4 hover:underline text-stone-700"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigateTo('restaurants')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setActiveCategoryFilter(null);
                  navigateTo('restaurants');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-sm font-semibold transition-all shadow-xs"
              >
                <span>Order Now</span>
              </button>
            </div>

            {/* Trust Markers strip */}
            <div className="pt-4 grid grid-cols-3 gap-4 max-w-lg border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E65100]" />
                <span className="text-xs text-stone-600 font-medium">30 Min Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-stone-600 font-medium">100% Insulated Seal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-amber-700">★ 4.9</span>
                <span className="text-xs text-stone-600 font-medium">Culinary Rating</span>
              </div>
            </div>
          </div>

          {/* Right Hero Food Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 group">
              <img
                src="/src/assets/images/hero_savora_gourmet_1793341213456.jpg"
                alt="Lavish gourmet banquet featuring saffron handi biryani, copper tableware, and tandoori delicacies"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Float badge card on image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#E65100] uppercase tracking-wider">
                      Featured Kitchen
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                      The Royal Awadh
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Lucknowi Dum Biryani & Galouti Kebabs
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('restaurant-detail', { restaurantId: 'rest-royal-awadh' })}
                    className="p-2.5 rounded-xl bg-[#E65100] text-white hover:bg-[#D84315] transition-colors shrink-0"
                    aria-label="View The Royal Awadh Menu"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
