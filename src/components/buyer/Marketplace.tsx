import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Search,
  Star,
  ShoppingBag,
  Layers,
  Sparkles,
  MapPin,
  SlidersHorizontal,
  X,
  Heart,
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Compass,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useStorefrontCmsStore } from '../../stores/storefrontCmsStore';
import { useListingModerationStore } from '../../stores/listingModerationStore';

export const Marketplace: React.FC = () => {
  const {
    products,
    addToCart,
    open3DStudioWithModel,
    setSelectedProduct,
    setActiveTab,
    toggleWishlist,
    isInWishlist,
    wishlistCount
  } = useApp();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // Dynamic Storefront CMS & Moderation State from Zustand
  const { hero, collections, announcementBar } = useStorefrontCmsStore();
  const getListingStatus = useListingModerationStore((s) => s.getListingStatus);

  const categories = [
    'All',
    'Ceramics & Pottery',
    'Woodwork & Carving',
    'Jewelry & Metals'
  ];

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    maxPrice < 300 ||
    onlyInStock ||
    minRating > 0 ||
    showFavoritesOnly;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(300);
    setOnlyInStock(false);
    setMinRating(0);
    setShowFavoritesOnly(false);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === 'published' && getListingStatus(p.id) === 'approved')
      .filter((p) => {
        if (selectedCollectionId) {
          const activeCol = collections.find((c) => c.id === selectedCollectionId);
          if (activeCol && activeCol.productIds.length > 0 && !activeCol.productIds.includes(p.id)) {
            return false;
          }
        }
        if (showFavoritesOnly && !isInWishlist(p.id)) return false;
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (p.price > maxPrice) return false;
        if (onlyInStock && p.stock <= 0) return false;
        if (minRating > 0 && p.rating < minRating) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSeller = p.sellerName.toLowerCase().includes(q);
          const matchMaterials = p.materials.some((m) => m.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchSeller || matchMaterials;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, showFavoritesOnly, isInWishlist, selectedCategory, maxPrice, onlyInStock, minRating, searchQuery, sortBy]);

  // Card background tones matching reference image (warm sand, sage, terracotta, stone)
  const cardTones = [
    'bg-[#D8C2AA]',
    'bg-[#78866B]',
    'bg-[#C9946E]',
    'bg-[#B5A593]',
    'bg-[#8F9E82]',
    'bg-[#D4B89B]'
  ];

  return (
    <div className="min-h-screen bg-[#F4EEE6] text-[#28231F] pb-28">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 0. ANNOUNCEMENT BAR (MANAGED VIA STOREFRONT CMS) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {announcementBar.enabled && (
        <div className="bg-[#28231F] text-[#D8A45F] py-2 px-4 text-center text-xs font-semibold border-b border-[#443B34] flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D8A45F]" />
          <span>{announcementBar.text}</span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. TOP EDITORIAL HERO (DYNAMICALLY CONFIGURED VIA SUPERADMIN CMS) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#DDD1BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Header & Story Tile (6 cols) */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                {hero.bannerBadgeText && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EFE7DC] border border-[#DDD1BE] text-[#A86F47] uppercase tracking-wider mb-3">
                    {hero.bannerBadgeText}
                  </span>
                )}
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#28231F] leading-[1.06]">
                  {hero.headlinePrefix} <br />
                  by the{' '}
                  <span className="relative inline-block text-[#A86F47] decoration-[#A86F47]/50 underline underline-offset-8">
                    {hero.highlightedWord}
                  </span>
                  {hero.headlineSuffix && (
                    <span className="block text-2xl sm:text-3xl font-normal text-[#645D56] mt-2">
                      {hero.headlineSuffix}
                    </span>
                  )}
                </h1>
              </div>

              {/* Story Mini-Tile with Ceramic Vessel */}
              <div className="flex items-center gap-4 bg-[#EFE7DC] p-4 rounded-2xl border border-[#DDD1BE] max-w-md shadow-xs">
                <div className="w-14 h-14 rounded-xl bg-[#78866B] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80"
                    alt="Ceramic amphora"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="border-l border-[#DDD1BE] pl-4">
                  <p className="text-xs text-[#8B5E3C] leading-relaxed italic">
                    "{hero.subheadline || 'Each curve, texture, and wood-ash glaze tells an intimate story of fire and patience.'}"
                  </p>
                </div>
              </div>
            </div>

            {/* Center Hero Organic Sculpture Showcase (4 cols) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-sm aspect-4/5 bg-[#E8C9B0] rounded-3xl p-6 flex flex-col justify-between border border-[#DDD1BE] shadow-md group overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86F47] bg-[#F4EEE6]/80 px-2.5 py-1 rounded-full border border-[#DDD1BE]">
                    Featured Vessel
                  </span>
                  <button
                    onClick={() => open3DStudioWithModel('amphora-vase')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#28231F] bg-[#F4EEE6]/90 px-3 py-1 rounded-full hover:bg-white shadow-xs cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#A86F47]" />
                    <span>3D Inspect</span>
                  </button>
                </div>

                <div className="my-auto py-2">
                  <img
                    src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80"
                    alt="Terracotta Sculpture"
                    className="w-full h-56 sm:h-64 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-[#DDD1BE]/80">
                  <div>
                    <span className="font-signature text-xl text-[#A86F47] font-bold block">
                      Liam O'Connor
                    </span>
                    <span className="text-xs font-serif font-bold text-[#28231F]">
                      Earthen Amphora No. 4
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[#28231F]">$135</span>
                </div>
              </div>
            </div>

            {/* Right Side: Custom Plan & Circular "LET'S SHOP" Button (2 cols) */}
            <div className="lg:col-span-2 flex flex-col items-start lg:items-end justify-between h-full gap-8">
              {/* Delivery / Custom Plan Badge */}
              <div className="bg-[#EFE7DC] p-4 rounded-2xl border border-[#DDD1BE] text-left lg:text-right w-full sm:w-auto shadow-xs">
                <div className="text-xs font-serif font-bold text-[#28231F]">Get Custom Plan</div>
                <div className="text-xs text-[#8B5E3C] mt-1">
                  <strong className="text-[#A86F47] font-semibold">15 days</strong> delivery <br />
                  for custom satisfaction
                </div>
              </div>

              {/* Distinctive Circular CTA Button (~ LETS SHOP !) from screenshot */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (hero.ctaPrimaryTarget === 'studio') {
                      open3DStudioWithModel('amphora-vase');
                    } else {
                      const catalogEl = document.getElementById('curated-catalog');
                      catalogEl?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#28231F] hover:bg-[#A86F47] text-[#F4EEE6] text-xs font-bold tracking-wider uppercase shadow-xl transition-all active:scale-95 cursor-pointer"
                >
                  <span className="text-sm font-signature text-[#D8A45F] group-hover:text-white">~</span>
                  <span>{hero.ctaPrimaryText ? hero.ctaPrimaryText.toUpperCase() : "LET'S SHOP !"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1.5 DYNAMIC CURATED COLLECTIONS SHOWCASE (MANAGED VIA SUPERADMIN CMS) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {collections.filter((c) => c.featuredOnHome && c.isPublished).length > 0 && (
        <section className="py-12 border-b border-[#DDD1BE] bg-[#EFE7DC]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#F4EEE6] border border-[#DDD1BE] text-[11px] font-bold text-[#A86F47] uppercase tracking-wider mb-2">
                  Curated Themes
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#28231F]">
                  Curated Collections from Master Ateliers
                </h3>
                <p className="text-xs text-[#645D56] mt-1">
                  Handpicked thematic groupings assembled by our platform curators.
                </p>
              </div>

              {selectedCollectionId && (
                <button
                  onClick={() => setSelectedCollectionId(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A86F47] bg-[#F6EDE6] border border-[#E8DEC8] hover:bg-[#EFE7DC] self-start sm:self-auto cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Collection Filter</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections
                .filter((c) => c.featuredOnHome && c.isPublished)
                .map((col) => {
                  const isSelected = selectedCollectionId === col.id;
                  return (
                    <div
                      key={col.id}
                      onClick={() => {
                        setSelectedCollectionId(isSelected ? null : col.id);
                        const catalogEl = document.getElementById('curated-catalog');
                        catalogEl?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`group p-4 rounded-3xl border transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'bg-[#FFFCF7] border-[#A86F47] ring-2 ring-[#A86F47]/30 shadow-md'
                          : 'bg-[#FFFCF7] border-[#E8DEC8] hover:border-[#A86F47]/60 shadow-xs hover:shadow-md'
                      }`}
                    >
                      <div className="relative h-44 rounded-2xl overflow-hidden mb-3.5">
                        <img
                          src={col.coverImageUrl}
                          alt={col.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {col.badge && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#28231F]/90 text-[#D8A45F] backdrop-blur-xs border border-white/10">
                            {col.badge}
                          </span>
                        )}
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6B7A52] text-white">
                            Active Filter ✓
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-lg font-bold text-[#28231F] leading-tight group-hover:text-[#A86F47] transition-colors">
                        {col.title}
                      </h4>
                      <p className="text-xs text-[#645D56] mt-1 line-clamp-2">{col.subtitle}</p>

                      <div className="mt-3 pt-2.5 border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-[#8A7E72]">
                          {col.productIds.length} Artifacts
                        </span>
                        <span className="text-xs font-bold text-[#A86F47] group-hover:underline">
                          {isSelected ? 'Viewing Selection' : 'Explore Collection →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. EDITORIAL MOSAIC: "Enhance your living space with adorable pottery" */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-[#DDD1BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Pill Badge */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#EFE7DC] border border-[#DDD1BE] text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider mb-3">
              Art you can hold
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#28231F] tracking-tight leading-tight">
              Enhance your living space with adorable pottery
            </h2>
          </div>

          {/* Asymmetrical 3-Card Mosaic matching screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Warm sand with white twist craft */}
            <div className="bg-[#EFE7DC] rounded-3xl border border-[#DDD1BE] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-[#E8C9B0] rounded-2xl overflow-hidden p-4 mb-4 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
                  alt="Ceramic craft"
                  className="w-full h-full object-cover rounded-xl shadow-xs"
                />
              </div>
              <div>
                <p className="text-xs text-[#8B5E3C] leading-relaxed">
                  Let <strong>Mudora Creations +</strong> brighten up and ground your sanctuary every day.
                </p>
                <button
                  onClick={() => open3DStudioWithModel('ceramic-teapot')}
                  className="mt-3 text-xs font-semibold text-[#A86F47] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect in 3D Studio →</span>
                </button>
              </div>
            </div>

            {/* Card 2: Sage-green with Studio signature stamp */}
            <div className="bg-[#EFE7DC] rounded-3xl border border-[#DDD1BE] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative">
              <div className="relative aspect-square bg-[#78866B] rounded-2xl overflow-hidden p-4 mb-4 flex items-center justify-center">
                <span className="absolute top-3 left-4 font-signature text-2xl text-white/90 z-10 -rotate-12">
                  Studio Ashoj
                </span>
                <img
                  src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
                  alt="Turned oak craft"
                  className="w-full h-full object-cover rounded-xl shadow-xs"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7A52] block mb-0.5">
                  Hand-lathed White Oak
                </span>
                <p className="text-xs text-[#8B5E3C] leading-relaxed">
                  Natural oil finishes and rhythmic lathe grooves celebrating living timber.
                </p>
                <button
                  onClick={() => open3DStudioWithModel('wood-lamp')}
                  className="mt-3 text-xs font-semibold text-[#A86F47] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Open 3D Workshop →</span>
                </button>
              </div>
            </div>

            {/* Card 3: Artisan Spotlight (Lucie Rie style) */}
            <div className="bg-[#EFE7DC] rounded-3xl border border-[#DDD1BE] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-[#D8C2AA] rounded-2xl overflow-hidden p-4 mb-4 flex items-center justify-center">
                <span className="absolute top-3 left-3 font-signature text-2xl text-[#28231F] z-10">
                  Liam O'Connor
                </span>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="Artisan portrait"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-2 border-white shadow-md my-auto"
                />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#A86F47]">40+</div>
                <div className="text-xs font-semibold text-[#28231F] mt-0.5">
                  Years of Wheel-Thrown Storytelling
                </div>
                <p className="text-[11px] text-[#8B5E3C] mt-1">
                  Santa Fe, New Mexico • Mineral-rich desert clay
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. MIDDLE STORY BANNER: "Grounded in tradition glazed" */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-[#DDD1BE] bg-[#EFE7DC]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title & Process note (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#EFE7DC] border border-[#DDD1BE] text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
                Touch the Craft
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#28231F] tracking-tight leading-tight">
                Grounded in tradition glazed
              </h2>
              <p className="text-xs sm:text-sm text-[#8B5E3C] leading-relaxed">
                Handcrafted in small studio batches, our pottery celebrates the imperfect beauty of wabi-sabi. Every vessel spends 72 hours inside the wood-fired kiln before entering client homes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => open3DStudioWithModel('amphora-vase')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-full text-xs font-semibold tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D Artisan Studio</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F4EEE6] hover:bg-[#EFE7DC] text-[#28231F] rounded-full text-xs font-semibold border border-[#DDD1BE] transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-[#A86F47]" />
                  <span>View Wishlist ({wishlistCount})</span>
                </button>
              </div>
            </div>

            {/* Editorial Process Collage (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#78866B] rounded-2xl p-4 text-white flex flex-col justify-between shadow-xs aspect-4/5 sm:aspect-auto">
                <div className="w-12 h-12 rounded-xl bg-white/20 p-1 flex items-center justify-center overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=300&q=80"
                    alt="Hand-thrown bowl"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold">15 Days</div>
                  <div className="text-[11px] text-white/80 mt-0.5">Custom studio plan satisfaction</div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#D8A45F] flex items-center gap-1">
                    CUSTOM ORDER <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="bg-[#EFE7DC] rounded-2xl p-4 border border-[#DDD1BE] flex flex-col justify-between shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                  alt="Artisan jeweler"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white mb-4 shadow-sm"
                />
                <div>
                  <div className="text-xs font-serif font-bold text-[#28231F]">Maya Chen</div>
                  <div className="text-[11px] text-[#8B5E3C] mt-0.5">
                    Meticulously forged by the skilled hands of Arizona metalsmiths.
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-xs border border-[#DDD1BE] group min-h-[180px]">
                <img
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=500&q=80"
                  alt="Potter wheel throwing hands"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-[11px] font-semibold text-white tracking-wide flex items-center gap-1">
                    MODERN SPACE <ArrowUpRight className="w-3 h-3 text-[#D8A45F]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. MAIN CURATED CATALOG SECTION */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="curated-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Editorial Subhead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#DDD1BE] gap-4">
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#EFE7DC] border border-[#DDD1BE] text-[10px] font-bold uppercase tracking-wider text-[#A86F47] mb-2">
              Studio Catalogue
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231F] tracking-tight">
              Curated Handmade Pieces
            </h2>
          </div>

          {/* Back button when filters are active */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EFE7DC] hover:bg-[#E6DCCD] text-xs font-semibold text-[#28231F] border border-[#DDD1BE] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#A86F47]" />
              <span>Back to All Curations</span>
            </button>
          )}
        </div>

        {/* Filter, Search & Category Controls */}
        <div className="py-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
              <input
                type="text"
                placeholder="Search by piece, clay, oak, or maker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#EFE7DC] border border-[#DDD1BE] rounded-full text-xs text-[#28231F] placeholder-[#8B5E3C] focus:outline-hidden focus:border-[#A86F47] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sorting & Filter Drawer Toggle */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="flex items-center gap-2 bg-[#EFE7DC] border border-[#DDD1BE] rounded-full px-3.5 sm:px-4 py-2 text-xs">
                <span className="text-[#8B5E3C] font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold text-[#28231F] focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Pieces</option>
                </select>
              </div>

              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#EFE7DC] border border-[#DDD1BE] rounded-full text-xs font-semibold text-[#28231F] hover:bg-[#E6DCCD] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#A86F47]" />
                <span>Filters {maxPrice < 300 || onlyInStock || minRating > 0 ? '(Active)' : ''}</span>
              </button>
            </div>
          </div>

          {/* Category & Wishlist Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowFavoritesOnly(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat && !showFavoritesOnly
                    ? 'bg-[#A86F47] text-white shadow-xs'
                    : 'bg-[#EFE7DC] text-[#8B5E3C] hover:bg-[#E6DCCD] border border-[#DDD1BE]'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Dedicated Wishlist / Favorites Toggle Pill */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-[#A86F47] text-white shadow-xs'
                  : 'bg-[#EFE7DC] text-[#A86F47] hover:bg-[#F6EDE6] border border-[#DDD1BE]'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  showFavoritesOnly ? 'fill-current text-white' : 'fill-[#A86F47] text-[#A86F47]'
                }`}
              />
              <span>Favorites ({wishlistCount})</span>
            </button>
          </div>

          {/* Expandable Filter Tray */}
          {showFiltersMobile && (
            <div className="bg-[#EFE7DC] border border-[#DDD1BE] rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs animate-in fade-in slide-in-from-top-2">
              <div>
                <div className="flex justify-between font-semibold mb-1 text-[#28231F]">
                  <span>Max Price:</span>
                  <span className="text-[#A86F47] font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="300"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#DDD1BE] rounded-lg appearance-none cursor-pointer accent-[#A86F47]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-[#A86F47] accent-[#A86F47] focus:ring-[#A86F47] cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-[#28231F] font-medium cursor-pointer">
                  In-Stock Ready to Ship Only
                </label>
              </div>

              <div>
                <span className="font-semibold block mb-1 text-[#28231F]">Minimum Rating:</span>
                <div className="flex gap-1.5">
                  {[0, 4.5, 4.8, 5.0].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-2.5 py-1 rounded-full border text-xs cursor-pointer ${
                        minRating === r
                          ? 'bg-[#6B7A52] text-white border-[#6B7A52] font-semibold'
                          : 'bg-[#F4EEE6] text-[#8B5E3C] border-[#DDD1BE]'
                      }`}
                    >
                      {r === 0 ? 'All' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Count & 5% Guarantee Status */}
        <div className="flex items-center justify-between text-xs text-[#8B5E3C] mb-6">
          <span>
            Displaying <strong>{filteredProducts.length}</strong> handcrafted pieces
          </span>
          <span className="hidden sm:inline text-[#6B7A52] font-semibold">
            ✓ 95% of gross sale proceeds flow directly into artisan accounts
          </span>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#EFE7DC]/60 rounded-3xl border border-[#DDD1BE]">
            {showFavoritesOnly ? (
              <>
                <Heart className="w-12 h-12 text-[#A86F47]/40 mx-auto mb-3" />
                <h3 className="font-serif text-2xl font-bold text-[#28231F]">No favorites saved yet</h3>
                <p className="text-xs text-[#8B5E3C] mt-2 max-w-sm mx-auto leading-relaxed">
                  Click the heart icon on any piece in our collection to save your favorite handmade objects.
                </p>
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="mt-5 px-6 py-2.5 bg-[#A86F47] text-white rounded-full text-xs font-semibold tracking-wider uppercase shadow-xs cursor-pointer"
                >
                  Explore All Pieces
                </button>
              </>
            ) : (
              <>
                <Layers className="w-12 h-12 text-[#A86F47]/40 mx-auto mb-3" />
                <h3 className="font-serif text-2xl font-bold text-[#28231F]">No handcrafted pieces matched</h3>
                <p className="text-xs text-[#8B5E3C] mt-2 max-w-sm mx-auto leading-relaxed">
                  Try adjusting your price range, search query, or category filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-5 px-6 py-2.5 bg-[#A86F47] text-white rounded-full text-xs font-semibold tracking-wider uppercase shadow-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
              </>
            )}
          </div>
        ) : (
          /* Editorial Product Cards Grid (Matching right panel of Reference 1) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => {
              const isLowStock = product.stock > 0 && product.stock <= 4;
              const isOutOfStock = product.stock <= 0;
              const bgTone = cardTones[idx % cardTones.length];

              return (
                <div
                  key={product.id}
                  className="group bg-[#EFE7DC] border border-[#DDD1BE] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Large Product Image on Tonal Background (Matching reference card) */}
                  <div className={`relative aspect-4/5 ${bgTone} p-5 flex items-center justify-center overflow-hidden`}>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      onClick={() => setSelectedProduct(product)}
                      className="w-full h-full object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    />

                    {/* Wishlist Heart Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-4 left-4 z-10 p-2.5 rounded-full transition-all duration-200 shadow-md cursor-pointer ${
                        isInWishlist(product.id)
                          ? 'bg-[#F4EEE6] text-[#A86F47] hover:scale-110 ring-1 ring-[#A86F47]/40'
                          : 'bg-[#28231F]/60 hover:bg-[#28231F] text-white hover:text-[#D8A45F]'
                      }`}
                      aria-label={isInWishlist(product.id) ? "Remove from favorites" : "Save to favorites"}
                      title={isInWishlist(product.id) ? "In your favorites" : "Save to favorites"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform ${
                          isInWishlist(product.id)
                            ? 'fill-[#A86F47] text-[#A86F47] scale-105'
                            : 'text-white'
                        }`}
                      />
                    </button>

                    {/* 3D Inspect Action Badge */}
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

                    {/* Stock Status Badge */}
                    <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                      {product.featured && (
                        <span className="px-2.5 py-1 bg-[#6B7A52] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                          Artisan Pick
                        </span>
                      )}
                      {isLowStock && (
                        <span className="px-2.5 py-0.5 bg-[#A86F47] text-white text-[10px] font-semibold rounded-full shadow-sm">
                          Only {product.stock} Left
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="px-2.5 py-0.5 bg-[#28231F] text-white text-[10px] font-semibold rounded-full shadow-sm">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content with "Designed By" Signature Bar */}
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

                      {/* Title & Description */}
                      <div className="pt-3">
                        <div className="flex items-center justify-between text-[11px] text-[#8B5E3C] mb-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#A86F47]" />
                            {product.sellerLocation}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-[#A86F47]">
                            <Star className="w-3 h-3 fill-current" />
                            {product.rating} ({product.reviewsCount})
                          </span>
                        </div>

                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="font-serif text-lg font-bold text-[#28231F] hover:text-[#A86F47] transition-colors cursor-pointer line-clamp-1"
                        >
                          {product.title}
                        </h3>

                        <p className="mt-1 text-xs text-[#8B5E3C] line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="mt-5 pt-4 border-t border-[#DDD1BE] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[#8B5E3C] block">
                          {product.category}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-[#28231F]">
                            ${product.price}
                          </span>
                          <span className="text-[10px] text-gray-500">USD</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-3 py-2 text-xs font-semibold text-[#28231F] hover:text-[#A86F47] transition-colors cursor-pointer"
                        >
                          Story
                        </button>

                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={isOutOfStock}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
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
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. BOTTOM EDITORIAL FEATURE: "Crafted from clay made for moments" */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="mt-24 pt-16 border-t border-[#DDD1BE] bg-[#EFE7DC]/40 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left bowl image */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs aspect-square bg-[#D8C2AA] rounded-3xl p-6 flex items-center justify-center border border-[#DDD1BE] shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=500&q=80"
                  alt="Carved Bowl"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            </div>

            {/* Center statement & circular CTA */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#EFE7DC] border border-[#DDD1BE] text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
                Moments in Clay
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#28231F] tracking-tight leading-tight">
                Crafted from clay made for moments
              </h2>
              <p className="text-xs sm:text-sm text-[#8B5E3C] leading-relaxed">
                Each piece is thoughtfully shaped by hand using rich, earthy minerals that capture the raw and honest tactile truth of studio craft.
              </p>

              <div className="pt-2 flex items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => {
                    const catalogEl = document.getElementById('curated-catalog');
                    catalogEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-full bg-[#28231F] hover:bg-[#A86F47] text-[#F4EEE6] text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  SHOP NOW
                </button>
                <div className="text-left">
                  <div className="font-signature text-xl text-[#A86F47] font-bold">
                    Santorini Studio
                  </div>
                  <div className="text-[10px] text-[#8B5E3C] font-medium">1987 — 2026</div>
                </div>
              </div>
            </div>

            {/* Right vessel tile */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="w-full max-w-[220px] aspect-square bg-[#78866B] rounded-3xl p-6 flex items-center justify-center border border-[#DDD1BE] shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80"
                  alt="Glazed stoneware vessel"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
