# McKinsey & Company | Digital & E-Commerce Practice
## Enterprise Architecture & Technical Specification: Artisan's Corner Marketplace Modernization

**Project:** Artisan's Corner Two-Sided Craft E-Commerce Platform  
**Target Operating Model:** Multi-Vendor Curated Marketplace (Benchmark: Etsy, Farfetch, Amazon Handmade, Shopify Collective)  
**Document Type:** Senior Enterprise Software Architecture & Technical Implementation Blueprint  
**Status:** Architecture Design Document (ADD) & Implementation Specification (v2.1 Robustness & State Refactor)  
**Version:** 2.1-Enterprise  

---

## Executive Summary & Strategic Context

Artisan's Corner is executing an institutional-grade platform modernization. In luxury craft marketplaces, commercial scalability hinges on three fundamental pillars:
1. **Perceived Authenticity & Premium Merchandising**: Controlled centrally via a **SuperAdmin Command Center & Storefront CMS**.
2. **Artisan Supply Acquisition & Quality Inflow**: Streamlined via a **Frictionless, High-Conversion Onboarding Funnel** with an unconditional `"Become a Seller"` CTA in the top header.
3. **Platform Robustness & Deterministic State**: Guaranteed through **Hierarchical Error Boundaries** and **Decoupled Zustand State Management**, eliminating white-screen crashes and Context re-render thrashing.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              MARKETPLACE FLYWHEEL                                      │
│                                                                                        │
│     [ Pillar 1: Frictionless Seller Onboarding ] ───▶ High-Quality Artisan Inflow     │
│                         ▲                                       │                      │
│                         │                                       ▼                      │
│     Premium Conversion & GMV Growth ◀─── [ Pillar 2: SuperAdmin Governance & CMS ]    │
│                         │                 (Listing Moderation + Dynamic Merchandising) │
│                         ▼                                                              │
│       [ Pillar 3: Resilient Architecture (Zustand Stores + Error Boundaries) ]        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Platform Robustness: Error Boundaries & Zustand State Topology

### 1.1 Hierarchical Error Boundary Architecture

Enterprise web applications must never crash the entire viewport due to an unhandled exception in an isolated subsystem (e.g. Three.js WebGL context loss or a failed third-party data parse). We introduce a two-tier Error Boundary hierarchy:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Tier 1: Global Platform ErrorBoundary (Root Level in App.tsx)                         │
│  - Catches unhandled global runtime errors                                             │
│  - Displays branded "Studio Restorative" fallback with 1-click safe restart            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Tier 2: Feature-Level Isolated Error Boundaries                                       │
│                                                                                        │
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌──────────────────────────┐  │
│  │ 3D Studio Boundary     │  │ Admin Console Boundary │  │ Marketplace Feed Boundary│  │
│  │ - Recovers from WebGL  │  │ - Isolates complex     │  │ - Isolates catalog card  │  │
│  │   context loss or      │  │   financial charts or  │  │   render failures or     │  │
│  │   procedural texture   │  │   moderation tables    │  │   broken image pipelines │  │
│  │   generation faults    │  │   without logging user │  │                          │  │
│  └────────────────────────┘  └────────────────────────┘  └──────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Error Recovery SLA:
- **Instant Recovery**: Every fallback UI provides a `Retry Render` button and a `Reset to Marketplace` fallback button.
- **Diagnostics**: In development/admin mode, component stack traces are cleanly formatted; in production, sensitive telemetry is captured safely.

---

### 1.2 Zustand State Management Architecture

While `AppContext` manages core session authentication, high-frequency and domain-specific state is migrated to dedicated, strongly-typed **Zustand stores**:

```
                              ┌─────────────────────────┐
                              │     App Root / Main     │
                              └────────────┬────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│ useStorefrontCmsStore │       │ useListingModeration  │       │ useSellerOnboarding   │
│                       │       │ Store                 │       │ Store                 │
├───────────────────────┤       ├───────────────────────┤       ├───────────────────────┤
│ - Dynamic Hero Config │       │ - Pending review list │       │ - Current step (1-5)  │
│ - Curated Collections │       │ - Moderation actions  │       │ - Draft form data     │
│ - Section Ordering    │       │ - Audit trail history │       │ - Validation errors   │
│ - Announcement Bar    │       │ - Rejection notes     │       │ - Submission status   │
│ - Local Persistence   │       │ - Status transitions  │       │ - Auto-save buffer    │
└───────────────────────┘       └───────────────────────┘       └───────────────────────┘
```

#### Why Zustand?
1. **Zero Provider Hell**: Stores live outside React render tree, accessible directly in business logic, event handlers, and components.
2. **Fine-Grained Selectors**: Components subscribe only to exact slices (e.g. `const hero = useStorefrontCmsStore(s => s.hero)`), preventing entire page re-renders when another section is updated.
3. **Atomic Persistence**: LocalStorage persistence middleware enables instantaneous auto-save for both SuperAdmin CMS drafts and artisan onboarding multi-step forms.

---

## 2. Pillar I: SuperAdmin Governance & Merchandising CMS

### 2.1 Catalog & Listing Moderation Engine
Online marketplace standards require that product quality and authenticity are verified before publication.

- **State Transitions**:
  `draft` $\rightarrow$ `pending_review` $\rightarrow$ `approved` (published) | `changes_requested` | `rejected` | `suspended`.
