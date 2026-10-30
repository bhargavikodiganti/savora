import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  MapPin,
  Clock,
  RotateCcw,
  Star,
  Plus,
  Check,
  ChevronRight,
  Shield,
  Heart,
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    customer,
    updateCustomer,
    savedAddresses,
    setIsLocationModalOpen,
    orders,
    navigateTo,
    menuItems,
    addToCart,
    clearCart,
    reviews,
    addReview,
    restaurants,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'reviews'>('orders');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(customer.name);
  const [profilePhone, setProfilePhone] = useState(customer.phone);

  // Review modal state
  const [reviewOrderModal, setReviewOrderModal] = useState<{
    restaurantId: string;
    restaurantName: string;
    orderId: string;
  } | null>(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer({ name: profileName, phone: profilePhone });
    setEditingProfile(false);
  };

  const handleReorder = (order: (typeof orders)[0]) => {
    clearCart();
    let anyAdded = false;
    for (const item of order.items) {
      const liveItem = menuItems.find((m) => m.id === item.itemId);
      if (liveItem && liveItem.availability) {
        addToCart(liveItem, {}, item.quantity);
        anyAdded = true;
      }
    }
    if (anyAdded) {
      navigateTo('checkout');
    } else {
      alert('These items are currently out of stock.');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrderModal || !newComment.trim()) return;

    addReview(
      reviewOrderModal.restaurantId,
      newRating,
      newComment.trim(),
      reviewOrderModal.orderId
    );
    setReviewOrderModal(null);
    setNewComment('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF8F5] border border-[#E65100]/20 flex items-center justify-center text-[#E65100] font-serif text-2xl font-bold">
            {customer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-stone-900">{customer.name}</h1>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                SAVORA Connoisseur
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {customer.email} · {customer.phone}
            </p>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-stone-100 pt-4 sm:pt-0 sm:pl-6 text-xs text-stone-600">
          <div>
            <span className="text-stone-400 block font-medium">Orders Placed</span>
            <span className="font-serif text-xl font-bold text-stone-900 tabular-nums">
              {orders.length}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block font-medium">Saved Addresses</span>
            <span className="font-serif text-xl font-bold text-stone-900 tabular-nums">
              {savedAddresses.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-3 border border-stone-200 shadow-xs space-y-1">
          {[
            { id: 'orders', label: 'My Orders & History', icon: Clock },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'profile', label: 'Personal Profile', icon: User },
            { id: 'reviews', label: 'My Reviews & Ratings', icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#19191C] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Recent & Past Orders
                </h2>
                <span className="text-xs text-stone-500">{orders.length} Total</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-stone-200">
                  <p className="text-sm text-stone-600">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => {
                    const isDelivered = o.orderStatus === 'DELIVERED';
                    const isCancelled = o.orderStatus === 'CANCELLED';
                    const hasReviewed = reviews.some((r) => r.orderId === o.id);

                    return (
                      <div
                        key={o.id}
                        className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif text-base font-bold text-stone-900">
                                {o.restaurantName}
                              </h3>
                              <span className="text-stone-300">·</span>
                              <span className="font-mono text-xs text-[#E65100] font-semibold">
                                {o.orderReference}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {new Date(o.orderDate).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}{' '}
                              at{' '}
                              {new Date(o.orderDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                isDelivered
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : isCancelled
                                  ? 'bg-stone-100 text-stone-500'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {o.orderStatus}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1.5 text-xs text-stone-700">
                          {o.items.map((it) => (
                            <div key={it.id} className="flex justify-between">
                              <span>
                                {it.quantity} × {it.itemNameSnapshot}{' '}
                                {it.customizationSummary && (
                                  <span className="text-[11px] text-stone-400">
                                    ({it.customizationSummary})
                                  </span>
                                )}
                              </span>
                              <span className="font-medium tabular-nums">₹{it.subtotal}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <span className="font-bold text-stone-900">
                            Total: <span className="text-[#E65100]">₹{o.totalAmount}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigateTo('order-tracking', { orderId: o.id })}
                              className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-colors"
                            >
                              Track / Details
                            </button>

                            <button
                              onClick={() => handleReorder(o)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white font-semibold shadow-xs transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reorder</span>
                            </button>

                            {isDelivered && !hasReviewed && (
                              <button
                                onClick={() =>
                                  setReviewOrderModal({
                                    restaurantId: o.restaurantId,
                                    restaurantName: o.restaurantName,
                                    orderId: o.id,
                                  })
                                }
                                className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold"
                              >
                                Write Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Manage Delivery Addresses
                </h2>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E65100] text-white text-xs font-semibold hover:bg-[#D84315]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{addr.fullAddress}</p>
                    {addr.landmark && (
                      <p className="text-[11px] text-stone-500">Landmark: {addr.landmark}</p>
                    )}
                    <p className="text-[11px] text-stone-500">
                      {addr.city} - {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PERSONAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Profile Information
                </h2>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="text-xs font-semibold text-[#E65100] hover:underline"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-phone"
                      className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="profile-phone"
                      type="tel"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#E65100] text-white text-xs font-semibold rounded-xl"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block font-medium">Registered Name</span>
                    <span className="text-sm font-semibold text-stone-900 mt-1 block">
                      {customer.name}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block font-medium">Email Address</span>
                    <span className="text-sm font-semibold text-stone-900 mt-1 block">
                      {customer.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block font-medium">Phone Number</span>
                    <span className="text-sm font-semibold text-stone-900 mt-1 block">
                      {customer.phone}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block font-medium">Member Since</span>
                    <span className="text-sm font-semibold text-stone-900 mt-1 block">
                      January 2026
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                My Reviews & Feedback
              </h2>

              <div className="space-y-4">
                {reviews.map((r) => {
                  const rest = restaurants.find((res) => res.id === r.restaurantId);
                  return (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-sm font-bold text-stone-900">
                          {rest?.name || 'Restaurant'}
                        </h4>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{r.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed italic">
                        "{r.comment}"
                      </p>
                      <span className="text-[10px] text-stone-400 block">{r.createdAt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {reviewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleReviewSubmit}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Review {reviewOrderModal.restaurantName}
            </h3>

            <div>
              <span className="block text-xs font-semibold text-stone-700 uppercase mb-2">
                Your Rating
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 focus:outline-hidden"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="review-comment"
                className="block text-xs font-semibold text-stone-700 uppercase mb-1"
              >
                Comments & Taste Feedback
              </label>
              <textarea
                id="review-comment"
                rows={3}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="How was the flavor, temperature, and presentation?"
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewOrderModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#E65100] hover:bg-[#D84315] rounded-xl"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
