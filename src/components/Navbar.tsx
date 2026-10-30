import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  MapPin,
  User,
  Shield,
  Menu as MenuIcon,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigateTo,
    cartTotals,
    setIsCartDrawerOpen,
    deliveryAddress,
    setIsLocationModalOpen,
    customer,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' as const },
    { label: 'Restaurants', view: 'restaurants' as const },
    { label: 'Explore Menu', view: 'restaurants' as const },
    { label: 'Offers', view: 'home' as const, hash: '#offers' },
    { label: 'My Orders', view: 'account' as const, tab: 'orders' },
  ];

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setMobileMenuOpen(false);
    navigateTo(link.view);
    if (link.hash) {
      setTimeout(() => {
        const el = document.querySelector(link.hash!);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => navigateTo('home')}
            className="text-left group focus:outline-hidden"
            aria-label="SAVORA Home"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#19191C] group-hover:text-[#E65100] transition-colors">
                SAVORA
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase font-semibold text-[#E65100]/90">
                Gourmet
              </span>
            </div>
            <p className="text-[10px] tracking-wider uppercase text-stone-500 font-medium -mt-1 hidden md:block">
              Discover · Order · Enjoy
            </p>
          </button>

          {/* Location selector */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/70 border border-stone-200/60 text-xs text-stone-800 transition-colors"
            title="Change Delivery Location"
          >
            <MapPin className="w-3.5 h-3.5 text-[#E65100] shrink-0" />
            <span className="font-semibold text-stone-900">{deliveryAddress.type}:</span>
            <span className="max-w-[150px] truncate text-stone-600">
              {deliveryAddress.landmark || deliveryAddress.city}
            </span>
            <ChevronDown className="w-3 h-3 text-stone-500 ml-0.5" />
          </button>
        </div>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              (link.view === currentView && !link.hash) ||
              (link.label === 'Home' && currentView === 'home');
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#E65100] font-semibold'
                    : 'text-stone-700 hover:text-[#19191C]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E65100] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Cart, Account, Admin Mode) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Admin Switcher */}
          <button
            onClick={() => navigateTo(currentView === 'admin' ? 'home' : 'admin')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              currentView === 'admin'
                ? 'bg-[#19191C] text-amber-300 border-[#19191C] shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
            title="Toggle Restaurant Administrator Dashboard"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span className="whitespace-nowrap">
              {currentView === 'admin' ? 'Exit Admin' : 'Admin Hub'}
            </span>
          </button>

          {/* User Account / Profile */}
          <button
            onClick={() => navigateTo('account')}
            className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium border transition-colors ${
              currentView === 'account'
                ? 'bg-stone-100 border-stone-300 text-stone-900'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            aria-label="Customer Account Profile"
          >
            <User className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline-block max-w-[100px] truncate">
              {customer.name.split(' ')[0]}
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all shrink-0 relative"
            aria-label={`Shopping cart with ${cartTotals.itemsCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline-block whitespace-nowrap">Cart</span>
            {cartTotals.itemsCount > 0 && (
              <span className="bg-white text-[#E65100] text-[11px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                {cartTotals.itemsCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 rounded-lg hover:bg-stone-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FDFBF7] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-150">
          <button
            onClick={() => {
              setIsLocationModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-100 text-xs text-stone-800"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E65100]" />
              <span className="font-medium text-stone-900">
                Deliver to {deliveryAddress.type}: {deliveryAddress.city}
              </span>
            </div>
            <span className="text-[11px] text-[#E65100] font-semibold">Change</span>
          </button>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo(currentView === 'admin' ? 'home' : 'admin');
              }}
              className="flex items-center gap-2 text-xs font-semibold text-amber-700 py-2 px-3 rounded-lg bg-amber-50 border border-amber-200"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              {currentView === 'admin' ? 'Exit Admin Dashboard' : 'Open Restaurant Admin Hub'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
