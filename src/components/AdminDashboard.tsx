import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, MenuItem, Restaurant } from '../types';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Store,
  ShoppingBag,
  Users,
  Database,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    restaurants,
    menuItems,
    categories,
    customer,
    reviews,
    updateOrderStatus,
    toggleMenuItemAvailability,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleRestaurantStatus,
    addRestaurant,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'menu' | 'restaurants' | 'customers' | 'schema'
  >('overview');

  // Order management filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<(typeof orders)[0] | null>(
    null
  );

  // New Menu Item modal
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState(350);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishRestaurant, setNewDishRestaurant] = useState(restaurants[0]?.id || '');
  const [newDishCategory, setNewDishCategory] = useState(categories[0]?.id || '');
  const [newDishDietary, setNewDishDietary] = useState<'veg' | 'non-veg'>('veg');

  // New Restaurant modal
  const [isAddRestModalOpen, setIsAddRestModalOpen] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('Continental, Fusion');
  const [newRestAddress, setNewRestAddress] = useState('5th Block, Koramangala, Bengaluru');

  // Calculated Real Database Analytics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
    const pendingOrders = orders.filter(
      (o) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
    ).length;
    const totalSales = orders
      .filter((o) => o.orderStatus !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalOrders,
      todayOrders: totalOrders,
      totalCustomers: 1, // Active session customer Aarav Sharma
      totalMenuItems: menuItems.length,
      pendingOrders,
      completedOrders,
      totalSales,
    };
  }, [orders, menuItems]);

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    addMenuItem({
      name: newDishName.trim(),
      description: newDishDesc.trim() || 'Signature culinary creation.',
      price: Number(newDishPrice),
      restaurantId: newDishRestaurant,
      categoryId: newDishCategory,
      dietaryType: newDishDietary,
      availability: true,
      rating: 4.8,
      imageUrl:
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    });

    setIsAddMenuModalOpen(false);
    setNewDishName('');
  };

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    addRestaurant({
      name: newRestName.trim(),
      description: 'Artisanal dining venue with crafted flavors.',
      address: newRestAddress.trim(),
      cuisine: newRestCuisine.split(',').map((c) => c.trim()),
      logoUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
      coverImageUrl:
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      openingHours: '11:00 AM – 11:00 PM',
      rating: 4.8,
      reviewCount: 42,
      deliveryTime: '30-40 mins',
      minOrder: 300,
      deliveryFee: 40,
      isActive: true,
      priceLevel: '₹₹',
    });

    setIsAddRestModalOpen(false);
    setNewRestName('');
  };

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'ALL') return orders;
    return orders.filter((o) => o.orderStatus === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#141518] text-white shrink-0 p-6 flex flex-col justify-between border-r border-stone-800">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white block">
                SAVORA Hub
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                Restaurant Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
              { id: 'orders', label: 'Order Management', icon: ShoppingBag, badge: metrics.pendingOrders },
              { id: 'menu', label: 'Menu Catalog', icon: UtensilsCrossed },
              { id: 'restaurants', label: 'Restaurants Directory', icon: Store },
              { id: 'customers', label: 'Customers & Reviews', icon: Users },
              { id: 'schema', label: 'MySQL Schema & JPA', icon: Database },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#E65100] text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-white text-stone-900 text-[10px] font-bold tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-stone-800 space-y-3">
          <div className="text-[11px] text-stone-400">
            <span>Signed in as </span>
            <strong className="text-stone-200">Admin Supervisor</strong>
          </div>
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition-colors"
          >
            <span>Exit to Customer View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
                  Operations Command
                </span>
                <h1 className="font-serif text-3xl font-bold text-stone-900">
                  Business Performance Overview
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500 bg-white px-3 py-2 rounded-xl border border-stone-200">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Live Database Connected</span>
              </div>
            </div>

            {/* Metrics 4-Col Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                  ₹{metrics.totalSales}
                </div>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                  ↑ Real gross order revenue
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#E65100]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                  {metrics.totalOrders}
                </div>
                <span className="text-[11px] text-stone-500 font-medium mt-1 block">
                  {metrics.completedOrders} delivered
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Pending Prep</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 tabular-nums">
                  {metrics.pendingOrders}
                </div>
                <span className="text-[11px] text-amber-700 font-medium mt-1 block">
                  In kitchen or dispatch
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Menu Catalog</span>
                  <UtensilsCrossed className="w-4 h-4 text-stone-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                  {metrics.totalMenuItems}
                </div>
                <span className="text-[11px] text-stone-500 font-medium mt-1 block">
                  Across {restaurants.length} kitchens
                </span>
              </div>
            </div>

            {/* Performance breakdown grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders quick table */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Recent Orders Stream
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#E65100] hover:underline"
                  >
                    Manage Orders ({orders.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-stone-900">
                          {o.orderReference} · {o.customerName}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {o.restaurantName} · ₹{o.totalAmount}
                        </p>
                      </div>
                      <span className="font-bold text-[11px] px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-800">
                        {o.orderStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Restaurants */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Best-Performing Kitchens
                </h3>

                <div className="space-y-3">
                  {restaurants.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-stone-900">{r.name}</h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {r.cuisine.slice(0, 2).join(', ')} · Rating: ★ {r.rating} ({r.reviewCount})
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          r.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {r.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
                  Live Kitchen Dispatch
                </span>
                <h1 className="font-serif text-3xl font-bold text-stone-900">
                  Order Management
                </h1>
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1 overflow-x-auto bg-white p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                {['ALL', 'ORDER PLACED', 'PREPARING', 'OUT FOR DELIVERY', 'DELIVERED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-[#19191C] text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 font-bold uppercase tracking-wider text-stone-600">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Customer & Phone</th>
                      <th className="p-4">Kitchen</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Kitchen Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#E65100]">
                          {o.orderReference}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-stone-900 block">
                            {o.customerName}
                          </span>
                          <span className="text-[11px] text-stone-500">{o.customerPhone}</span>
                        </td>
                        <td className="p-4 font-medium text-stone-800">{o.restaurantName}</td>
                        <td className="p-4 max-w-xs truncate text-stone-600">
                          {o.items.map((i) => `${i.quantity}x ${i.itemNameSnapshot}`).join(', ')}
                        </td>
                        <td className="p-4 font-bold tabular-nums text-stone-900">
                          ₹{o.totalAmount}
                        </td>
                        <td className="p-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          {o.orderStatus === 'ORDER PLACED' && (
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  o.id,
                                  'ORDER CONFIRMED',
                                  'Kitchen confirmed order'
                                )
                              }
                              className="px-2.5 py-1 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold"
                            >
                              Confirm
                            </button>
                          )}
                          {o.orderStatus === 'ORDER CONFIRMED' && (
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  o.id,
                                  'PREPARING',
                                  'Cooking started on hearth'
                                )
                              }
                              className="px-2.5 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold"
                            >
                              Start Cooking
                            </button>
                          )}
                          {o.orderStatus === 'PREPARING' && (
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  o.id,
                                  'READY FOR PICKUP',
                                  'Packed in copper foil insulation'
                                )
                              }
                              className="px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                              Mark Ready
                            </button>
                          )}
                          {o.orderStatus === 'READY FOR PICKUP' && (
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  o.id,
                                  'OUT FOR DELIVERY',
                                  'Assigned to courier partner'
                                )
                              }
                              className="px-2.5 py-1 bg-[#E65100] text-white rounded-lg hover:bg-[#D84315] font-semibold"
                            >
                              Dispatch
                            </button>
                          )}
                          {o.orderStatus === 'OUT FOR DELIVERY' && (
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  o.id,
                                  'DELIVERED',
                                  'Delivered directly to customer doorstep'
                                )
                              }
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
                            >
                              Mark Delivered
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedOrderDetails(o)}
                            className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                            title="View Full Order Breakdown"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
                  Culinary Catalog
                </span>
                <h1 className="font-serif text-3xl font-bold text-stone-900">
                  Menu Management
                </h1>
              </div>

              <button
                onClick={() => setIsAddMenuModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Food Item</span>
              </button>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 font-bold uppercase tracking-wider text-stone-600">
                    <tr>
                      <th className="p-4">Dish Details</th>
                      <th className="p-4">Restaurant</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Dietary</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Availability</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {menuItems.map((item) => {
                      const rest = restaurants.find((r) => r.id === item.restaurantId);
                      const cat = categories.find((c) => c.id === item.categoryId);
                      return (
                        <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-stone-900 block">{item.name}</span>
                                <span className="text-[11px] text-stone-500 line-clamp-1">
                                  {item.description}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-stone-800">
                            {rest?.name || 'Restaurant'}
                          </td>
                          <td className="p-4 font-medium text-stone-700">{cat?.name || 'Main'}</td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                item.dietaryType === 'veg'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-red-50 text-red-800 border border-red-200'
                              }`}
                            >
                              {item.dietaryType}
                            </span>
                          </td>
                          <td className="p-4 font-bold tabular-nums text-stone-900">₹{item.price}</td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleMenuItemAvailability(item.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                                item.availability
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {item.availability ? 'Available' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => deleteMenuItem(item.id)}
                              className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                              title="Delete Dish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESTAURANTS DIRECTORY */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
                  Partner Venues
                </span>
                <h1 className="font-serif text-3xl font-bold text-stone-900">
                  Restaurants Management
                </h1>
              </div>

              <button
                onClick={() => setIsAddRestModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard New Restaurant</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900">{r.name}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{r.address}</p>
                      <p className="text-xs font-medium text-stone-700 mt-1">
                        Cuisines: {r.cuisine.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleRestaurantStatus(r.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        r.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {r.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>
                      Rating: ★ {r.rating} ({r.reviewCount} reviews)
                    </span>
                    <span>Min Order: ₹{r.minOrder}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS & REVIEWS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
                Patron Intelligence
              </span>
              <h1 className="font-serif text-3xl font-bold text-stone-900">
                Customers & Feedback
              </h1>
            </div>

            {/* Customers list */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Registered Patrons
              </h3>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900 block">{customer.name}</span>
                  <span className="text-stone-500">{customer.email} · {customer.phone}</span>
                </div>
                <span className="font-semibold text-emerald-700">Verified Customer</span>
              </div>
            </div>

            {/* Reviews stream */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Latest Customer Reviews ({reviews.length})
              </h3>
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{rev.customerName}</span>
                      <span className="font-bold text-amber-500">★ {rev.rating}.0</span>
                    </div>
                    <p className="text-stone-700 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-stone-400 block">{rev.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MYSQL SCHEMA & SPRING BOOT ARCHITECTURE SPEC */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E65100]">
                System Architecture
              </span>
              <h1 className="font-serif text-3xl font-bold text-stone-900">
                MySQL Relational Schema & Spring Boot DTO Blueprint
              </h1>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                Normalized 10-table MySQL relational structure and Java Spring Data JPA entity mappings conforming to the SAVORA enterprise architecture specification.
              </p>
            </div>

            <div className="bg-[#141518] text-stone-200 p-6 rounded-2xl border border-stone-800 font-mono text-xs overflow-x-auto space-y-4 shadow-xl">
              <div className="text-amber-400 font-bold">-- SAVORA MySQL Normalized Relational DDL (10 Tables)</div>
              <pre className="text-stone-300 whitespace-pre leading-relaxed">
{`-- 1. Customers Table
CREATE TABLE customers (
  customer_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Restaurants Table
CREATE TABLE restaurants (
  restaurant_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  address VARCHAR(255) NOT NULL,
  cuisine JSON NOT NULL,
  logo_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  opening_hours VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 4.8
);

-- 3. Categories Table
CREATE TABLE categories (
  category_id VARCHAR(64) PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(500)
);

-- 4. Menu Items Table
CREATE TABLE menu_items (
  item_id VARCHAR(64) PRIMARY KEY,
  restaurant_id VARCHAR(64) NOT NULL,
  category_id VARCHAR(64) NOT NULL,
  item_name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  dietary_type ENUM('veg', 'non-veg') NOT NULL,
  availability BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 5. Orders Table
CREATE TABLE orders (
  order_id VARCHAR(64) PRIMARY KEY,
  order_reference VARCHAR(32) UNIQUE NOT NULL,
  customer_id VARCHAR(64) NOT NULL,
  restaurant_id VARCHAR(64) NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivery_address JSON NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  payment_status VARCHAR(30) NOT NULL,
  order_status VARCHAR(40) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

-- 6. Order Details Table (Item snapshot preservation)
CREATE TABLE order_details (
  detail_id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  item_id VARCHAR(64) NOT NULL,
  item_name_snapshot VARCHAR(150) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  customization JSON,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 7. Order Status History Table
CREATE TABLE order_status_history (
  history_id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  previous_status VARCHAR(40),
  new_status VARCHAR(40) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 8. Addresses Table
CREATE TABLE addresses (
  address_id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL,
  address_type VARCHAR(20) NOT NULL,
  full_address TEXT NOT NULL,
  landmark VARCHAR(120),
  city VARCHAR(80) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 9. Reviews Table
CREATE TABLE reviews (
  review_id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL,
  restaurant_id VARCHAR(64) NOT NULL,
  order_id VARCHAR(64),
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Admins Table
CREATE TABLE admins (
  admin_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'SUPER_ADMIN'
);`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* View Order Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#E65100]">
                  {selectedOrderDetails.orderReference}
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {selectedOrderDetails.restaurantName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-700 uppercase">Items Breakdown</span>
              {selectedOrderDetails.items.map((it) => (
                <div key={it.id} className="p-2.5 rounded-lg bg-stone-50 flex justify-between">
                  <div>
                    <span className="font-bold text-stone-900">
                      {it.quantity} × {it.itemNameSnapshot}
                    </span>
                    {it.customizationSummary && (
                      <p className="text-[11px] text-stone-500">{it.customizationSummary}</p>
                    )}
                  </div>
                  <span className="font-bold tabular-nums">₹{it.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between text-xs font-bold">
              <span>Total Payable</span>
              <span className="text-[#E65100]">₹{selectedOrderDetails.totalAmount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add New Menu Item Modal */}
      {isAddMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateDish}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <h3 className="font-serif text-lg font-bold text-stone-900">Add New Food Item</h3>

            <div>
              <label
                htmlFor="dish-name"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Dish Name *
              </label>
              <input
                id="dish-name"
                type="text"
                required
                value={newDishName}
                onChange={(e) => setNewDishName(e.target.value)}
                placeholder="e.g. Saffron Rogan Josh"
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="dish-price"
                  className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                >
                  Price (₹) *
                </label>
                <input
                  id="dish-price"
                  type="number"
                  required
                  value={newDishPrice}
                  onChange={(e) => setNewDishPrice(Number(e.target.value))}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
                />
              </div>

              <div>
                <label
                  htmlFor="dish-dietary"
                  className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                >
                  Dietary
                </label>
                <select
                  id="dish-dietary"
                  value={newDishDietary}
                  onChange={(e) => setNewDishDietary(e.target.value as 'veg' | 'non-veg')}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="dish-restaurant"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Restaurant
              </label>
              <select
                id="dish-restaurant"
                value={newDishRestaurant}
                onChange={(e) => setNewDishRestaurant(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="dish-category"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Category
              </label>
              <select
                id="dish-category"
                value={newDishCategory}
                onChange={(e) => setNewDishCategory(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="dish-description"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Description
              </label>
              <textarea
                id="dish-description"
                rows={2}
                value={newDishDesc}
                onChange={(e) => setNewDishDesc(e.target.value)}
                placeholder="Flavour notes, ingredients, cooking method"
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddMenuModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#E65100] hover:bg-[#D84315] rounded-xl"
              >
                Create Dish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {isAddRestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateRestaurant}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Onboard Partner Kitchen
            </h3>

            <div>
              <label
                htmlFor="restaurant-name"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Restaurant Name *
              </label>
              <input
                id="restaurant-name"
                type="text"
                required
                value={newRestName}
                onChange={(e) => setNewRestName(e.target.value)}
                placeholder="e.g. Bukhara Haveli"
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
              />
            </div>

            <div>
              <label
                htmlFor="restaurant-cuisines"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Cuisines (comma separated)
              </label>
              <input
                id="restaurant-cuisines"
                type="text"
                value={newRestCuisine}
                onChange={(e) => setNewRestCuisine(e.target.value)}
                placeholder="Awadhi, Tandoor, North Indian"
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label
                htmlFor="restaurant-address"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Physical Address
              </label>
              <input
                id="restaurant-address"
                type="text"
                value={newRestAddress}
                onChange={(e) => setNewRestAddress(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddRestModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#E65100] hover:bg-[#D84315] rounded-xl"
              >
                Onboard Kitchen
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
