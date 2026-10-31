import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Layers,
  Sparkles,
  MapPin,
  Star,
  Trash2
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    open3DStudioWithModel,
    setSelectedProduct,
    setActiveTab
  } = useApp();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  // Tonal background colors for editorial cards matching the reference image
  const cardTones = [
    'bg-[#D8C2AA]', // warm sand / earth
    'bg-[#78866B]', // muted sage green
    'bg-[#C9946E]', // terracotta clay
    'bg-[#B5A593]', // warm stone
    'bg-[#8F9E82]'  // pale sage
  ];

  return (
    <div className="min-h-screen bg-[#F4EEE6] text-[#28231F] pb-24">
      {/* Top Navigation & Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <button
          onClick={() => setActiveTab('marketplace')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFE7DC] hover:bg-[#E6DCCD] text-[#28231F] text-xs font-semibold tracking-wide border border-[#DDD1BE] transition-all shadow-xs group active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#A86F47] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-[#DDD1BE] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE7DC] border border-[#DDD1BE] text-[11px] font-semibold text-[#A86F47] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Patron Collection
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#28231F] tracking-tight">
                Your Saved Favorites
              </h1>
              <p className="mt-2 text-sm text-[#8B5E3C] max-w-xl">
                Objects that resonated with your space. Handcrafted in limited studio batches by master potters and woodworkers.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#A86F47]">
                {favoriteProducts.length}
              </span>
              <span className="text-xs text-[#8B5E3C] block uppercase tracking-wider">
                {favoriteProducts.length === 1 ? 'Piece Reserved' : 'Pieces Reserved'}
              </span>
            </div>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        {favoriteProducts.length === 0 ? (
          <div className="mt-12 text-center py-20 bg-[#EFE7DC]/60 rounded-3xl border border-[#DDD1BE] p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#F4EEE6] flex items-center justify-center mx-auto mb-4 border border-[#DDD1BE] shadow-xs">
              <Heart className="w-8 h-8 text-[#A86F47]/50" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#28231F]">
              Your collection is empty
            </h3>
            <p className="text-xs text-[#8B5E3C] mt-2 max-w-sm mx-auto leading-relaxed">
              Explore our artisan workshops, inspect wheel-thrown vessels in real-time 3D, and tap the heart icon on pieces you love.
            </p>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-full text-xs font-semibold tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteProducts.map((product, idx) => {
              const bgTone = cardTones[idx % cardTones.length];
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  className="group bg-[#EFE7DC] border border-[#DDD1BE] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image container with colored backdrop like reference image */}
                  <div className={`relative aspect-4/5 ${bgTone} p-5 flex items-center justify-center overflow-hidden`}>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      onClick={() => setSelectedProduct(product)}
                      className="w-full h-full object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    />

                    {/* Heart removal toggle */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-[#F4EEE6]/90 hover:bg-[#F4EEE6] text-[#A86F47] shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-[#A86F47] text-[#A86F47]" />
                    </button>

                    {/* 3D Model Inspection Button */}
                    {product.model3dType && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          open3DStudioWithModel(product.model3dType!);
                        }}
                        className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#28231F]/90 hover:bg-[#28231F] text-[#F4EEE6] text-xs font-medium rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#D8A45F]" />
                        <span>3D View</span>
                      </button>
                    )}

                    {/* Stock badge */}
                    {isOutOfStock ? (
                      <span className="absolute top-4 right-4 px-2.5 py-1 bg-[#28231F] text-white text-[10px] font-semibold rounded-full shadow-sm">
                        Sold Out
                      </span>
                    ) : product.stock <= 3 ? (
                      <span className="absolute top-4 right-4 px-2.5 py-1 bg-[#A86F47] text-white text-[10px] font-semibold rounded-full shadow-sm">
                        Only {product.stock} Left
                      </span>
                    ) : null}
                  </div>

                  {/* Editorial card details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Designed By Signature Bar matching reference */}
                      <div className="pb-3 border-b border-[#DDD1BE] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#8B5E3C] uppercase tracking-wider font-semibold">
                          Designed By
                        </span>
                        <span className="font-signature text-xl text-[#A86F47] font-bold">
                          {product.sellerName.replace(' Pottery', '').replace(' Guild', '').replace(' Metalsmiths', '')}
                        </span>
                      </div>

                      {/* Title & Provenance */}
                      <div className="pt-3">
                        <div className="flex items-center gap-1 text-[11px] text-[#8B5E3C] mb-1">
                          <MapPin className="w-3 h-3 text-[#A86F47]" />
                          <span>{product.sellerLocation}</span>
                          <span>•</span>
                          <span className="text-[#6B7A52] font-semibold">{product.leadTime}</span>
                        </div>
                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="font-serif text-lg font-bold text-[#28231F] hover:text-[#A86F47] transition-colors cursor-pointer line-clamp-1"
                        >
                          {product.title}
                        </h3>
                        <p className="text-xs text-[#8B5E3C] mt-1 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="mt-5 pt-4 border-t border-[#DDD1BE] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8B5E3C] block">
                          {product.category}
                        </span>
                        <span className="text-2xl font-bold text-[#28231F]">
                          ${product.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="p-2.5 rounded-xl border border-[#DDD1BE] text-[#8B5E3C] hover:text-red-600 hover:bg-[#F4EEE6] transition-colors cursor-pointer"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={isOutOfStock}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                            isOutOfStock
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-[#A86F47] hover:bg-[#8F5732] text-white active:scale-95'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
