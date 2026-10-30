import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Minimize2,
  Send,
  Sparkles,
  ArrowRight,
  Bot,
  Compass,
  ShoppingBag,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'savi' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: { label: string; action: () => void }[];
}

export const SaviAssistant: React.FC = () => {
  const {
    isSaviOpen,
    setIsSaviOpen,
    navigateTo,
    orders,
    cartTotals,
    setIsCartDrawerOpen,
    menuItems,
    restaurants,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'savi',
      text: "Hi! I'm SAVI, your Savora food assistant. What would you like to explore today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSaviOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSaviOpen]);

  const addSaviResponse = (
    text: string,
    actionButtons?: { label: string; action: () => void }[]
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'savi',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButtons,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleQuickAction = (actionKey: string) => {
    const userText = {
      find_restaurants: 'Find Restaurants',
      categories: 'Explore Food Categories',
      bestsellers: 'Bestselling Dishes',
      track_order: 'Track My Order',
      cart: 'Cart Assistance',
      faqs: 'Help and FAQs',
    }[actionKey] || 'Quick inquiry';

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // Handle responses
    setTimeout(() => {
      switch (actionKey) {
        case 'find_restaurants': {
          const activeCount = restaurants.filter((r) => r.isActive).length;
          addSaviResponse(
            `We currently feature ${activeCount} fine dining kitchens including ${restaurants[0].name} and ${restaurants[1]?.name || 'Artisan Crust'}. Would you like to view the full directory?`,
            [
              {
                label: 'View All Restaurants',
                action: () => {
                  navigateTo('restaurants');
                  setIsSaviOpen(false);
                },
              },
            ]
          );
          break;
        }

        case 'categories': {
          addSaviResponse(
            'Explore our handcrafted categories: Biryani, Sourdough Pizza, Awadhi Indian, Healthy Bowls, and Chinese Dim Sums.',
            [
              {
                label: 'Explore Biryani',
                action: () => {
                  navigateTo('restaurants', { categoryId: 'cat-biryani' });
                  setIsSaviOpen(false);
                },
              },
              {
                label: 'Explore Pizza',
                action: () => {
                  navigateTo('restaurants', { categoryId: 'cat-pizza' });
                  setIsSaviOpen(false);
                },
              },
            ]
          );
          break;
        }

        case 'bestsellers': {
          const topDishes = menuItems.filter((m) => m.isBestseller).slice(0, 3);
          const dishNames = topDishes.map((d) => d.name).join(', ');
          addSaviResponse(
            `Top recommendations from our Michelin-inspired kitchens: ${dishNames}. Each is prepared fresh on slow charcoal flame or imported stone hearth.`,
            [
              {
                label: 'View Awadhi Dum Biryani',
                action: () => {
                  navigateTo('restaurant-detail', { restaurantId: 'rest-royal-awadh' });
                  setIsSaviOpen(false);
                },
              },
            ]
          );
          break;
        }

        case 'track_order': {
          if (orders.length === 0) {
            addSaviResponse(
              "You don't have any active orders right now. You can order from our fine dining kitchens anytime!"
            );
          } else {
            const latest = orders[0];
            addSaviResponse(
              `Your latest order ${latest.orderReference} from ${latest.restaurantName} is currently "${latest.orderStatus}". Estimated arrival: ${latest.estimatedDeliveryTime}.`,
              [
                {
                  label: 'Open Live Tracking',
                  action: () => {
                    navigateTo('order-tracking', { orderId: latest.id });
                    setIsSaviOpen(false);
                  },
                },
              ]
            );
          }
          break;
        }

        case 'cart': {
          if (cartTotals.itemsCount === 0) {
            addSaviResponse(
              'Your shopping bag is currently empty. Add your favorite dishes and enjoy complimentary delivery on orders over ₹500.'
            );
          } else {
            addSaviResponse(
              `You have ${cartTotals.itemsCount} item(s) in your bag totaling ₹${cartTotals.finalTotal}. Would you like to review and checkout?`,
              [
                {
                  label: 'View Cart Drawer',
                  action: () => {
                    setIsCartDrawerOpen(true);
                    setIsSaviOpen(false);
                  },
                },
                {
                  label: 'Proceed to Checkout',
                  action: () => {
                    navigateTo('checkout');
                    setIsSaviOpen(false);
                  },
                },
              ]
            );
          }
          break;
        }

        case 'faqs': {
          addSaviResponse(
            'SAVORA Concierge FAQs:\n• Order Cancellation: You can cancel free of charge while the order is in ORDER PLACED or ORDER CONFIRMED state.\n• Delivery Packaging: All hot curries and biryanis are delivered in sealed copper-foil insulation.\n• Payment Options: Cash on Delivery and contactless door payment are fully supported.',
            [
              {
                label: 'Customer Support Hotline',
                action: () => {
                  alert('SAVORA 24/7 Concierge Hotline: +91 800 SAVORA (728672)');
                },
              },
            ]
          );
          break;
        }

        default:
          addSaviResponse("I'm here to assist with dining recommendations, menu queries, or live order tracking!");
      }
    }, 400);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userQuery = inputVal.trim();
    setInputVal('');

    setMessages((prev) => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: userQuery,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setTimeout(() => {
      const q = userQuery.toLowerCase();
      if (q.includes('biryani') || q.includes('mutton') || q.includes('rice')) {
        addSaviResponse(
          'Our most celebrated dish is the Royal Awadhi Dum Mutton Biryani from The Royal Awadh, slow cooked with kewra and saffron basmati.',
          [
            {
              label: 'Open Biryani Menu',
              action: () => {
                navigateTo('restaurant-detail', { restaurantId: 'rest-royal-awadh' });
                setIsSaviOpen(false);
              },
            },
          ]
        );
      } else if (q.includes('pizza') || q.includes('italian')) {
        addSaviResponse(
          'Artisan Crust & Co. bakes 48-hour fermented sourdough Neapolitan pizzas at 900°F. Try their fresh Burrata & Black Truffle!',
          [
            {
              label: 'View Artisan Crust Menu',
              action: () => {
                navigateTo('restaurant-detail', { restaurantId: 'rest-artisan-crust' });
                setIsSaviOpen(false);
              },
            },
          ]
        );
      } else if (q.includes('cancel')) {
        addSaviResponse(
          'Cancellation is available anytime before kitchen preparation begins directly from your Live Order Tracking screen.'
        );
      } else if (q.includes('track') || q.includes('order')) {
        if (orders.length > 0) {
          const ord = orders[0];
          addSaviResponse(
            `Order ${ord.orderReference} is currently "${ord.orderStatus}". Click below to inspect the live status.`,
            [
              {
                label: 'Track Order',
                action: () => {
                  navigateTo('order-tracking', { orderId: ord.id });
                  setIsSaviOpen(false);
                },
              },
            ]
          );
        } else {
          addSaviResponse('No orders are currently in transit.');
        }
      } else {
        addSaviResponse(
          "I'd love to help you find the perfect meal! Try exploring our curated cuisines or asking about our bestselling dishes.",
          [
            {
              label: 'Explore Restaurants',
              action: () => {
                navigateTo('restaurants');
                setIsSaviOpen(false);
              },
            },
          ]
        );
      }
    }, 400);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isSaviOpen && (
        <button
          onClick={() => setIsSaviOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#19191C] hover:bg-[#E65100] text-white shadow-2xl border border-stone-700/50 hover:scale-105 transition-all group"
          aria-label="Open SAVI Food Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-400 group-hover:text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E65100] group-hover:bg-amber-400" />
          </div>
          <span className="font-semibold text-xs tracking-wide">Ask SAVI</span>
        </button>
      )}

      {/* Expandable Chat Panel */}
      {isSaviOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="savi-panel-heading"
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-[#19191C] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 id="savi-panel-heading" className="text-xs font-bold tracking-wide">
                  SAVI Assistant
                </h3>
                <p className="text-[10px] text-stone-300">Savora Concierge</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSaviOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
                aria-label="Minimize Assistant"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSaviOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions Scroll Bar */}
          <div className="p-2 bg-stone-50 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {[
              { id: 'find_restaurants', label: 'Restaurants' },
              { id: 'categories', label: 'Categories' },
              { id: 'bestsellers', label: 'Bestsellers' },
              { id: 'track_order', label: 'Track Order' },
              { id: 'cart', label: 'My Cart' },
              { id: 'faqs', label: 'FAQs' },
            ].map((qa) => (
              <button
                key={qa.id}
                onClick={() => handleQuickAction(qa.id)}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 font-medium text-stone-700 whitespace-nowrap hover:bg-[#FFF8F5] hover:border-[#E65100] hover:text-[#E65100] transition-colors"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#FAF9F5]">
            {messages.map((m) => {
              const isSavi = m.sender === 'savi';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isSavi ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                      isSavi
                        ? 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs shadow-2xs'
                        : 'bg-[#19191C] text-white rounded-tr-xs'
                    }`}
                  >
                    {m.text}

                    {/* Action buttons inside bot bubble */}
                    {m.actionButtons && m.actionButtons.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                        {m.actionButtons.map((btn) => (
                          <button
                            key={btn.label}
                            onClick={btn.action}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFF8F5] border border-[#E65100]/30 text-[#E65100] font-semibold text-[11px] hover:bg-[#E65100] hover:text-white transition-colors"
                          >
                            <span>{btn.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-stone-400 mt-0.5 px-1 font-mono">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about dishes, orders, or cuisines..."
              className="flex-1 p-2.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#E65100]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white transition-colors shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
