import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const CategorySection: React.FC = () => {
  const { categories, setActiveCategoryFilter, navigateTo } = useApp();

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategoryFilter(categoryId);
    navigateTo('restaurants', { categoryId });
  };

  return (
    <section className="py-14 bg-white border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
              Curated Epicurean Selections
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Popular Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategoryFilter(null);
              navigateTo('restaurants');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#E65100] transition-colors"
          >
            <span>View All Cuisines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="group flex flex-col items-center text-center p-2 rounded-2xl hover:bg-stone-50 transition-all cursor-pointer focus:outline-hidden"
              aria-label={`Explore ${cat.name} dishes`}
            >
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden shadow-xs border-2 border-stone-100 group-hover:border-[#E65100] group-hover:shadow-md transition-all duration-300 relative">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
              <span className="mt-3 text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#E65100] transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
