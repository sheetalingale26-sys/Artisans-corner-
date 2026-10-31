import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ListingModerationStatus, ListingAuditEntry } from '../types';

export interface ProductModerationRecord {
  productId: string;
  status: ListingModerationStatus;
  moderationNotes?: string;
  auditTrail: ListingAuditEntry[];
  lastUpdated: string;
}

interface ListingModerationState {
  records: Record<string, ProductModerationRecord>;
  
  // Status check helper
  getListingStatus: (productId: string) => ListingModerationStatus;
  getListingNotes: (productId: string) => string | undefined;
  getAuditTrail: (productId: string) => ListingAuditEntry[];
  
  // Actions
  submitForReview: (productId: string) => void;
  approveListing: (productId: string, moderatorName: string, notes?: string) => void;
  requestChanges: (productId: string, feedback: string, moderatorName: string) => void;
  rejectListing: (productId: string, reason: string, moderatorName: string) => void;
  suspendListing: (productId: string, reason: string, moderatorName: string) => void;
  batchApprove: (productIds: string[], moderatorName: string) => void;
}

// Initial seed statuses: existing catalog products are approved by default
const INITIAL_RECORDS: Record<string, ProductModerationRecord> = {
  p1: {
    productId: 'p1',
    status: 'approved',
    lastUpdated: '2026-10-20',
    auditTrail: [
      {
        id: 'aud-1',
        moderatorId: 'admin-1',
        moderatorName: 'Marcus Vance',
        action: 'approve',
        feedbackNotes: 'Wheel-thrown authenticity verified. Meets gallery standard.',
        timestamp: '2026-10-20 14:30',
      },
    ],
  },
  p2: {
    productId: 'p2',
    status: 'approved',
    lastUpdated: '2026-10-21',
    auditTrail: [
      {
        id: 'aud-2',
        moderatorId: 'admin-1',
        moderatorName: 'Marcus Vance',
        action: 'approve',
        feedbackNotes: 'Fallen walnut origin documented. Natural beeswax finish approved.',
        timestamp: '2026-10-21 09:15',
      },
    ],
  },
  p3: {
    productId: 'p3',
    status: 'approved',
    lastUpdated: '2026-10-22',
    auditTrail: [],
  },
  p4: {
    productId: 'p4',
    status: 'approved',
    lastUpdated: '2026-10-23',
    auditTrail: [],
  },
  p5: {
    productId: 'p5',
    status: 'approved',
    lastUpdated: '2026-10-24',
    auditTrail: [],
  },
};

export const useListingModerationStore = create<ListingModerationState>()(
  persist(
    (set, get) => ({
      records: INITIAL_RECORDS,

      getListingStatus: (productId: string) => {
        return get().records[productId]?.status || 'approved';
      },

      getListingNotes: (productId: string) => {
        return get().records[productId]?.moderationNotes;
      },

      getAuditTrail: (productId: string) => {
        return get().records[productId]?.auditTrail || [];
      },

      submitForReview: (productId: string) => {
        const now = new Date().toISOString();
        set((state) => {
          const prev = state.records[productId] || {
            productId,
            status: 'draft',
            auditTrail: [],
            lastUpdated: now,
          };
          return {
            records: {
              ...state.records,
              [productId]: {
                ...prev,
                status: 'pending_review',
                lastUpdated: now,
              },
            },
          };
        });
      },

      approveListing: (productId, moderatorName, notes) => {
        const now = new Date().toISOString();
        const auditEntry: ListingAuditEntry = {
          id: `aud-${Date.now()}`,
          moderatorId: 'admin-current',
          moderatorName,
          action: 'approve',
          feedbackNotes: notes || 'Listing verified and approved for global marketplace distribution.',
          timestamp: new Date().toLocaleString(),
        };

        set((state) => {
          const prev = state.records[productId] || {
            productId,
            status: 'pending_review',
            auditTrail: [],
            lastUpdated: now,
          };
          return {
            records: {
              ...state.records,
              [productId]: {
                ...prev,
                status: 'approved',
                moderationNotes: notes || 'Approved',
                auditTrail: [auditEntry, ...prev.auditTrail],
                lastUpdated: now,
              },
            },
          };
        });
      },

      requestChanges: (productId, feedback, moderatorName) => {
        const now = new Date().toISOString();
        const auditEntry: ListingAuditEntry = {
          id: `aud-${Date.now()}`,
          moderatorId: 'admin-current',
          moderatorName,
          action: 'request_changes',
          feedbackNotes: feedback,
          timestamp: new Date().toLocaleString(),
        };

        set((state) => {
          const prev = state.records[productId] || {
            productId,
            status: 'pending_review',
            auditTrail: [],
            lastUpdated: now,
          };
          return {
            records: {
              ...state.records,
              [productId]: {
                ...prev,
                status: 'changes_requested',
                moderationNotes: feedback,
                auditTrail: [auditEntry, ...prev.auditTrail],
                lastUpdated: now,
              },
            },
          };
        });
      },

      rejectListing: (productId, reason, moderatorName) => {
        const now = new Date().toISOString();
        const auditEntry: ListingAuditEntry = {
          id: `aud-${Date.now()}`,
          moderatorId: 'admin-current',
          moderatorName,
          action: 'reject',
          feedbackNotes: reason,
          timestamp: new Date().toLocaleString(),
        };

        set((state) => {
          const prev = state.records[productId] || {
            productId,
            status: 'pending_review',
            auditTrail: [],
            lastUpdated: now,
          };
          return {
            records: {
              ...state.records,
              [productId]: {
                ...prev,
                status: 'rejected',
                moderationNotes: reason,
                auditTrail: [auditEntry, ...prev.auditTrail],
                lastUpdated: now,
              },
            },
          };
        });
      },

      suspendListing: (productId, reason, moderatorName) => {
        const now = new Date().toISOString();
        const auditEntry: ListingAuditEntry = {
          id: `aud-${Date.now()}`,
          moderatorId: 'admin-current',
          moderatorName,
          action: 'suspend',
          feedbackNotes: reason,
          timestamp: new Date().toLocaleString(),
        };

        set((state) => {
          const prev = state.records[productId] || {
            productId,
            status: 'approved',
            auditTrail: [],
            lastUpdated: now,
          };
          return {
            records: {
              ...state.records,
              [productId]: {
                ...prev,
                status: 'suspended',
                moderationNotes: reason,
                auditTrail: [auditEntry, ...prev.auditTrail],
                lastUpdated: now,
              },
            },
          };
        });
      },

      batchApprove: (productIds, moderatorName) => {
        productIds.forEach((id) => get().approveListing(id, moderatorName, 'Batch approved during catalog audit.'));
      },
    }),
    {
      name: 'artisans-corner-listing-moderation',
    }
  )
);