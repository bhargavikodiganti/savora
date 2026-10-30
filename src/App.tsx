import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { RestaurantDiscoveryView } from './components/RestaurantDiscoveryView';
import { RestaurantDetailView } from './components/RestaurantDetailView';
import { CheckoutView } from './components/CheckoutView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { CustomerAccountView } from './components/CustomerAccountView';
import { AdminDashboard } from './components/AdminDashboard';
import { LocationModal } from './components/LocationModal';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { SaviAssistant } from './components/SaviAssistant';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  // If in Admin Dashboard mode, display dedicated admin view
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#F8F7F4]">
        <AdminDashboard />
        <CustomizationModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FDFBF7]">
      <div>
        <Navbar />
        <main>
          {currentView === 'home' && <HomeView />}
          {currentView === 'restaurants' && <RestaurantDiscoveryView />}
          {currentView === 'restaurant-detail' && <RestaurantDetailView />}
          {currentView === 'checkout' && <CheckoutView />}
          {currentView === 'order-tracking' && <OrderTrackingView />}
          {currentView === 'account' && <CustomerAccountView />}
        </main>
      </div>

      <Footer />

      {/* Global Modals & Overlays */}
      <LocationModal />
      <CustomizationModal />
      <CartDrawer />
      <SaviAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
