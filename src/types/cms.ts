import { CraftModelType } from './index';

// ============================================================================
// 1. STOREFRONT MERCHANDISING & CMS TYPES
// ============================================================================

export interface HeroCampaignConfig {
  headlinePrefix: string;      // e.g. "Hand-touched by the"
  highlightedWord: string;     // e.g. "earth"
  headlineSuffix: string;      // e.g. "crafted for life"
  subheadline: string;
  ctaPrimaryText: string;
  ctaPrimaryTarget: string;    // Tab or category target
  ctaSecondaryText: string;
  ctaSecondaryTarget: string;
  featuredProductIds: string[];
  bannerBadgeText: string;     // e.g. "Curated Autumn 2026 Edition"
  isActive: boolean;
}

export interface CuratedCollection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;              // e.g. "Heritage Series", "Eco-Certified", "Staff Pick"
  coverImageUrl: string;
  productIds: string[];        // Explicitly curated product IDs
  categoryFilter?: string;
  displayOrder: number;
  isPublished: boolean;
  featuredOnHome: boolean;
}

export interface StorefrontSectionConfig {
  id: string;
  type: 
    | 'hero-banner'
    | 'curated-collections'
    | 'category-grid'
    | 'featured-artisans'
    | 'studio-3d-teaser'
    | 'trending-products'
    | 'craft-values';
  title: string;
  subtitle?: string;
  isEnabled: boolean;
  order: number;
}

export interface StorefrontCMSConfig {
  hero: HeroCampaignConfig;
  sections: StorefrontSectionConfig[];
  collections: CuratedCollection[];
  featuredArtisanIds: string[];
  announcementBar: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
  };
}

// ============================================================================
// 2. PRODUCT LISTING MODERATION & GOVERNANCE TYPES
// ============================================================================

export type ListingModerationStatus = 
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'changes_requested'
  | 'rejected'
  | 'suspended';

export interface ListingAuditEntry {
  id: string;
  moderatorId: string;
  moderatorName: string;
  action: 'approve' | 'request_changes' | 'reject' | 'suspend' | 'restore';
  feedbackNotes?: string;
  timestamp: string;
}

// ============================================================================
// 3. ENHANCED ARTISAN ONBOARDING TYPES
// ============================================================================

export type ArtisanTier = 'artisan-apprentice' | 'master-artisan' | 'heritage-guild';

export interface ArtisanKYCVerification {
  workshopProofUrl?: string;
  identityVerified: boolean;
  craftPledgeSigned: boolean;
  taxIdOrVatProvided: boolean;
  verifiedAt?: string;
}

export interface ExtendedSellerApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  shopName: string;
  tagline: string;
  bio: string;
  craftCategory: string;
  location: string;
  phone: string;
  portfolioUrl?: string;
  workshopAddress?: string;
  workshopPhotoUrl?: string;
  initialProductSample?: {
    title: string;
    price: number;
    category: string;
    description: string;
    materials: string[];
    imageUrl: string;
  };
  bankDetails: {
    bankName: string;
    accountHolder: string;
    routingNumber: string;
    accountNumberLast4: string;
  };
  kyc: ArtisanKYCVerification;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  adminNotes?: string;
  assignedTier?: ArtisanTier;
  commissionRateOverride?: number;
}