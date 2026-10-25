import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { WriteReviewModal } from './WriteReviewModal';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  Sparkles,
  Layers,
  Star,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, cancelOrder, products, open3DStudioWithModel, setActiveTab, currentUser } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [reviewingProductId, setReviewingProductId] = useState<string | null>(null);

  // Isolate orders to only the current user's purchases
  const userOrders = currentUser
    ? orders.filter(
        (o) => o.buyerId === currentUser.id || o.buyerEmail?.toLowerCase() === currentUser.email?.toLowerCase()
      )
    : [];

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(userOrders[0] || null);

  const filteredOrders = userOrders.filter((o) => {
    if (statusFilter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (statusFilter === 'delivered') return o.status === 'delivered';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ordered':
        return { label: 'Order Confirmed', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'crafting':
        return { label: 'In Studio Crafting', color: 'bg-[#F6EDE6] text-[#A86F47] border-[#E8DEC8]' };
      case 'quality_check':
        return { label: 'Quality Check', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'shipped':
        return { label: 'Dispatched', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'delivered':
        return { label: 'Delivered', color: 'bg-[#EFF3EB] text-[#6B7A52] border-[#D9E3D3]' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' };
    }
  };

  const copyTracking = (num: string) => {
    navigator.clipboard.writeText(num);
  };

  const activeOrder = selectedOrder || filteredOrders[0] || null;
  const productToReview = reviewingProductId ? products.find((p) => p.id === reviewingProductId) : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button & Page Header */}
        <div className="mb-6">
          <button
            onClick={() => setActiveTab('marketplace')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#28231F] bg-[#EFE7DC] hover:bg-[#E2D5C3] border border-[#DDD0BE] transition-colors mb-3 cursor-pointer shadow-xs"
          >
            <span>&larr;</span> Back to Marketplace
          </button>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A86F47]">
              Patron Order History &amp; Live Tracking
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#2A2521] mt-1">
              Track Your Handcrafted Orders
            </h1>
            <p className="text-xs text-[#645D56] mt-1">
              Follow every step of your piece's journey from the artisan's lathe and kiln to your doorstep.
            </p>
          </div>
        </div>

        {!currentUser ? (
          <div className="text-center py-16 bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] max-w-lg mx-auto p-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#F6EDE6] text-[#A86F47] mx-auto flex items-center justify-center mb-4">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#28231F]">Sign In to View Your Orders</h3>
            <p className="text-xs sm:text-sm text-[#645D56] mt-2 mb-6 leading-relaxed">
              Track your orders, follow live workshop milestones from the lathe to your doorstep, and leave reviews for master artisans.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('login')}
                className="px-5 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
              >
                Sign In to Account
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-5 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-[#28231F] text-xs sm:text-sm font-semibold hover:bg-[#FAF4ED] cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-[#A86F47] text-white'
                    : 'bg-[#F8F4EE] text-[#645D56] border border-[#E4D9C4]'
                }`}
              >
                All Orders ({userOrders.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'active'
                    ? 'bg-[#A86F47] text-white'
                    : 'bg-[#F8F4EE] text-[#645D56] border border-[#E4D9C4]'
                }`}
              >
                In Crafting & Transit ({userOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length})
              </button>
              <button
                onClick={() => setStatusFilter('delivered')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'delivered'
                    ? 'bg-[#A86F47] text-white'
                    : 'bg-[#F8F4EE] text-[#645D56] border border-[#E4D9C4]'
                }`}
              >
                Delivered ({userOrders.filter((o) => o.status === 'delivered').length})
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-8">
                <Package className="w-12 h-12 text-[#A86F47]/40 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#2A2521]">No orders in this category</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Browse our artisans' collections and place an order to follow its live crafting.
                </p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="mt-4 px-4 py-2 bg-[#A86F47] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Orders Sidebar List (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              {filteredOrders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                const isSelected = activeOrder?.id === ord.id;

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FDFBF7] border-[#A86F47] shadow-md ring-1 ring-[#A86F47]/30'
                        : 'bg-[#F8F4EE] border-[#E4D9C4] hover:bg-[#F3EDE2]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm text-[#2A2521]">
                        {ord.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-xs text-[#645D56] mb-2">
                      {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} •{' '}
                      <span className="font-semibold text-[#2A2521]">${ord.total.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      <span className="text-[#A86F47] font-medium flex items-center gap-0.5">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Order Details & Timeline (8 cols) */}
            {activeOrder && (
              <div className="lg:col-span-8 bg-[#FDFBF7] rounded-3xl border border-[#E4D9C4] p-6 sm:p-8 shadow-sm">
                {/* Header card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EFE7D8] gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-2xl font-bold text-[#2A2521]">
                        Order #{activeOrder.orderNumber}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          getStatusBadge(activeOrder.status).color
                        }`}
                      >
                        {getStatusBadge(activeOrder.status).label}
                      </span>
                    </div>
                    <div className="text-xs text-[#645D56] mt-1 flex items-center gap-2">
                      <span>Carrier: <strong>{activeOrder.carrier}</strong></span>
                      <span>•</span>
                      <span>Est. Delivery: <strong>{activeOrder.estimatedDelivery}</strong></span>
                    </div>
                  </div>

                  {/* Tracking snippet */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#F8F4EE] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-[#E4D9C4] text-xs self-start sm:self-auto">
                    <Truck className="w-4 h-4 text-[#A86F47]" />
                    <span className="font-mono text-[#2A2521] text-[11px] sm:text-xs">{activeOrder.trackingNumber}</span>
                    <button
                      onClick={() => copyTracking(activeOrder.trackingNumber)}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                      title="Copy Tracking Number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Crafting & Delivery Timeline */}
                <div className="my-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A86F47] mb-6 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Artisanal Journey Timeline
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4D9C4]">
                    {activeOrder.statusTimeline.map((step, idx) => (
                      <div key={idx} className="relative group">
                        {/* Milestone dot */}
                        <div
                          className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            idx === activeOrder.statusTimeline.length - 1
                              ? 'bg-[#A86F47] border-[#FDFBF7] text-white shadow-xs'
                              : 'bg-[#6B7A52] border-[#FDFBF7] text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </div>

                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
                            <h4 className="text-sm font-bold text-[#2A2521]">{step.label}</h4>
                            <span className="text-[11px] text-gray-400 font-mono">{step.date}</span>
                          </div>
                          <p className="text-xs text-[#645D56] mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items List */}
                <div className="border-t border-[#EFE7D8] pt-6 mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A86F47] mb-4">
                    Handmade Pieces in this Shipment
                  </h3>

                  <div className="space-y-3">
                    {activeOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#F8F4EE] rounded-2xl border border-[#E4D9C4] gap-3"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 rounded-xl object-cover border border-[#E4D9C4]"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-semibold text-[#A86F47] block">
                              {item.sellerName}
                            </span>
                            <h4 className="text-xs font-bold text-[#2A2521] truncate">
                              {item.title}
                            </h4>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Qty: {item.quantity} × ${item.price}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.model3dType && (
                            <button
                              onClick={() => open3DStudioWithModel(item.model3dType!)}
                              className="px-2.5 py-1.5 bg-[#2A2521] text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-[#3D352E]"
                            >
                              <Layers className="w-3.5 h-3.5 text-[#D8A45F]" />
                              <span className="hidden sm:inline">3D View</span>
                            </button>
                          )}
                          <button
                            onClick={() => setReviewingProductId(item.productId)}
                            className="px-2.5 py-1.5 bg-[#FDFBF7] text-[#A86F47] border border-[#E4D9C4] rounded-lg text-xs font-semibold hover:bg-[#F3EDE2] flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>Review</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Ledger & 5% Guarantee Breakdown */}
                <div className="bg-[#F8F4EE] p-4 rounded-2xl border border-[#E4D9C4] text-xs space-y-2 mb-6">
                  <div className="font-semibold text-[#A86F47] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Order Financial Transparency (5% Platform Cap)</span>
                  </div>
                  <div className="flex justify-between text-[#645D56]">
                    <span>Items Subtotal:</span>
                    <span>${activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#645D56]">
                    <span>Shipping & Sustainable Packing:</span>
                    <span>${activeOrder.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#645D56]">
                    <span>Taxes:</span>
                    <span>${activeOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#A86F47] font-medium pt-1 border-t border-[#E4D9C4]">
                    <span>Platform Service Fee Deducted (5% of Subtotal):</span>
                    <span>${activeOrder.platformCommissionTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-serif font-bold text-sm text-[#2A2521] pt-1">
                    <span>Grand Total Paid:</span>
                    <span>${activeOrder.total.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Destination and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#EFE7D8]">
                  <div className="text-xs text-[#645D56]">
                    <div className="flex items-center gap-1 text-[#2A2521] font-semibold mb-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A86F47]" />
                      <span>Shipping To:</span>
                    </div>
                    <div>{activeOrder.shippingAddress.fullName}</div>
                    <div>
                      {activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city},{' '}
                      {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.zipCode}
                    </div>
                  </div>

                  {activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => cancelOrder(activeOrder.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Request Cancellation
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </>
    )}
  </div>

      {/* Review Modal if triggered */}
      {productToReview && (
        <WriteReviewModal
          product={productToReview}
          onClose={() => setReviewingProductId(null)}
        />
      )}
    </div>
  );
};
