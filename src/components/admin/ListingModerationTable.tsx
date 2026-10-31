import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useListingModerationStore } from '../../stores/listingModerationStore';
import { Product, ListingModerationStatus } from '../../types';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Search,
  Layers,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Filter,
  Eye,
  RotateCcw
} from 'lucide-react';

export const ListingModerationTable: React.FC = () => {
  const { products, currentUser, open3DStudioWithModel, setSelectedProduct, showToast } = useApp();
  const {
    getListingStatus,
    getListingNotes,
    getAuditTrail,
    approveListing,
    requestChanges,
    rejectListing,
    suspendListing
  } = useListingModerationStore();

  const [statusFilter, setStatusFilter] = useState<'all' | ListingModerationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForFeedback, setSelectedProductForFeedback] = useState<Product | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [actionType, setActionType] = useState<'changes' | 'reject'>('changes');

  const moderatorName = currentUser?.name || 'Platform SuperAdmin';

  const filteredProducts = products.filter((prod) => {
    const currentStatus = getListingStatus(prod.id);
    if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchSeller = prod.sellerName.toLowerCase().includes(q);
      const matchCategory = prod.category.toLowerCase().includes(q);
      return matchTitle || matchSeller || matchCategory;
    }
    return true;
  });

  const getStatusBadge = (status: ListingModerationStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EFF3EB] text-[#6B7A52] border border-[#D9E3D3]">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertCircle className="w-3 h-3" />
            Changes Requested
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <AlertCircle className="w-3 h-3" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
            Draft
          </span>
        );
    }
  };

  const handleOpenFeedback = (prod: Product, type: 'changes' | 'reject') => {
    setSelectedProductForFeedback(prod);
    setActionType(type);
    setFeedbackText(
      type === 'changes'
        ? 'Please clarify workshop material sourcing and provide higher-resolution studio images.'
        : 'Artifact does not meet our 100% authentic handcraft standard.'
    );
  };

  const handleSubmitFeedback = () => {
    if (!selectedProductForFeedback) return;
    if (!feedbackText.trim()) {
      showToast('Please enter feedback notes for the artisan.', 'error');
      return;
    }

    if (actionType === 'changes') {
      requestChanges(selectedProductForFeedback.id, feedbackText.trim(), moderatorName);
      showToast(`Revision request dispatched to ${selectedProductForFeedback.sellerName}.`, 'warning');
    } else {
      rejectListing(selectedProductForFeedback.id, feedbackText.trim(), moderatorName);
      showToast(`Listing "${selectedProductForFeedback.title}" rejected.`, 'error');
    }

    setSelectedProductForFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8]">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `All (${products.length})` },
            { id: 'pending_review', label: 'Pending Review' },
            { id: 'approved', label: 'Approved & Live' },
            { id: 'changes_requested', label: 'Changes Requested' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'suspended', label: 'Suspended' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === item.id
                  ? 'bg-[#28231F] text-white shadow-xs'
                  : 'bg-[#FFFCF7] text-[#645D56] hover:text-[#28231F] border border-[#E8DEC8]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7E72]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artifacts, artisans..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
          />
        </div>
      </div>

      {/* Product Cards Table */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#FFFCF7] border border-[#E8DEC8]">
            <ShieldCheck className="w-12 h-12 text-[#6B7A52] mx-auto mb-3 opacity-60" />
            <h4 className="font-serif text-lg font-bold text-[#28231F]">No Artifacts in this Category</h4>
            <p className="text-xs text-[#645D56] mt-1">All current catalog listings are processed.</p>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const status = getListingStatus(prod.id);
            const notes = getListingNotes(prod.id);
            const auditTrail = getAuditTrail(prod.id);

            return (
              <div
                key={prod.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#FFFCF7] border border-[#E8DEC8] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#A86F47]/50 transition-all"
              >
                {/* Left: Thumbnail & Core Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={prod.images[0] || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=300&q=80'}
                    alt={prod.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#DDD1BE] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(status)}
                      <span className="text-[11px] font-semibold text-[#8A7E72] bg-[#F4EEE6] px-2 py-0.5 rounded-md">
                        {prod.category}
                      </span>
                    </div>

                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#28231F] leading-tight">
                      {prod.title}
                    </h4>

                    <p className="text-xs text-[#645D56]">
                      Artisan: <strong className="text-[#28231F]">{prod.sellerName}</strong> ({prod.sellerLocation})
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#645D56] pt-1">
                      <span className="font-bold text-[#A86F47] text-sm">${prod.price}</span>
                      <span>Stock: <strong>{prod.stock}</strong></span>
                      <span>Materials: <strong>{prod.materials.slice(0, 2).join(', ')}</strong></span>
                      {prod.model3dType && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B7A52]">
                          <Sparkles className="w-3 h-3" /> 3D Model Attached
                        </span>
                      )}
                    </div>

                    {notes && (
                      <div className="mt-2 p-2 rounded-xl bg-[#FAF6F0] border border-[#E8DEC8] text-[11px] text-[#A86F47]">
                        <strong>Latest Note:</strong> {notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Moderation Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:self-center shrink-0">
                  {prod.model3dType && (
                    <button
                      onClick={() => open3DStudioWithModel(prod.model3dType!)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F6EDE6] hover:bg-[#EFE7DC] text-[#A86F47] text-xs font-semibold transition-colors cursor-pointer"
                      title="Inspect in 3D Kiln Studio"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>3D View</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedProduct(prod)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F4EEE6] hover:bg-[#EAE0D2] text-[#28231F] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  {status !== 'approved' && (
                    <button
                      onClick={() => {
                        approveListing(prod.id, moderatorName, 'Verified compliant with gallery standard.');
                        showToast(`Listing "${prod.title}" approved & live!`, 'success');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6B7A52] hover:bg-[#586543] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {status !== 'changes_requested' && (
                    <button
                      onClick={() => handleOpenFeedback(prod, 'changes')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>
                  )}

                  {status !== 'rejected' && (
                    <button
                      onClick={() => handleOpenFeedback(prod, 'reject')}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Feedback / Rejection Modal */}
      {selectedProductForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#FFFCF7] border border-[#E8DEC8] shadow-2xl space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#28231F]">
              {actionType === 'changes' ? 'Request Artisan Modifications' : 'Reject Artifact Listing'}
            </h4>
            <p className="text-xs text-[#645D56]">
              Artifact: <strong>"{selectedProductForFeedback.title}"</strong> by {selectedProductForFeedback.sellerName}
            </p>

            <div>
              <label className="text-xs font-semibold text-[#28231F] block mb-1">
                Moderation Notes & Required Actions *
              </label>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProductForFeedback(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#645D56] bg-[#F4EEE6] hover:bg-[#EAE0D2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFeedback}
                className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs ${
                  actionType === 'changes' ? 'bg-[#A86F47] hover:bg-[#8F5732]' : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                {actionType === 'changes' ? 'Send Revision Request' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};