import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-[#141518] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                SAVORA
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#E65100]">
                Gourmet
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              SAVORA is a premium food ordering and restaurant management platform connecting
              connoisseurs with exceptional dining, offering seamless ordering, live tracking, and
              an administrative restaurant hub.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E65100]" />
                Bengaluru · Mumbai · Hyderabad
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Discover
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-white transition-colors"
                >
                  Featured Dining
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('restaurants')}
                  className="hover:text-white transition-colors"
                >
                  Explore Restaurants
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('restaurants', { categoryId: 'cat-biryani' })}
                  className="hover:text-white transition-colors"
                >
                  Heritage Biryani
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('restaurants', { categoryId: 'cat-pizza' })}
                  className="hover:text-white transition-colors"
                >
                  Artisanal Sourdough
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Management & Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Partners & Admin
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>Restaurant Admin Hub</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Partner Onboarding: Contact partner@savora.com for fine-dining partnership review.')}
                  className="hover:text-white transition-colors"
                >
                  Partner With Savora
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="hover:text-white transition-colors"
                >
                  MySQL 10-Table Schema
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="hover:text-white transition-colors"
                >
                  Spring Boot JPA Specs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Governance
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <span className="cursor-pointer hover:text-white">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white">Terms of Dining</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white">Cancellation Rules</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white">FSSAI Hygiene Standards</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} SAVORA Gastronomy Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Architecture: Monolithic Spring MVC + JPA</span>
            <span>·</span>
            <span>Database: MySQL Normalized Relational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
