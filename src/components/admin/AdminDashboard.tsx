import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Order, Product, SellerProfile, Payout, OrderStatus, SellerApplication } from '../../types';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Store,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  Lock,
  Unlock,
  Eye,
  Clock,
  ShieldAlert,
  ArrowRight,
  Phone,
  MapPin,
  Building2,
  Mail,
  X,
  CreditCard,
  FileText,
  Calendar,
  Globe,
  Award,
  Maximize2,
  Tag,
  ImageIcon
} from 'lucide-react';
import { StorefrontCmsEditor } from './StorefrontCmsEditor';
import { ListingModerationTable } from './ListingModerationTable';
import { getCategoryWorkshopDefault, getCategorySampleDefault } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    users,
    toggleUserStatus,
    sellers,
    updateSellerVerification,
    sellerApplications,
    approveSellerApplication,
    rejectSellerApplication,
    products,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    commissions,
    payouts,
    processPayout,
    open3DStudioWithModel,
    setSelectedProduct,
    setActiveTab: setGlobalActiveTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'cms' | 'moderation' | 'commissions' | 'applications' | 'sellers' | 'products' | 'orders' | 'users'
  >('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [applicationFilter, setApplicationFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedAppModal, setSelectedAppModal] = useState<SellerApplication | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [appToReject, setAppToReject] = useState<SellerApplication | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState<string>('');

  // Role Protection check: Only authorized admins
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-[#F4EEE6]">
        <div className="max-w-md w-full p-8 bg-[#FFFCF7] rounded-3xl border border-[#E4D9C4] shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-700 mx-auto flex items-center justify-center mb-4 border border-red-200 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#28231F]">
            Admin Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-[#645D56] mt-2 mb-6 leading-relaxed">
            The Executive Platform Governance Center and 5% Financial Ledger are reserved strictly for authorized platform administrators.
          </p>
          <div className="p-3.5 bg-[#F6EDE6] border border-[#E8DEC8] rounded-2xl text-[11px] text-[#A86F47] mb-6 text-left">
            <strong>Security Notice:</strong> Administrator credentials cannot be registered publicly. If you are a platform director, sign in using your designated administrative account.
          </div>
          <button
            onClick={() => setGlobalActiveTab('marketplace')}
            className="w-full py-3 px-4 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Platform Financial Metrics
  const totalGMV = orders.reduce((sum, ord) => sum + ord.subtotal, 0) + 19605; // Base historical + live
  const totalPlatformCommissions = Number((totalGMV * 0.05).toFixed(2));
  const totalArtisanDisbursed = Number((totalGMV - totalPlatformCommissions).toFixed(2));
  const totalOrdersCount = orders.length + 142;
  const verifiedSellersCount = sellers.filter((s) => s.verificationStatus === 'verified').length;
  const pendingPayouts = payouts.filter((p) => p.status === 'pending');
  const pendingApplications = sellerApplications.filter((a) => a.status === 'pending');

  const filteredApplications = sellerApplications.filter((app) => {
    if (applicationFilter === 'all') return true;
    return app.status === applicationFilter;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Executive Header */}
        <div className="bg-[#28231F] text-[#FAF4ED] rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-[#443B34]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D8A45F] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#8A9A6E]" />
                <span>Executive Platform Governance & 5% Ledger</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">Platform Admin Center</h1>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                Oversee platform volume, review artisan applications, audit the automated 5% commission ledger, and disburse payouts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-[#373029] border border-[#4A3F36] text-xs font-semibold text-[#8A9A6E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8A9A6E]" />
                Automated 5% Fee Engine Online
              </span>
            </div>
          </div>

          {/* Key Executive KPIs */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-[#443B34]">
            <div className="bg-[#373029] p-4 rounded-2xl border border-[#4A3F36]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Gross Platform GMV
              </span>
              <div className="text-2xl font-bold text-white">
                ${totalGMV.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                {totalOrdersCount} lifetime orders
              </span>
            </div>

            <div className="bg-[#373029] p-4 rounded-2xl border border-[#4A3F36]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D8A45F] block mb-1">
                5% Platform Fee Revenue
              </span>
              <div className="text-2xl font-bold text-[#D8A45F]">
                ${totalPlatformCommissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Operations & payment rails
              </span>
            </div>

            <div className="bg-[#373029] p-4 rounded-2xl border border-[#4A3F36]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A9A6E] block mb-1">
                Net Artisan Disbursed (95%)
              </span>
              <div className="text-2xl font-bold text-[#8A9A6E]">
                ${totalArtisanDisbursed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Direct to living makers
              </span>
            </div>

            <div className="bg-[#373029] p-4 rounded-2xl border border-[#4A3F36]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                Artisan Applications
              </span>
              <div className="text-2xl font-bold text-white">
                {pendingApplications.length} Pending
              </div>
              <span className="text-[11px] text-[#D8A45F] mt-1 block font-medium">
                {sellers.length} Guilds Active
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#E4D9C4] mb-8 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          {[
            { id: 'analytics', label: 'Platform Analytics' },
            { id: 'cms', label: 'Storefront CMS & Merchandising' },
            { id: 'moderation', label: `Catalog Moderation (${products.length})` },
            { id: 'applications', label: `Artisan Applications (${pendingApplications.length})` },
            { id: 'commissions', label: `5% Commission Ledger (${commissions.length})` },
            { id: 'sellers', label: `Artisans & Guilds (${sellers.length})` },
            { id: 'products', label: `Raw Inventory (${products.length})` },
            { id: 'orders', label: `All Orders (${orders.length})` },
            { id: 'users', label: `Users & Roles (${users.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer relative ${
                activeTab === tab.id
                  ? 'border-[#6B7A52] text-[#6B7A52]'
                  : 'border-transparent text-[#645D56] hover:text-[#2A2521]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'applications' && pendingApplications.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-[#A86F47] text-white rounded-full">
                  {pendingApplications.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Platform Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category Volume Breakdown */}
              <div className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-6 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#2A2521] mb-1">
                  Sales Volume by Craft Discipline
                </h3>
                <p className="text-xs text-[#645D56] mb-6">
                  GMV and 5% fee generation across studio specialties.
                </p>

                <div className="space-y-4 text-xs">
                  {[
                    { discipline: 'Ceramics & Pottery', volume: 8940, pct: 45, color: '#A86F47' },
                    { discipline: 'Woodwork & Carving', volume: 6200, pct: 31, color: '#6D472B' },
                    { discipline: 'Jewelry & Metals', volume: 4465, pct: 24, color: '#D8A45F' }
                  ].map((cat, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between font-semibold text-[#2A2521]">
                        <span>{cat.discipline}</span>
                        <span>${cat.volume.toLocaleString()} ({cat.pct}%)</span>
                      </div>
                      <div className="w-full bg-[#E4D9C4] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>5% Platform Cut: ${(cat.volume * 0.05).toFixed(2)}</span>
                        <span>Artisan Net: ${(cat.volume * 0.95).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Artisans Guilds */}
              <div className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-6 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#2A2521] mb-1">
                  Top Grossing Artisan Guilds
                </h3>
                <p className="text-xs text-[#645D56] mb-6">
                  Highest volume independent studios on the platform.
                </p>

                <div className="space-y-4">
                  {sellers.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#E4D9C4]"
                    >
                      <div className="flex items-center gap-3">
                        <img src={s.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="text-xs font-bold text-[#2A2521]">{s.shopName}</div>
                          <div className="text-[11px] text-[#A86F47]">{s.craftCategory} • {s.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-[#2A2521]">
                          ${s.grossRevenue.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#6B7A52] font-semibold">
                          Artisan Net: ${(s.netEarnings).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Payout Approvals */}
            <div className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-6 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2A2521]">
                    Pending Artisan Disbursements ({pendingPayouts.length})
                  </h3>
                  <p className="text-xs text-[#645D56]">Verify bank routing and execute payout authorizations.</p>
                </div>
              </div>

              {pendingPayouts.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500 bg-white rounded-2xl border border-[#E4D9C4]">
                  All artisan payout requests have been reviewed and disbursed.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPayouts.map((pay) => (
                    <div
                      key={pay.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-[#E4D9C4] gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#2A2521]">{pay.shopName}</div>
                        <div className="text-gray-500">
                          Requested: <strong>${pay.amount.toFixed(2)}</strong> via {pay.method} (•••• {pay.accountEnding}) on {pay.requestDate}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{pay.notes}</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => processPayout(pay.id, false)}
                          className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-semibold cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => processPayout(pay.id, true)}
                          className="px-4 py-1.5 bg-[#6B7A52] hover:bg-[#556241] text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                        >
                          Approve & Disburse
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Storefront CMS & Merchandising Engine */}
        {activeTab === 'cms' && <StorefrontCmsEditor />}

        {/* TAB: Catalog Moderation Desk */}
        {activeTab === 'moderation' && <ListingModerationTable />}

        {/* TAB 2: Artisan Applications Review (NEW REQUIREMENT) */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#28231F]">
                  Artisan Seller Applications & Curation
                </h3>
                <p className="text-xs text-[#645D56]">
                  Review prospective makers. Once approved, the user gains instant Seller Studio capabilities and can manage their shop.
                </p>
              </div>

              <div className="flex gap-1.5 p-1 bg-[#EFE7DC] rounded-xl text-xs font-medium">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setApplicationFilter(filter)}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                      applicationFilter === filter
                        ? 'bg-white text-[#28231F] font-bold shadow-xs'
                        : 'text-[#645D56] hover:text-[#28231F]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-12 bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-8 text-xs text-[#645D56]">
                <Store className="w-10 h-10 text-[#8A7E72] mx-auto mb-2 opacity-50" />
                No applications matching "{applicationFilter}".
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppModal(app)}
                    className="p-5 sm:p-6 bg-[#FFFCF7] hover:bg-[#FAF6F0] rounded-3xl border border-[#E4D9C4] hover:border-[#A86F47]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group relative"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Applicant details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={
                              app.userAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                            }
                            alt={app.userName}
                            className="w-11 h-11 rounded-2xl object-cover border border-[#E4D9C4] shadow-xs shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-serif text-lg sm:text-xl font-bold text-[#28231F] group-hover:text-[#A86F47] transition-colors flex items-center gap-2">
                                {app.shopName}
                                <span className="text-[11px] font-sans font-normal text-[#8A7E72] group-hover:text-[#A86F47] flex items-center gap-0.5">
                                  <Eye className="w-3.5 h-3.5" />
                                  Review Full Dossier
                                </span>
                              </h4>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  app.status === 'approved'
                                    ? 'bg-[#EFF3EB] text-[#6B7A52] border border-[#D9E3D3]'
                                    : app.status === 'pending'
                                    ? 'bg-[#F6EDE6] text-[#A86F47] border border-[#E8DEC8]'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                              >
                                {app.status}
                              </span>
                              <span className="text-xs text-[#8A7E72]">
                                Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-[#A86F47] italic mt-0.5">
                              "{app.tagline}"
                            </p>
                          </div>
                        </div>

                        {/* Visual Verification Strip on Card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF6F0] border border-[#EFE7DC]">
                            <img
                              src={app.workshopPhotoUrl || getCategoryWorkshopDefault(app.craftCategory)}
                              alt="Workshop Proof"
                              className="w-12 h-12 rounded-lg object-cover border border-[#E8DEC8] shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E72] block">
                                Studio Workshop Proof
                              </span>
                              <span className="text-xs font-semibold text-[#28231F] truncate block">
                                {app.workshopAddress || `${app.location} Workshop`}
                              </span>
                              <span className="text-[10px] text-[#6B7A52] block">
                                {app.yearsOfExperience || '3-5 years'} experience
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF6F0] border border-[#EFE7DC]">
                            <img
                              src={app.sampleImageUrl || getCategorySampleDefault(app.craftCategory)}
                              alt="Sample Artifact Proof"
                              className="w-12 h-12 rounded-lg object-cover border border-[#E8DEC8] shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86F47] block flex items-center justify-between">
                                <span>Flagship Artifact</span>
                                <span className="text-[#6B7A52] font-semibold">${app.samplePrice || 95}</span>
                              </span>
                              <span className="text-xs font-semibold text-[#28231F] truncate block">
                                {app.sampleTitle || `${app.craftCategory} Artifact`}
                              </span>
                              <span className="text-[10px] text-[#8A7E72] truncate block">
                                {app.sampleMaterials || 'Handcrafted Studio Materials'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#4A423B] leading-relaxed bg-[#FAF6F0] group-hover:bg-[#FFF] p-3 rounded-2xl border border-[#EFE7DC] transition-colors">
                          {app.bio}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                          <div className="flex items-center gap-1.5 text-[#645D56]">
                            <Store className="w-4 h-4 text-[#A86F47] shrink-0" />
                            <span><strong>Craft:</strong> {app.craftCategory}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#645D56]">
                            <MapPin className="w-4 h-4 text-[#6B7A52] shrink-0" />
                            <span><strong>Location:</strong> {app.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#645D56]">
                            <Users className="w-4 h-4 text-[#8A7E72] shrink-0" />
                            <span><strong>Applicant:</strong> {app.userName} ({app.userEmail})</span>
                          </div>
                        </div>

                        {/* Bank verification preview */}
                        <div className="p-3 bg-[#F8F4EE] rounded-2xl border border-[#E4D9C4] text-[11px] text-[#645D56] flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-1 text-[#28231F] font-semibold">
                            <Building2 className="w-3.5 h-3.5 text-[#6B7A52]" />
                            <span>Bank: {app.bankDetails.bankName}</span>
                          </div>
                          <div>Holder: <strong>{app.bankDetails.accountHolder}</strong></div>
                          <div>Routing: <span className="font-medium text-[#2A2521]">{app.bankDetails.routingNumber}</span></div>
                          <div>Account ending: <span className="font-medium text-[#2A2521]">•••• {app.bankDetails.accountNumberLast4}</span></div>
                        </div>

                        {/* Rejection notice on card if rejected */}
                        {app.status === 'rejected' && (
                          <div className="p-3 bg-red-50/80 rounded-2xl border border-red-200 text-xs text-red-800 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-red-700">
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span>Application Rejected</span>
                            </div>
                            {app.adminNotes && (
                              <p className="text-[11px] text-red-700 leading-relaxed">
                                <strong>Reason provided:</strong> {app.adminNotes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div
                        className="flex sm:flex-col gap-2 shrink-0 justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {app.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => approveSellerApplication(app.id)}
                              className="px-4 py-2.5 rounded-xl bg-[#6B7A52] hover:bg-[#556241] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve Artisan</span>
                            </button>
                            <button
                              onClick={() => {
                                setAppToReject(app);
                                setRejectionFeedback(
                                  app.adminNotes || 'Application does not meet current platform artisan curation standards.'
                                );
                              }}
                              className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : app.status === 'rejected' ? (
                          <div className="text-right space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-800 border border-red-200">
                              <XCircle className="w-3 h-3 text-red-600" />
                              Rejected
                            </span>
                            {app.adminNotes && (
                              <p className="text-[10px] text-red-700 italic max-w-[140px] truncate" title={app.adminNotes}>
                                {app.adminNotes}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="text-right text-xs text-[#8A7E72] italic">
                            Application {app.status}
                          </div>
                        )}
                        <button
                          onClick={() => setSelectedAppModal(app)}
                          className="px-3 py-1.5 rounded-xl border border-[#D5C7B5] bg-white text-[#28231F] hover:bg-[#EFE7DC] text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3 h-3 text-[#A86F47]" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Commissions & Financial Ledger */}
        {activeTab === 'commissions' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A2521]">
                Real-Time 5% Commission Ledger
              </h3>
              <p className="text-xs text-[#645D56]">
                Every order automatically splits gross volume: 5% platform operations, 95% net seller balance.
              </p>
            </div>

            <div className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] overflow-hidden shadow-xs">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-[#EFE8DD] text-[#2A2521] font-semibold border-b border-[#E4D9C4]">
                    <tr>
                      <th className="p-3.5">Ledger ID</th>
                      <th className="p-3.5">Order Ref</th>
                      <th className="p-3.5">Artisan Shop</th>
                      <th className="p-3.5">Gross Sale</th>
                      <th className="p-3.5">Fee Rate</th>
                      <th className="p-3.5 text-[#A86F47]">Platform 5% Fee</th>
                      <th className="p-3.5 text-[#6B7A52]">Artisan 95% Net</th>
                      <th className="p-3.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4D9C4]">
                    {commissions.map((comm) => (
                      <tr key={comm.id} className="hover:bg-[#FDFBF7]">
                        <td className="p-3.5 text-gray-500 font-medium">{comm.id}</td>
                        <td className="p-3.5 font-bold text-[#2A2521]">{comm.orderNumber}</td>
                        <td className="p-3.5 font-medium text-[#2A2521]">{comm.shopName}</td>
                        <td className="p-3.5 font-bold text-[#2A2521]">${comm.grossSale.toFixed(2)}</td>
                        <td className="p-3.5 font-semibold text-[#A86F47]">5.0%</td>
                        <td className="p-3.5 font-bold text-[#A86F47]">
                          +${comm.commissionAmount.toFixed(2)}
                        </td>
                        <td className="p-3.5 font-bold text-[#6B7A52]">
                          ${comm.sellerNet.toFixed(2)}
                        </td>
                        <td className="p-3.5 text-gray-500 font-medium text-[11px]">
                          {new Date(comm.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Artisans & Guilds */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A2521]">Artisan Guild Verification</h3>
              <p className="text-xs text-[#645D56]">Manage verification badges and audit seller profiles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellers.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img src={s.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                        <div>
                          <div className="font-bold text-sm text-[#2A2521]">{s.shopName}</div>
                          <div className="text-xs text-[#A86F47]">{s.craftCategory}</div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.verificationStatus === 'verified'
                            ? 'bg-[#EFF3EB] text-[#6B7A52]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.verificationStatus}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 mb-4">{s.bio}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-2xl border border-[#E4D9C4] mb-4">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Gross Sales</span>
                        <strong className="text-[#2A2521]">${s.grossRevenue.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Net Disbursed</span>
                        <strong className="text-[#6B7A52]">${s.netEarnings.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateSellerVerification(
                          s.id,
                          s.verificationStatus === 'verified' ? 'pending' : 'verified'
                        )
                      }
                      className="w-full py-2 bg-white hover:bg-[#FAF4ED] text-[#2A2521] border border-[#E4D9C4] rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Toggle Verification Badge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Catalog Moderate */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A2521]">Artisan Product Catalog</h3>
              <p className="text-xs text-[#645D56]">Ensure all listings meet the handmade quality standard.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-4 flex flex-col justify-between"
                >
                  <div className="flex gap-3 mb-3">
                    <img src={p.images[0]} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                    <div>
                      <div className="font-serif font-bold text-sm text-[#2A2521] line-clamp-1">{p.title}</div>
                      <div className="text-xs text-[#A86F47]">{p.sellerName}</div>
                      <div className="text-xs font-bold text-[#2A2521] mt-1">${p.price.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#E4D9C4]">
                    {p.model3dType && (
                      <button
                        onClick={() => open3DStudioWithModel(p.model3dType!)}
                        className="p-2 bg-white rounded-xl border border-[#E4D9C4] hover:bg-[#FDFBF7] text-[#6B7A52] cursor-pointer"
                        title="Inspect 3D Geometry"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="flex-1 py-1.5 bg-white rounded-xl border border-[#E4D9C4] hover:bg-[#FDFBF7] text-xs font-semibold text-[#2A2521] cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 cursor-pointer"
                    >
                      Delist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: All Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A2521]">Platform-Wide Order Ledger</h3>
              <p className="text-xs text-[#645D56]">Every purchase, tracking carrier, and status override control.</p>
            </div>

            <div className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] overflow-hidden shadow-xs">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-[#EFE8DD] text-[#2A2521] font-semibold border-b border-[#E4D9C4]">
                    <tr>
                      <th className="p-3.5">Order No</th>
                      <th className="p-3.5">Buyer</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Subtotal</th>
                      <th className="p-3.5 text-[#A86F47]">5% Fee</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4D9C4]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FDFBF7]">
                        <td className="p-3.5 font-bold text-[#2A2521]">{ord.orderNumber}</td>
                        <td className="p-3.5 text-gray-700">
                          <div>{ord.buyerName}</div>
                          <div className="text-[10px] text-gray-400">{ord.buyerEmail}</div>
                        </td>
                        <td className="p-3.5 text-gray-600">{ord.items.length} items</td>
                        <td className="p-3.5 font-bold text-[#2A2521]">${ord.subtotal.toFixed(2)}</td>
                        <td className="p-3.5 font-bold text-[#A86F47]">+${ord.platformCommissionTotal.toFixed(2)}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EDE6] text-[#A86F47] border border-[#E8DEC8]">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-white border border-[#E4D9C4] rounded-lg px-2 py-1 text-xs cursor-pointer font-medium"
                          >
                            <option value="ordered">Ordered</option>
                            <option value="crafting">Crafting</option>
                            <option value="quality_check">Quality Check</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Users & Account Roles */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A2521]">Platform Accounts & Security</h3>
              <p className="text-xs text-[#645D56]">Manage active access and role assignments across the marketplace.</p>
            </div>

            <div className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] overflow-hidden shadow-xs">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-[#EFE8DD] text-[#2A2521] font-semibold border-b border-[#E4D9C4]">
                    <tr>
                      <th className="p-3.5">User Profile</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4D9C4]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FDFBF7]">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                            <span className="font-bold text-[#2A2521]">{u.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-gray-600">{u.email}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E4D9C4]">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-500">{u.joinedDate}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'active' ? 'bg-[#EFF3EB] text-[#6B7A52]' : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className="flex items-center gap-1 text-xs text-gray-600 hover:text-black font-semibold cursor-pointer"
                          >
                            {u.status === 'active' ? (
                              <>
                                <Lock className="w-3.5 h-3.5 text-red-500" /> Suspend
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3.5 h-3.5 text-[#6B7A52]" /> Activate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Industry Standard Complete Seller Application Modal */}
      {selectedAppModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedAppModal(null)}
        >
          <div
            className="bg-[#FFFCF7] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E4D9C4] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#28231F] text-[#FAF4ED] p-6 sm:p-7 flex items-start justify-between relative border-b border-[#3D352E]">
              <div className="flex items-start gap-4 flex-1 pr-4">
                <img
                  src={
                    selectedAppModal.userAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={selectedAppModal.userName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#D8A45F]/60 shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedAppModal.status === 'approved'
                          ? 'bg-[#6B7A52] text-white'
                          : selectedAppModal.status === 'pending'
                          ? 'bg-[#D8A45F] text-[#28231F]'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {selectedAppModal.status}
                    </span>
                    <span className="text-xs text-[#C9BFB5]">
                      Application ID: <span className="font-semibold text-gray-700">{selectedAppModal.id}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/10 text-[#E8DEC8] border border-white/10">
                      {selectedAppModal.craftCategory}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                    {selectedAppModal.shopName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#D8A45F] italic mt-0.5">
                    "{selectedAppModal.tagline}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF4ED] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#28231F]">
              {selectedAppModal.status === 'rejected' && (
                <div className="p-4 sm:p-5 bg-red-50 border border-red-200 rounded-2xl text-red-900 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-sm text-red-800">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Application Rejected</span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                    <strong>Admin Feedback & Reason:</strong>{' '}
                    {selectedAppModal.adminNotes || 'Application does not meet current platform artisan curation standards.'}
                  </p>
                </div>
              )}
              {/* PHOTOGRAPHIC EVIDENCE & VERIFICATION GALLERY */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7E72] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#A86F47]" />
                    Uploaded Workshop & Craft Verification Photos
                  </h4>
                  <span className="text-[11px] text-[#8A7E72] italic">
                    Click any photo to enlarge in high resolution
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Workshop Photo Card */}
                  <div className="bg-[#FAF6F0] rounded-2xl border border-[#E8DEC8] overflow-hidden flex flex-col group/img shadow-xs">
                    <div className="relative aspect-video sm:h-56 overflow-hidden bg-[#28231F]">
                      <img
                        src={
                          selectedAppModal.workshopPhotoUrl ||
                          getCategoryWorkshopDefault(selectedAppModal.craftCategory)
                        }
                        alt="Artisan Studio Workshop"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#28231F]/85 text-[#E8DEC8] backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-[#D8A45F]" />
                          Studio Workshop Proof
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            url:
                              selectedAppModal.workshopPhotoUrl ||
                              getCategoryWorkshopDefault(selectedAppModal.craftCategory),
                            title: `${selectedAppModal.shopName} - Studio Workshop Workspace`
                          })
                        }
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#28231F] text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Zoom Photo</span>
                      </button>
                    </div>

                    <div className="p-4 flex-1 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8A7E72] font-semibold text-[11px] uppercase tracking-wider">
                          Workshop Address
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#EFF3EB] text-[#6B7A52] font-semibold text-[10px]">
                          {selectedAppModal.yearsOfExperience || '3-5 years'} experience
                        </span>
                      </div>
                      <p className="font-semibold text-sm text-[#28231F]">
                        {selectedAppModal.workshopAddress || `${selectedAppModal.location} Workshop`}
                      </p>
                      <p className="text-[11px] text-[#645D56] leading-relaxed pt-1 border-t border-[#E8DEC8]/60">
                        Authentic studio inspection: dedicated workstation, artisanal tools, and zero mass-production assembly lines.
                      </p>
                    </div>
                  </div>

                  {/* Flagship Artifact Sample Card */}
                  <div className="bg-[#FAF6F0] rounded-2xl border border-[#E8DEC8] overflow-hidden flex flex-col group/img shadow-xs">
                    <div className="relative aspect-video sm:h-56 overflow-hidden bg-[#28231F]">
                      <img
                        src={
                          selectedAppModal.sampleImageUrl ||
                          getCategorySampleDefault(selectedAppModal.craftCategory)
                        }
                        alt="Flagship Craft Artifact"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#A86F47]/90 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          Flagship Sample Artifact
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6B7A52] text-white shadow-xs">
                          ${selectedAppModal.samplePrice || 95}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImage({
                            url:
                              selectedAppModal.sampleImageUrl ||
                              getCategorySampleDefault(selectedAppModal.craftCategory),
                            title: `${selectedAppModal.sampleTitle || selectedAppModal.shopName} - Flagship Craft Sample`
                          })
                        }
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#28231F] text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Zoom Photo</span>
                      </button>
                    </div>

                    <div className="p-4 flex-1 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8A7E72] font-semibold text-[11px] uppercase tracking-wider">
                          Artifact Title
                        </span>
                        <span className="text-[11px] text-[#A86F47] font-semibold">
                          {selectedAppModal.sampleLeadTime || 'Made to order (3-5 days)'}
                        </span>
                      </div>
                      <h5 className="font-serif font-bold text-sm text-[#28231F]">
                        {selectedAppModal.sampleTitle || `${selectedAppModal.craftCategory} Signature Piece`}
                      </h5>
                      <p className="text-[11px] text-[#645D56] line-clamp-2 leading-relaxed">
                        {selectedAppModal.sampleDescription || selectedAppModal.bio}
                      </p>
                      {selectedAppModal.sampleMaterials && (
                        <div className="pt-1 text-[11px] text-[#8A7E72] border-t border-[#E8DEC8]/60">
                          <strong>Craft Materials:</strong> {selectedAppModal.sampleMaterials}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Studio & Craft Narrative */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7E72] flex items-center gap-1.5 mb-2.5">
                  <FileText className="w-4 h-4 text-[#A86F47]" />
                  Artisan Studio Story & Heritage
                </h4>
                <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-2xl border border-[#EFE7DC] text-xs sm:text-sm leading-relaxed text-[#3D352E]">
                  {selectedAppModal.bio}
                </div>
              </div>

              {/* Grid of Key Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Craft Category */}
                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EFE7DC] space-y-1">
                  <div className="text-[11px] font-bold uppercase text-[#8A7E72] flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#A86F47]" />
                    Craft Specialization
                  </div>
                  <div className="text-sm font-semibold text-[#28231F]">
                    {selectedAppModal.craftCategory}
                  </div>
                </div>

                {/* Studio Location */}
                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EFE7DC] space-y-1">
                  <div className="text-[11px] font-bold uppercase text-[#8A7E72] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#6B7A52]" />
                    Studio Workshop Location
                  </div>
                  <div className="text-sm font-semibold text-[#28231F]">
                    {selectedAppModal.location}
                  </div>
                </div>

                {/* Primary Contact Person */}
                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EFE7DC] space-y-1">
                  <div className="text-[11px] font-bold uppercase text-[#8A7E72] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#A86F47]" />
                    Applicant / Master Artisan
                  </div>
                  <div className="text-sm font-semibold text-[#28231F] flex items-center gap-2">
                    <img
                      src={
                        selectedAppModal.userAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                      }
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{selectedAppModal.userName}</span>
                  </div>
                  <div className="text-xs text-[#645D56] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#8A7E72]" />
                    {selectedAppModal.userEmail}
                  </div>
                </div>

                {/* Phone & Submission Time */}
                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EFE7DC] space-y-1">
                  <div className="text-[11px] font-bold uppercase text-[#8A7E72] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6B7A52]" />
                    Submission Record
                  </div>
                  <div className="text-sm font-semibold text-[#28231F]">
                    {new Date(selectedAppModal.submittedAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-[#645D56] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#8A7E72]" />
                    {selectedAppModal.phone || 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Portfolio Link if provided */}
              {selectedAppModal.portfolioUrl && (
                <div className="p-4 bg-[#EFF3EB] rounded-2xl border border-[#D9E3D3] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7A52]">
                    <Globe className="w-4 h-4" />
                    <span>Portfolio / Social Studio Showroom:</span>
                    <a
                      href={selectedAppModal.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#A86F47] underline hover:text-[#8F5732]"
                    >
                      {selectedAppModal.portfolioUrl}
                    </a>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#6B7A52]" />
                </div>
              )}

              {/* Verified Payout Banking & KYC Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A7E72] flex items-center gap-1.5 mb-2.5">
                  <CreditCard className="w-4 h-4 text-[#6B7A52]" />
                  Direct Settlement Banking & KYC Verification
                </h4>
                <div className="bg-[#F8F4EE] p-5 rounded-2xl border border-[#E4D9C4] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#8A7E72] block text-[11px]">Financial Institution</span>
                      <strong className="text-sm text-[#28231F] flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-4 h-4 text-[#6B7A52]" />
                        {selectedAppModal.bankDetails.bankName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#8A7E72] block text-[11px]">Account Beneficiary</span>
                      <strong className="text-sm text-[#28231F] block mt-0.5">
                        {selectedAppModal.bankDetails.accountHolder}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#8A7E72] block text-[11px]">ACH Routing Number</span>
                      <span className="text-xs font-semibold text-[#28231F] block mt-0.5">
                        {selectedAppModal.bankDetails.routingNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8A7E72] block text-[11px]">Account Number Identifier</span>
                      <span className="text-xs font-semibold text-[#28231F] block mt-0.5">
                        •••• •••• •••• {selectedAppModal.bankDetails.accountNumberLast4}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#E8DEC8] flex items-center gap-2 text-[11px] text-[#6B7A52]">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Bank account format validated for automated 95% net payout disbursements.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 bg-[#FAF6F0] border-t border-[#EFE7DC] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedAppModal(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-white hover:bg-[#EFE7DC] text-xs font-semibold text-[#28231F] cursor-pointer transition-colors"
              >
                Close Full View
              </button>

              <div className="flex items-center gap-2">
                {selectedAppModal.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => {
                        setAppToReject(selectedAppModal);
                        setRejectionFeedback(
                          selectedAppModal.adminNotes ||
                            'Application does not meet current platform artisan curation standards.'
                        );
                      }}
                      className="px-4 py-2.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => {
                        approveSellerApplication(selectedAppModal.id);
                        setSelectedAppModal(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#6B7A52] hover:bg-[#556241] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Artisan & Activate Studio</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-[#8A7E72] italic px-2">
                    Status: <strong className="capitalize">{selectedAppModal.status}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Rejection Feedback Dialog */}
      {appToReject && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setAppToReject(null)}
        >
          <div
            className="max-w-lg w-full bg-[#FFFCF7] rounded-3xl border border-[#E4D9C4] shadow-2xl p-6 sm:p-7 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center border border-red-200 shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#28231F]">
                    Reject Seller Application
                  </h3>
                  <p className="text-xs text-[#645D56] mt-0.5">
                    {appToReject.shopName} ({appToReject.userName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAppToReject(null)}
                className="p-1.5 rounded-xl text-[#8A7E72] hover:bg-[#F8F4EE] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#645D56] leading-relaxed">
              The applicant will clearly see <strong>“Application Rejected”</strong> in their seller dashboard and account menu along with this feedback, and will be permitted to revise their details and reapply.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7E72] mb-1.5">
                Rejection Reason & Feedback to Artisan
              </label>
              <textarea
                rows={3}
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="State the specific reason or revisions required (e.g., missing studio photos, incomplete workshop verification, portfolio guidelines)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-red-400/40 leading-relaxed resize-none"
              />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#8A7E72] block mb-1.5">
                Quick Preset Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Missing high-resolution studio workshop photos.',
                  'Sample artifact description or pricing requires further detail.',
                  'Portfolio link or craft provenance could not be verified.',
                  'Direct settlement bank account details need clarification.',
                  'Application does not meet current platform artisan curation standards.'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectionFeedback(preset)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-[#FAF6F0] hover:bg-[#EFE7DC] text-[#645D56] hover:text-[#28231F] border border-[#E8DEC8] transition-colors cursor-pointer text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8DEC8] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setAppToReject(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-xs font-semibold text-[#28231F] hover:bg-[#F8F4EE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectSellerApplication(appToReject.id, rejectionFeedback);
                  setAppToReject(null);
                  if (selectedAppModal?.id === appToReject.id) {
                    setSelectedAppModal(null);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox High-Resolution Image Zoom Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-[#1F1A16] rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 text-white">
              <span className="font-serif font-semibold text-sm sm:text-base truncate pr-4">
                {previewImage.title}
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 sm:p-4 flex items-center justify-center bg-black/50 max-h-[80vh] overflow-hidden">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
