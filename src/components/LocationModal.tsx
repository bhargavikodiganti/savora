import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, X, Plus, Check } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    deliveryAddress,
    setDeliveryAddress,
    savedAddresses,
    addSavedAddress,
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [postalCode, setPostalCode] = useState('560038');

  if (!isLocationModalOpen) return null;

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullAddress.trim()) return;

    const newAddr = addSavedAddress({
      type: addressType,
      fullAddress: fullAddress.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      isDefault: false,
    });
    setDeliveryAddress(newAddr);
    setIsAddingNew(false);
    setIsLocationModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FBF9F5]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#E65100]" />
            <h2 id="location-dialog-title" className="text-lg font-semibold text-stone-900">
              Select Delivery Location
            </h2>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            aria-label="Close location modal"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {!isAddingNew ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-wider text-stone-500 uppercase">
                Saved Delivery Addresses
              </p>

              <div className="space-y-2.5">
                {savedAddresses.map((addr) => {
                  const isSelected = addr.id === deliveryAddress.id;
                  return (
                    <button
                      key={addr.id}
                      onClick={() => {
                        setDeliveryAddress(addr);
                        setIsLocationModalOpen(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#E65100] bg-[#FFF8F5] shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                            isSelected
                              ? 'bg-[#E65100] text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-stone-900">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[11px] text-stone-500 font-medium">
                                · Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                            {addr.fullAddress}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {addr.city} - {addr.postalCode}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="shrink-0 p-1 rounded-full bg-[#E65100] text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#E65100] hover:text-[#E65100] text-stone-700 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Delivery Address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveNew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1.5">
                  Address Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setAddressType(type)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        addressType === type
                          ? 'bg-[#19191C] text-white border-[#19191C]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="full-address-input"
                  className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                >
                  Complete Address *
                </label>
                <textarea
                  id="full-address-input"
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House / Flat / Block no., Building Name, Street"
                  className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#E65100] focus:ring-1 focus:ring-[#E65100]"
                />
              </div>

              <div>
                <label
                  htmlFor="landmark-input"
                  className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                >
                  Nearby Landmark (Optional)
                </label>
                <input
                  id="landmark-input"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Metro Station or Park"
                  className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#E65100] focus:ring-1 focus:ring-[#E65100]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="city-input"
                    className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                  >
                    City
                  </label>
                  <input
                    id="city-input"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postal-code-input"
                    className="block text-xs font-semibold text-stone-700 uppercase mb-1"
                  >
                    PIN Code
                  </label>
                  <input
                    id="postal-code-input"
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#E65100]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-[#E65100] hover:bg-[#D84315] rounded-xl shadow-xs transition-colors"
                >
                  Save & Deliver Here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