- **SuperAdmin Listing Desk**:
  - Filterable by status (`pending_review`, `approved`, `changes_requested`, `rejected`).
  - One-click approval with instant push to marketplace.
  - Rejection / Changes Requested modal requiring specific feedback notes sent back to the artisan.
  - Quick 3D preview and craft provenance inspection.

### 2.2 Storefront Merchandising CMS
SuperAdmins have full visual control over buyer-facing merchandising:
- **Hero Campaign Manager**: Edit headline prefix, highlighted keyword, subheadline, and primary call-to-action button (label and destination tab).
- **Curated Collections Studio**:
  - Create, edit, and toggle curated product groupings (e.g., *"Heritage Clay & Ceramics"*, *"Sustainable Wood Studios"*, *"Master Metalsmiths"*).
  - Assign products directly to collections.
  - Display customized merchandising badges (`Staff Pick`, `Artisan of the Month`, `Heritage Guild`).
- **Section Visibility & Ordering**: Toggle and reorder homepage sections dynamically.

---

## 3. Pillar II: Universal "Become a Seller" Onboarding

### 3.1 Unconditional Top-Navigation CTA
- **Location**: Global top navigation header ([Header.tsx](file:///c:/Users/hp/Downloads/artisan%E2%80%99s-corner/src/components/common/Header.tsx)) beside main navigation controls.
- **Visibility**: Always visible to all users (visitors, guests, buyers).
- **Behavior**:
  - Unauthenticated guests: Opens the onboarding portal with a streamlined quick-auth option.
  - Authenticated buyers: Opens the multi-step onboarding wizard with prefilled name and email.
  - Pending applicants: Shows an animated `"Application Under Review"` status pill.
  - Approved sellers: Shows the quick toggle to their Artisan Studio.

### 3.2 5-Stage Progressive Onboarding Wizard
1. **Step 1: Brand & Craft Identity** (Shop name, tagline, craft discipline, heritage story).
2. **Step 2: Studio & Provenance Verification** (Workshop location, bench photo, portfolio URL).
3. **Step 3: Initial Catalog Listing** (Sample product title, materials, dimensions, price, lead time).
4. **Step 4: Financial & Banking Setup** (Bank name, account holder, routing, last 4 digits).
5. **Step 5: Code of Craft Standards & Submission** (100% authentic craft agreement, instant tracking SLA).

---

## 4. Technical Architecture: File Map & Components

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx           # Upgraded SuperAdmin Hub with CMS & Moderation tabs
│   │   ├── StorefrontCmsEditor.tsx      # CMS Hero, Sections & Collections Manager
│   │   └── ListingModerationTable.tsx   # Catalog Review & Approval Desk
│   ├── common/
│   │   ├── ErrorBoundary.tsx            # Enterprise React Error Boundary & Fallback UI
│   │   ├── Header.tsx                   # Universal "Become a Seller" top-nav CTA
│   │   └── Toast.tsx
│   ├── seller/
│   │   └── BecomeSellerModal.tsx        # 5-Stage Stepper Onboarding Wizard
│   └── buyer/
│       └── Marketplace.tsx              # Reads dynamically from useStorefrontCmsStore
├── stores/
│   ├── storefrontCmsStore.ts            # Zustand store for dynamic storefront CMS
│   ├── listingModerationStore.ts        # Zustand store for listing governance
│   └── sellerOnboardingStore.ts         # Zustand store for 5-step seller onboarding
└── types/
    └── index.ts                         # Extended schemas for CMS, Moderation, and KYC
```

---

## 5. Implementation Roadmap & Execution Sequence

1. **Step 1: Robustness Foundation**
   - Implement `src/components/common/ErrorBoundary.tsx` with customizable fallbacks.
   - Wrap `App.tsx` and subsystem routes (`ArtisanStudio3D`, `AdminDashboard`, `Marketplace`) in specialized Error Boundaries.
2. **Step 2: Zustand Stores Initialization**
   - Create `src/stores/storefrontCmsStore.ts` with initial seed collections, hero campaign, and section ordering.
   - Create `src/stores/listingModerationStore.ts` initialized with existing products and audit trail actions.
   - Create `src/stores/sellerOnboardingStore.ts` with multi-step wizard state management.
3. **Step 3: Top Navigation "Become a Seller" Restructuring**
   - Refactor `Header.tsx` to display the prominent, unconditional `"Become a Seller"` CTA for all visitors.
4. **Step 4: Professional 5-Step Onboarding Funnel**
   - Refactor `BecomeSellerModal.tsx` into a guided 5-step stepper wired directly to `useSellerOnboardingStore`.
5. **Step 5: SuperAdmin Command Center & Merchandising CMS**
   - Enhance `AdminDashboard.tsx` with dedicated tabs for:
     a) **Storefront CMS & Merchandising** (Hero Editor, Curated Collections Manager, Section Toggles).
     b) **Catalog Moderation Desk** (Listing queue, Approve/Reject modals with feedback).
6. **Step 6: Buyer Marketplace Dynamic Binding**
   - Connect `Marketplace.tsx` to read the Hero Campaign and Curated Collections directly from `useStorefrontCmsStore`.
7. **Step 7: Verification & Testing**
   - Validate error boundaries, test admin mutations, verify reactive updates on the homepage, and confirm responsive layouts.

---

*Authored by:*  
**Senior Digital & E-Commerce Software Architect**  
McKinsey & Company | Digital Practice
