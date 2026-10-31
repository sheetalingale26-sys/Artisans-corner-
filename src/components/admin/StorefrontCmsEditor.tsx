import React, { useState } from 'react';
import { useStorefrontCmsStore } from '../../stores/storefrontCmsStore';
import { useApp } from '../../context/AppContext';
import { CuratedCollection } from '../../types';
import {
  Sparkles,
  Layout,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Save,
  RotateCcw,
  Palette,
  Megaphone,
  Layers,
  ShoppingBag
} from 'lucide-react';

export const StorefrontCmsEditor: React.FC = () => {
  const { products, showToast } = useApp();
  const {
    hero,
    sections,
    collections,
    announcementBar,
    updateHero,
    addCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionHome,
    toggleSectionEnabled,
    reorderSections,
    updateAnnouncementBar,
    resetToDefaults
  } = useStorefrontCmsStore();

  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'collections' | 'sections' | 'announcement'>('hero');

  // Hero form state
  const [heroForm, setHeroForm] = useState(hero);

  // Collection modal / form state
  const [editingCollection, setEditingCollection] = useState<CuratedCollection | null>(null);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');
  const [newColSubtitle, setNewColSubtitle] = useState('');
  const [newColDescription, setNewColDescription] = useState('');
  const [newColBadge, setNewColBadge] = useState('Curator Choice');
  const [newColImage, setNewColImage] = useState('https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80');
  const [newColCategory, setNewColCategory] = useState('Ceramics & Pottery');
  const [newColProducts, setNewColProducts] = useState<string[]>(['p1', 'p2']);

  // Announcement state
  const [announcementText, setAnnouncementText] = useState(announcementBar.text);
  const [announcementEnabled, setAnnouncementEnabled] = useState(announcementBar.enabled);

  const handleSaveHero = () => {
    updateHero(heroForm);
    showToast('Storefront Hero Campaign published to live marketplace!', 'success');
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) {
      showToast('Please specify a collection title.', 'error');
      return;
    }

    addCollection({
      slug: newColTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newColTitle.trim(),
      subtitle: newColSubtitle.trim() || 'Curated artisan selection',
      description: newColDescription.trim() || 'Fine handcrafted works.',
      badge: newColBadge.trim() || undefined,
      coverImageUrl: newColImage.trim(),
      categoryFilter: newColCategory,
      productIds: newColProducts,
      displayOrder: collections.length + 1,
      isPublished: true,
      featuredOnHome: true
    });

    setIsAddingCollection(false);
    setNewColTitle('');
    setNewColSubtitle('');
    setNewColDescription('');
    showToast(`Curated Collection "${newColTitle}" created!`, 'success');
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    // re-assign orders
    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    reorderSections(reordered);
    showToast('Homepage section sequence updated.', 'info');
  };

  const handleSaveAnnouncement = () => {
    updateAnnouncementBar(announcementEnabled, announcementText);
    showToast('Announcement Bar updated.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* CMS Sub-Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8]">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'hero', label: 'Hero Campaign', icon: Sparkles },
            { id: 'collections', label: `Curated Collections (${collections.length})`, icon: Layers },
            { id: 'sections', label: 'Section Sequence & Toggles', icon: Layout },
            { id: 'announcement', label: 'Announcement Bar', icon: Megaphone }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#28231F] text-white shadow-xs'
                    : 'bg-[#FFFCF7] text-[#645D56] hover:text-[#28231F] border border-[#E8DEC8]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#D8A45F]' : 'text-[#A86F47]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all storefront CMS settings to factory default?')) {
              resetToDefaults();
              setHeroForm(useStorefrontCmsStore.getState().hero);
              showToast('Storefront reset to initial curated state.', 'warning');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/* 1. HERO CAMPAIGN MANAGER */}
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeSubTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Edit Controls */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FFFCF7] border border-[#E8DEC8] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#28231F]">Homepage Hero Campaign</h4>
                <p className="text-xs text-[#645D56]">Edit the primary high-conversion headline and editorial banner.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EFF3EB] text-[#6B7A52] border border-[#D9E3D3]">
                Live Storefront
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#28231F] block mb-1">Headline Prefix</label>
                <input
                  type="text"
                  value={heroForm.headlinePrefix}
                  onChange={(e) => setHeroForm({ ...heroForm, headlinePrefix: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#28231F] block mb-1">Highlighted Accent Word</label>
                <input
                  type="text"
                  value={heroForm.highlightedWord}
                  onChange={(e) => setHeroForm({ ...heroForm, highlightedWord: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#28231F] block mb-1">Headline Suffix (2nd Line)</label>
              <input
                type="text"
                value={heroForm.headlineSuffix}
                onChange={(e) => setHeroForm({ ...heroForm, headlineSuffix: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#28231F] block mb-1">Subheadline & Editorial Pitch</label>
              <textarea
                rows={3}
                value={heroForm.subheadline}
                onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#28231F] block mb-1">Primary CTA Button Text</label>
                <input
                  type="text"
                  value={heroForm.ctaPrimaryText}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryText: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#28231F] block mb-1">Banner Badge Text</label>
                <input
                  type="text"
                  value={heroForm.bannerBadgeText}
                  onChange={(e) => setHeroForm({ ...heroForm, bannerBadgeText: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={handleSaveHero}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Publish Hero Changes</span>
              </button>
            </div>
          </div>

          {/* Live Mock Preview */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#F4EEE6] border border-[#DDD1BE] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#A86F47] uppercase tracking-wider block mb-3">
                Live Storefront Mockup
              </span>
              <div className="p-5 rounded-2xl bg-[#FFFCF7] border border-[#E8DEC8] shadow-xs space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EDE6] text-[#A86F47] border border-[#E8DEC8]">
                  {heroForm.bannerBadgeText}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#28231F] leading-tight">
                  {heroForm.headlinePrefix}{' '}
                  <span className="text-[#A86F47] underline underline-offset-4 decoration-[#A86F47]/50">
                    {heroForm.highlightedWord}
                  </span>
                  <br />
                  <span className="text-xl font-normal text-[#645D56]">{heroForm.headlineSuffix}</span>
                </h3>
                <p className="text-xs text-[#645D56] leading-relaxed">{heroForm.subheadline}</p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-2 rounded-xl bg-[#28231F] text-white text-xs font-semibold">
                    {heroForm.ctaPrimaryText} â†’
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/70 rounded-xl border border-[#DDD1BE] text-[11px] text-[#645D56]">
              ðŸ’¡ Changes saved here immediately update the top banner visible to all buyers on the homepage.
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/* 2. CURATED COLLECTIONS STUDIO */}
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeSubTab === 'collections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#28231F]">Curated Collections Showcase</h4>
              <p className="text-xs text-[#645D56]">Curate themed product groupings showcased directly on the homepage and filter bar.</p>
            </div>
            <button
              onClick={() => setIsAddingCollection(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6B7A52] hover:bg-[#586543] text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Collection</span>
            </button>
          </div>

          {/* New Collection Form Modal */}
          {isAddingCollection && (
            <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E8DEC8] shadow-sm animate-in fade-in space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
                <h5 className="font-serif text-base font-bold text-[#28231F]">Design New Curated Collection</h5>
                <button
                  onClick={() => setIsAddingCollection(false)}
                  className="text-xs text-[#8A7E72] hover:text-[#28231F]"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#28231F] block mb-1">Collection Title *</label>
                    <input
                      type="text"
                      value={newColTitle}
                      onChange={(e) => setNewColTitle(e.target.value)}
                      placeholder="e.g. Earthy Tableware 2026"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#28231F] block mb-1">Editorial Badge</label>
                    <input
                      type="text"
                      value={newColBadge}
                      onChange={(e) => setNewColBadge(e.target.value)}
                      placeholder="Curator Choice, Heritage Guild, Eco-Certified"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#28231F] block mb-1">Subtitle / Craft Narrative</label>
                  <input
                    type="text"
                    value={newColSubtitle}
                    onChange={(e) => setNewColSubtitle(e.target.value)}
                    placeholder="Wheel-thrown stoneware and natural glaze items for communal dining."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#28231F] block mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={newColImage}
                      onChange={(e) => setNewColImage(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#28231F] block mb-1">Category Filter</label>
                    <select
                      value={newColCategory}
                      onChange={(e) => setNewColCategory(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                    >
                      <option value="Ceramics & Pottery">Ceramics & Pottery</option>
                      <option value="Woodwork & Carving">Woodwork & Carving</option>
                      <option value="Jewelry & Metals">Jewelry & Metals</option>
                      <option value="All">All Categories</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCollection(false)}
                    className="px-4 py-2 rounded-xl text-xs text-[#645D56] bg-white border border-[#DDD1BE]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#6B7A52] text-white text-xs font-semibold shadow-xs hover:bg-[#586543]"
                  >
                    Save & Publish Collection
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Collections List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {collections.map((col) => (
              <div
                key={col.id}
                className="p-5 rounded-3xl bg-[#FFFCF7] border border-[#E8DEC8] shadow-xs flex flex-col justify-between overflow-hidden relative"
              >
                <div>
                  <div className="relative h-36 rounded-2xl overflow-hidden mb-3.5">
                    <img
                      src={col.coverImageUrl}
                      alt={col.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    {col.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#28231F]/90 text-[#D8A45F] backdrop-blur-xs border border-white/10">
                        {col.badge}
                      </span>
                    )}
                    <span
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        col.featuredOnHome
                          ? 'bg-[#EFF3EB] text-[#6B7A52] border border-[#D9E3D3]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {col.featuredOnHome ? 'On Homepage' : 'Hidden'}
                    </span>
                  </div>

                  <h5 className="font-serif text-base font-bold text-[#28231F] leading-snug">{col.title}</h5>
                  <p className="text-xs text-[#645D56] mt-1 line-clamp-2">{col.subtitle}</p>
                  <div className="text-[11px] text-[#A86F47] font-semibold mt-2">
                    {col.categoryFilter || 'All Crafts'} â€¢ {col.productIds.length} Products Curated
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      toggleCollectionHome(col.id);
                      showToast(`Collection ${col.featuredOnHome ? 'hidden from' : 'shown on'} homepage.`, 'info');
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                      col.featuredOnHome
                        ? 'bg-[#F6EDE6] text-[#A86F47] hover:bg-[#EFE7DC]'
                        : 'bg-[#EFF3EB] text-[#6B7A52] hover:bg-[#E4ECD9]'
                    }`}
                  >
                    {col.featuredOnHome ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{col.featuredOnHome ? 'Hide' : 'Show on Home'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete collection "${col.title}"?`)) {
                        deleteCollection(col.id);
                        showToast('Collection removed.', 'warning');
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-700 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/* 3. SECTION VISIBILITY & ORDERING */}
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeSubTab === 'sections' && (
        <div className="p-6 rounded-3xl bg-[#FFFCF7] border border-[#E8DEC8] shadow-sm space-y-4">
          <div className="border-b border-[#E8DEC8] pb-3">
            <h4 className="font-serif text-lg font-bold text-[#28231F]">Homepage Section Sequence & Display</h4>
            <p className="text-xs text-[#645D56]">Reorder or toggle sections displayed to patrons on the landing page.</p>
          </div>

          <div className="space-y-2.5">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8] hover:border-[#A86F47]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E8DEC8] text-[#28231F] text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="text-xs sm:text-sm text-[#28231F] block">{section.title}</strong>
                    {section.subtitle && <span className="text-[11px] text-[#645D56]">{section.subtitle}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-[#DDD1BE] text-gray-600 hover:text-black disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveSection(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1.5 rounded-lg border border-[#DDD1BE] text-gray-600 hover:text-black disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      toggleSectionEnabled(section.id);
                      showToast(`Section "${section.title}" ${section.isEnabled ? 'disabled' : 'enabled'}.`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      section.isEnabled
                        ? 'bg-[#EFF3EB] text-[#6B7A52] border border-[#D9E3D3]'
                        : 'bg-gray-100 text-gray-500 border border-gray-300'
                    }`}
                  >
                    {section.isEnabled ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/* 4. ANNOUNCEMENT BAR */}
      {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeSubTab === 'announcement' && (
        <div className="p-6 rounded-3xl bg-[#FFFCF7] border border-[#E8DEC8] shadow-sm space-y-4 max-w-xl">
          <div className="border-b border-[#E8DEC8] pb-3">
            <h4 className="font-serif text-lg font-bold text-[#28231F]">Top Announcement Bar</h4>
            <p className="text-xs text-[#645D56]">Global banner message placed above the navigation header.</p>
          </div>

          <label className="flex items-center gap-2.5 text-xs font-semibold text-[#28231F] cursor-pointer">
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="rounded text-[#A86F47] focus:ring-[#A86F47]"
            />
            <span>Enable Announcement Bar on Storefront</span>
          </label>

          <div>
            <label className="text-xs font-semibold text-[#28231F] block mb-1">Banner Announcement Text</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
            />
          </div>

          <button
            onClick={handleSaveAnnouncement}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Update Announcement</span>
          </button>
        </div>
      )}
    </div>
  );
};