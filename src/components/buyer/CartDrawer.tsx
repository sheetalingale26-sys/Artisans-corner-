import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckoutModal } from './CheckoutModal';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotalCount,
    cartCommissionEstimate,
    clearCart,
    open3DStudioWithModel
  } = useApp();

  const [showCheckout, setShowCheckout] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl border-l border-[#E4D9C4] flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-[#EFE7D8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#A86F47] flex items-center justify-center text-white">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#2A2521]">Your Artisan Bag</h2>
                  <p className="text-xs text-[#645D56]">{cartTotalCount} handcrafted items reserved</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-[#F8F4EE] text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="bg-[#F8F4EE] px-6 py-3 border-b border-[#EFE7D8] text-xs">
              <div className="flex items-center justify-between font-medium text-[#2A2521] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#6B7A52]" />
                  {remainingForFreeShipping > 0
                    ? `Add $${remainingForFreeShipping.toFixed(2)} more for complimentary shipping`
                    : 'You unlocked complimentary sustainable shipping!'}
                </span>
              </div>
              <div className="w-full bg-[#E4D9C4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#6B7A52] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-[#A86F47]/30 mx-auto mb-3" />
                  <p className="font-serif text-base font-bold text-[#2A2521]">Your bag is empty</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Explore our curated studios and collect one-of-a-kind handmade heirlooms.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-4 py-2 bg-[#A86F47] text-white text-xs font-semibold rounded-xl"
                  >
                    Explore Marketplace
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3.5 p-3.5 bg-[#F8F4EE] rounded-2xl border border-[#E4D9C4]"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E4D9C4]">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-[#A86F47] truncate">
                          {item.product.sellerName}
                        </div>
                        <h4 className="text-xs font-bold text-[#2A2521] truncate mt-0.5">
                          {item.product.title}
                        </h4>
                        <div className="text-xs font-serif font-bold text-[#2A2521] mt-1">
                          ${item.product.price}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#E4D9C4] rounded-lg bg-white overflow-hidden text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="px-2 py-0.5 text-gray-600 hover:bg-[#F8F4EE]"
                          >
                            −
                          </button>
                          <span className="px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#2A2521]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="px-2 py-0.5 text-gray-600 hover:bg-[#F8F4EE]"
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Transparent 5% Breakdown and Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#EFE7D8] bg-[#FDFBF7] space-y-4">
                {/* 5% Fair Fee Guarantee Banner */}
                <div className="bg-[#EFF3EB] border border-[#D9E3D3] p-3 rounded-xl text-xs text-[#556241]">
                  <div className="flex items-center gap-1.5 font-semibold text-[#6B7A52]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Fair 5% Commission Model</span>
                  </div>
                  <div className="text-[11px] mt-1">
                    Artisan receives <strong>${(cartSubtotal - cartCommissionEstimate).toFixed(2)}</strong> (95%). Platform fee is just <strong>${cartCommissionEstimate.toFixed(2)}</strong> (5%).
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-[#645D56] font-medium">Estimated Subtotal:</span>
                  <span className="font-serif text-xl font-bold text-[#2A2521]">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="px-3 py-3 border border-[#E4D9C4] rounded-xl text-xs font-semibold text-gray-500 hover:bg-[#F8F4EE] transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-98"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  );
};
