import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { WriteReviewModal } from './WriteReviewModal';
import {
  X,
  Star,
  ShoppingBag,
  Layers,
  MapPin,
  ShieldCheck,
  Truck,
  Sparkles,
  Calendar,
  MessageSquarePlus,
  CheckCircle2,
  Package,
  Heart,
  ArrowLeft
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, open3DStudioWithModel, getProductReviews, toggleWishlist, isInWishlist } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const reviews = getProductReviews(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="relative bg-[#F4EEE6] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#DDD1BE] z-10 animate-in fade-in zoom-in-95 my-auto">
          {/* Top Bar with Back Button and Close Button */}
          <div className="sticky top-0 z-20 bg-[#F4EEE6]/95 backdrop-blur-xs px-6 py-4 border-b border-[#DDD1BE] flex items-center justify-between">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DC] hover:bg-[#E6DCCD] text-[#28231F] text-xs font-semibold border border-[#DDD1BE] transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#A86F47] group-hover:-translate-x-1 transition-transform" />
              <span>Back to Marketplace</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#EFE7DC] hover:bg-[#E6DCCD] text-gray-500 hover:text-gray-900 border border-[#DDD1BE] shadow-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
            {/* Left Column: Image Gallery & 3D Studio Trigger */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square bg-[#EFE8DD] rounded-2xl overflow-hidden border border-[#E4D9C4] shadow-xs">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* 3D Model Inspection Badge */}
                {product.model3dType && (
                  <button
                    onClick={() => {
                      onClose();
                      open3DStudioWithModel(product.model3dType!);
                    }}
                    className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2.5 bg-[#2A2521] hover:bg-[#3D352E] text-[#FDFBF7] text-xs font-semibold rounded-xl shadow-xl transition-transform active:scale-95"
                  >
                    <Layers className="w-4 h-4 text-[#D8A45F]" />
                    <span>Launch 3D Studio Inspection</span>
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#A86F47] scale-95 shadow-sm'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Artisan Profile Card */}
              <div className="bg-[#EFE7DC] border border-[#DDD1BE] rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#A86F47]/20 overflow-hidden shrink-0 border border-[#A86F47]/30">
                  <img
                    src={product.sellerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                    alt={product.sellerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A86F47]">
                    Master Artisan Guild
                  </div>
                  <div className="text-sm font-serif font-bold text-[#28231F] truncate">
                    {product.sellerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8B5E3C] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A86F47]" />
                    <span>{product.sellerLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Specifications, Story, Ordering */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EFE7DC] border border-[#DDD1BE] text-[11px] font-semibold text-[#A86F47]">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#A86F47] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current text-[#A86F47]" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400">({reviews.length} reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#28231F] leading-snug">
                  {product.title}
                </h1>

                {/* Price and Stock */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#28231F]">
                    ${product.price}
                  </span>
                  <span className="text-xs text-[#6B7A52] font-semibold bg-[#EFF3EB] px-2.5 py-1 rounded-md">
                    {product.stock > 0 ? `${product.stock} pieces crafted in studio` : 'Currently Sold Out'}
                  </span>
                </div>

                {/* Handcrafted Story */}
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A86F47] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    The Artisan’s Tale & Provenance
                  </h3>
                  <p className="text-xs text-[#8B5E3C] leading-relaxed italic bg-[#EFE7DC] p-3.5 rounded-xl border border-[#DDD1BE]">
                    "{product.story}"
                  </p>
                  <p className="text-xs text-[#28231F] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Craft Specs Grid */}
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#EFE7DC] p-3 rounded-xl border border-[#DDD1BE]">
                    <span className="text-[#8B5E3C] block text-[10px] font-semibold uppercase tracking-wider">
                      Materials
                    </span>
                    <span className="font-medium text-[#28231F] mt-0.5 block">
                      {product.materials.join(', ')}
                    </span>
                  </div>
                  <div className="bg-[#EFE7DC] p-3 rounded-xl border border-[#DDD1BE]">
                    <span className="text-[#8B5E3C] block text-[10px] font-semibold uppercase tracking-wider">
                      Dimensions
                    </span>
                    <span className="font-medium text-[#28231F] mt-0.5 block">
                      {product.dimensions} ({product.weight})
                    </span>
                  </div>
                  <div className="bg-[#EFE7DC] p-3 rounded-xl border border-[#DDD1BE]">
                    <span className="text-[#8B5E3C] block text-[10px] font-semibold uppercase tracking-wider">
                      Lead Time
                    </span>
                    <span className="font-medium text-[#28231F] mt-0.5 block">
                      {product.leadTime}
                    </span>
                  </div>
                  <div className="bg-[#EFE7DC] p-3 rounded-xl border border-[#DDD1BE]">
                    <span className="text-[#8B5E3C] block text-[10px] font-semibold uppercase tracking-wider">
                      Care Ritual
                    </span>
                    <span className="font-medium text-[#28231F] mt-0.5 block">
                      {product.careInstructions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Controls */}
              <div className="mt-8 pt-6 border-t border-[#EFE7D8]">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                  {/* Quantity Stepper & Wishlist on small screens */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[#DDD1BE] rounded-xl bg-[#EFE7DC] overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-sm font-bold text-gray-700 hover:bg-[#E6DCCD] transition-colors cursor-pointer"
                        disabled={isOutOfStock}
                      >
                        −
                      </button>
                      <span className="px-3.5 py-2 text-xs font-semibold text-[#28231F]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-2 text-sm font-bold text-gray-700 hover:bg-[#E6DCCD] transition-colors cursor-pointer"
                        disabled={isOutOfStock || quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                        isInWishlist(product.id)
                          ? 'bg-[#F6EDE6] border-[#A86F47] text-[#A86F47] shadow-xs'
                          : 'bg-[#EFE7DC] border-[#DDD1BE] text-gray-500 hover:text-[#A86F47] hover:bg-[#E6DCCD]'
                      }`}
                      aria-label={isInWishlist(product.id) ? "Remove from favorites" : "Save to favorites"}
                      title={isInWishlist(product.id) ? "In your favorites" : "Save to favorites"}
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                          isInWishlist(product.id) ? 'fill-[#A86F47] text-[#A86F47] scale-105' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      addToCart(product, quantity);
                      onClose();
                    }}
                    disabled={isOutOfStock}
                    className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#A86F47] hover:bg-[#8F5732] text-white active:scale-98'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : `Add to Bag • $${product.price * quantity}`}</span>
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#8B5E3C]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6B7A52]" />
                    5% Fair Platform Guarantee
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#A86F47]" />
                    Zero-Plastic Shipped
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Customer Reviews & Ratings */}
          <div className="p-6 sm:p-10 bg-[#EFE7DC] border-t border-[#DDD1BE]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#28231F]">
                  Artisan Collector Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-[#8B5E3C] mt-0.5">
                  Verified feedback from patrons who welcomed this piece into their collection.
                </p>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F4EEE6] hover:bg-[#E6DCCD] text-[#28231F] border border-[#DDD1BE] rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4 text-[#A86F47]" />
                <span>Write a Review</span>
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-[#F4EEE6] rounded-2xl border border-[#DDD1BE]">
                <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No reviews yet for this limited studio piece.</p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="mt-2 text-xs font-semibold text-[#A86F47] underline cursor-pointer"
                >
                  Be the first to leave a review
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-[#F4EEE6] rounded-2xl border border-[#DDD1BE] shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.buyerAvatar}
                          alt={rev.buyerName}
                          className="w-7 h-7 rounded-full object-cover border border-[#DDD1BE]"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#28231F] flex items-center gap-1">
                            {rev.buyerName}
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-[#6B7A52] font-normal flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-[#6B7A52]" /> Verified Patron
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400">{rev.createdAt}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-[#A86F47]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current text-[#A86F47]' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-[#28231F]">{rev.title}</h4>
                    <p className="mt-1 text-xs text-[#8B5E3C] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showReviewModal && (
        <WriteReviewModal
          product={product}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </>
  );
};
