import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const {
    cart,
    cartSubtotal,
    currentUser,
    placeOrder,
    setActiveTab,
    setIsCartOpen
  } = useApp();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping form state
  const [shippingData, setShippingData] = useState({
    fullName: currentUser?.address?.fullName || currentUser?.name || '',
    street: currentUser?.address?.street || '42 Meadowlark Way',
    city: currentUser?.address?.city || 'Portland',
    state: currentUser?.address?.state || 'OR',
    zipCode: currentUser?.address?.zipCode || '97201',
    country: currentUser?.address?.country || 'United States',
    phone: currentUser?.address?.phone || '+1 (555) 234-5678'
  });

  // Payment mock state
  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '08/29',
    cvv: '912',
    cardName: currentUser?.name || 'Artisan Patron'
  });

  const subtotal = cartSubtotal;
  const shippingFee = subtotal >= 150 ? 0 : 14;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const commission = Number((subtotal * 0.05).toFixed(2));
  const sellerNet = Number((subtotal - commission).toFixed(2));
  const grandTotal = Number((subtotal + shippingFee + tax).toFixed(2));

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Small realistic payment delay
      await new Promise((r) => setTimeout(r, 800));
      const order = await placeOrder(shippingData);

      if (order) {
        setIsProcessing(false);
        setIsCartOpen(false);
        onClose();
        setActiveTab('orders');
      }
    } catch (err) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-[#FDFBF7] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E4D9C4] z-10 animate-in fade-in zoom-in-95 my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F8F4EE] text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EFE7D8]">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'shipping'
                  ? 'bg-[#A86F47] text-white'
                  : 'bg-[#6B7A52] text-white'
              }`}
            >
              {step === 'payment' ? '✓' : '1'}
            </span>
            <span className={`text-xs font-semibold ${step === 'shipping' ? 'text-[#2A2521]' : 'text-gray-500'}`}>
              Studio Delivery
            </span>
          </div>
          <span className="text-gray-300">───</span>
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'payment'
                  ? 'bg-[#A86F47] text-white'
                  : 'bg-[#E4D9C4] text-gray-600'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${step === 'payment' ? 'text-[#2A2521]' : 'text-gray-500'}`}>
              Artisan Settlement
            </span>
          </div>
        </div>

        {step === 'shipping' ? (
          <div>
            <div className="mb-5">
              <h2 className="font-serif text-2xl font-bold text-[#2A2521]">
                Where shall the artisans ship?
              </h2>
              <p className="text-xs text-[#645D56] mt-0.5">
                Every parcel is packaged with biodegradable wood shavings and reinforced paper seals.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={shippingData.fullName}
                  onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingData.street}
                  onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.state}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.zipCode}
                    onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                  Phone (for courier delivery updates)
                </label>
                <input
                  type="text"
                  required
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="flex items-center gap-2 px-6 py-3 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCompleteOrder}>
            <div className="mb-5">
              <h2 className="font-serif text-2xl font-bold text-[#2A2521]">
                Payment & 5% Transparent Ledger
              </h2>
              <p className="text-xs text-[#645D56] mt-0.5">
                Safe 256-bit encrypted checkout with direct artisan disbursement.
              </p>
            </div>

            {/* Transparent 5% Commission Breakdown Box */}
            <div className="bg-[#F8F4EE] rounded-2xl p-4 border border-[#E4D9C4] mb-5 text-xs">
              <div className="flex items-center gap-2 text-[#A86F47] font-semibold mb-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Automated 5% Fair Guild Commission</span>
              </div>
              <div className="space-y-1.5 text-[#645D56]">
                <div className="flex justify-between">
                  <span>Gross Craft Subtotal ({cart.length} items):</span>
                  <span className="font-semibold text-[#2A2521]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#A86F47] font-medium">
                  <span>Platform Operations Fee (5%):</span>
                  <span className="font-semibold">−${commission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B7A52] font-semibold bg-[#EFF3EB] p-2 rounded-lg">
                  <span>Direct Seller Earnings (95% to Artisans):</span>
                  <span className="font-bold">${sellerNet.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Fields */}
            <div className="space-y-3.5 text-xs mb-6">
              <div>
                <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={paymentData.expDate}
                    onChange={(e) => setPaymentData({ ...paymentData, expDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Security Code (CVV)
                  </label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm focus:outline-hidden focus:border-[#A86F47]"
                  />
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="border-t border-[#EFE7D8] pt-4 mb-6 text-xs space-y-1.5">
              <div className="flex justify-between text-[#645D56]">
                <span>Shipping:</span>
                <span>{shippingFee === 0 ? 'Free (Orders > $150)' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[#645D56]">
                <span>Estimated Sales Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2A2521] pt-2 border-t border-[#EFE7D8]">
                <span>Total Due:</span>
                <span>${grandTotal.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Complete Order Buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="px-4 py-2.5 border border-[#E4D9C4] text-[#2A2521] rounded-xl text-xs font-semibold hover:bg-[#F8F4EE]"
              >
                Back to Address
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Authorizing & Routing Order...' : `Confirm & Authorize $${grandTotal.toFixed(2)}`}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
