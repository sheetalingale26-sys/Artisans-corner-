import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StorefrontCMSConfig, CuratedCollection, HeroCampaignConfig, StorefrontSectionConfig } from '../types';

interface StorefrontCmsState extends StorefrontCMSConfig {
  // Hero Actions
  updateHero: (updates: Partial<HeroCampaignConfig>) => void;
  
  // Collections Actions
  addCollection: (collection: Omit<CuratedCollection, 'id'>) => CuratedCollection;
  updateCollection: (id: string, updates: Partial<CuratedCollection>) => void;
  deleteCollection: (id: string) => void;
  toggleCollectionHome: (id: string) => void;
  
  // Section Ordering & Visibility Actions
  toggleSectionEnabled: (sectionId: string) => void;
  reorderSections: (newSections: StorefrontSectionConfig[]) => void;
  
  // Announcement Bar
  updateAnnouncementBar: (enabled: boolean, text: string, linkUrl?: string) => void;
  
  // Featured Artisans
  setFeaturedArtisans: (artisanIds: string[]) => void;
  
  // Reset
  resetToDefaults: () => void;
}

const DEFAULT_HERO: HeroCampaignConfig = {
  headlinePrefix: 'Hand-touched',
  highlightedWord: 'earth',
  headlineSuffix: 'crafted for generations',
  subheadline: 'Traceable, one-of-a-kind artifacts sourced directly from independent master ceramicists, woodworkers, and jewelers.',
  ctaPrimaryText: 'Explore Artifacts',
  ctaPrimaryTarget: 'marketplace',
  ctaSecondaryText: 'Inspect 3D Kiln',
  ctaSecondaryTarget: 'studio',
  featuredProductIds: ['p1', 'p2', 'p3'],
  bannerBadgeText: 'Autumn 2026 Curated Selection',
  isActive: true,
};

const DEFAULT_SECTIONS: StorefrontSectionConfig[] = [
  { id: 'sec-hero', type: 'hero-banner', title: 'Editorial Hero Showcase', isEnabled: true, order: 1 },
  { id: 'sec-collections', type: 'curated-collections', title: 'Curated Artisan Collections', subtitle: 'Handpicked themes from distinguished ateliers', isEnabled: true, order: 2 },
  { id: 'sec-categories', type: 'category-grid', title: 'Material Taxonomy & Disciplines', isEnabled: true, order: 3 },
  { id: 'sec-trending', type: 'trending-products', title: 'Treasured Masterpieces', subtitle: 'Crafted in limited quantities', isEnabled: true, order: 4 },
  { id: 'sec-studio', type: 'studio-3d-teaser', title: 'Interactive 3D Craft Kiln', isEnabled: true, order: 5 },
  { id: 'sec-artisans', type: 'featured-artisans', title: 'Master Artisan Spotlights', isEnabled: true, order: 6 },
  { id: 'sec-values', type: 'craft-values', title: 'Provenance & Craft Pledge', isEnabled: true, order: 7 },
];

const DEFAULT_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'col-ceramics',
    slug: 'heritage-ceramics',
    title: 'Heritage Clay & Kiln Ceramics',
    subtitle: 'Wheel-thrown stoneware and wood-fired terracotta with organic earthy slips.',
    description: 'Ancient firing techniques meeting contemporary tabletop aesthetics.',
    badge: 'Curator Choice',
    coverImageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
    productIds: ['p1', 'p3'],
    categoryFilter: 'Ceramics & Pottery',
    displayOrder: 1,
    isPublished: true,
    featuredOnHome: true,
  },
  {
    id: 'col-woodcraft',
    slug: 'sustainable-woodcraft',
    title: 'Sustainably Foraged Hardwoods',
    subtitle: 'Hand-carved walnut, olive wood, and reclaimed teak with beeswax finishes.',
    description: 'Sculpted from fallen trees and sustainably managed timber estates.',
    badge: 'Eco-Certified',
    coverImageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    productIds: ['p2', 'p5'],
    categoryFilter: 'Woodwork & Carving',
    displayOrder: 2,
    isPublished: true,
    featuredOnHome: true,
  },
  {
    id: 'col-brass',
    slug: 'heirloom-metals',
    title: 'Heirloom Metalsmithing & Brass',
    subtitle: 'Sand-cast and hammer-textured brass, copper, and sterling silver adornments.',
    description: 'Every hammered facet reflects raw metal craft precision.',
    badge: 'Master Guild',
    coverImageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    productIds: ['p4'],
    categoryFilter: 'Jewelry & Metals',
    displayOrder: 3,
    isPublished: true,
    featuredOnHome: true,
  },
];

export const useStorefrontCmsStore = create<StorefrontCmsState>()(
  persist(
    (set, get) => ({
      hero: DEFAULT_HERO,
      sections: DEFAULT_SECTIONS,
      collections: DEFAULT_COLLECTIONS,
      featuredArtisanIds: ['artisan-1', 'artisan-2'],
      announcementBar: {
        enabled: true,
        text: 'Handcrafted Heritage: 5% platform pledge invested directly into artisan apprenticeships worldwide.',
        linkUrl: '#pledge',
      },

      updateHero: (updates) =>
        set((state) => ({
          hero: { ...state.hero, ...updates },
        })),

      addCollection: (colData) => {
        const newCol: CuratedCollection = {
          ...colData,
          id: `col-${Date.now()}`,
        };
        set((state) => ({
          collections: [...state.collections, newCol],
        }));
        return newCol;
      },

      updateCollection: (id, updates) =>
        set((state) => ({
          collections: state.collections.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),

      toggleCollectionHome: (id) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, featuredOnHome: !c.featuredOnHome } : c
          ),
        })),

      toggleSectionEnabled: (sectionId) =>
        set((state) => ({
          sections: state.sections.map((s) =>
            s.id === sectionId ? { ...s, isEnabled: !s.isEnabled } : s
          ),
        })),

      reorderSections: (newSections) =>
        set(() => ({
          sections: newSections,
        })),

      updateAnnouncementBar: (enabled, text, linkUrl) =>
        set(() => ({
          announcementBar: { enabled, text, linkUrl },
        })),

      setFeaturedArtisans: (artisanIds) =>
        set(() => ({
          featuredArtisanIds: artisanIds,
        })),

      resetToDefaults: () =>
        set(() => ({
          hero: DEFAULT_HERO,
          sections: DEFAULT_SECTIONS,
          collections: DEFAULT_COLLECTIONS,
          announcementBar: {
            enabled: true,
            text: 'Handcrafted Heritage: 5% platform pledge invested directly into artisan apprenticeships worldwide.',
          },
        })),
    }),
    {
      name: 'artisans-corner-storefront-cms',
    }
  )
);