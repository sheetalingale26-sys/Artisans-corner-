import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  X,
  Sparkles,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Link2,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Layers,
  AlertCircle
} from 'lucide-react';

export const BecomeSellerModal: React.FC = () => {
  const {
    isBecomeSellerOpen,
    setIsBecomeSellerOpen,
    currentUser,
    currentUserApplication,
    isSellerApproved,
    applyToBecomeSeller,
    switchRole,
    setActiveTab
  } = useApp();

  const [shopName, setShopName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [craftCategory, setCraftCategory] = useState('Ceramics & Pottery');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState(currentUser?.name || '');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isBecomeSellerOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!shopName.trim()) {
      setError('Please provide a name for your artisan shop or studio.');
      return;
    }
    if (!bio.trim() || bio.trim().length < 20) {
      setError('Please share a short story (at least 20 characters) about your handcraft process and materials.');
      return;
    }
    if (!location.trim()) {
      setError('Please enter your studio workshop location.');
      return;
    }
    if (!bankName.trim() || !accountHolder.trim() || !routingNumber.trim() || !accountNumber.trim()) {
      setError('Please complete the bank details to ensure prompt 95% direct deposits.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await applyToBecomeSeller({
        shopName: shopName.trim(),
        tagline: tagline.trim() || `Handcrafted ${craftCategory}`,
        bio: bio.trim(),
        craftCategory,
        location: location.trim(),
        phone: phone.trim() || '+1 (555) 000-0000',
        portfolioUrl: portfolioUrl.trim() || undefined,
        bankDetails: {
          bankName: bankName.trim(),
          accountHolder: accountHolder.trim(),
          routingNumber: routingNumber.trim(),
          accountNumberLast4: accountNumber.slice(-4)
        }
      });

      if (!res.success && res.error) {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFCF7] rounded-3xl shadow-2xl border border-[#E4D9C4] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#28231F] text-[#FAF4ED] p-6 sm:p-8 relative">
          <button
            onClick={() => setIsBecomeSellerOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#373029] border border-[#4A3F36] text-[11px] font-semibold text-[#D8A45F] uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5" />
            Artisan Partnership Program
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Become a Verified Artisan Seller</h2>
          <p className="text-xs sm:text-sm text-[#C9BFB5] mt-1.5 max-w-lg">
            Showcase your handcrafted creations to collectors worldwide while retaining <strong>95%</strong> of every sale.
          </p>

          {/* Quick Pillars */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#443B34] text-[11px]">
            <div className="flex items-center gap-1.5 text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#8A9A6E] shrink-0" />
              <span>5% Flat Platform Fee</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <DollarSign className="w-4 h-4 text-[#D8A45F] shrink-0" />
              <span>Direct Bank Payouts</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Layers className="w-4 h-4 text-[#A86F47] shrink-0" />
              <span>3D Studio Integration</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* Case 1: Already Approved */}
          {isSellerApproved ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#EFF3EB] text-[#6B7A52] mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#28231F]">You Are Already an Approved Artisan!</h3>
              <p className="text-sm text-[#645D56] mt-2 max-w-md mx-auto">
                Your studio is active on Artisan’s Corner. You can switch between your Buyer view and Artisan Studio anytime using the role toggle in the header.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsBecomeSellerOpen(false);
                    switchRole('seller');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
                >
                  Enter Artisan Studio
                </button>
                <button
                  type="button"
                  onClick={() => setIsBecomeSellerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#EFE7DC] hover:bg-[#E4D9C4] text-[#28231F] text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : currentUserApplication && currentUserApplication.status === 'pending' ? (
            /* Case 2: Application Pending Review */
            <div className="py-4">
              <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8] text-center">
                <div className="w-14 h-14 rounded-full bg-[#F6EDE6] text-[#A86F47] mx-auto flex items-center justify-center mb-3">
                  <Clock className="w-7 h-7 animate-pulse" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F6EDE6] border border-[#E8DEC8] text-xs font-semibold text-[#A86F47] uppercase tracking-wider">
                  Application Under Review
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#28231F] mt-3">
                  "{currentUserApplication.shopName}"
                </h3>
                <p className="text-xs sm:text-sm text-[#645D56] mt-2 max-w-md mx-auto leading-relaxed">
                  Our platform curators are reviewing your studio submission. Once approved by our team, the <strong>Seller Hub</strong> will automatically unlock in your account navigation without having to log in again.
                </p>

                <div className="mt-6 pt-5 border-t border-[#E8DEC8] grid grid-cols-2 gap-4 text-left text-xs max-w-md mx-auto">
                  <div>
                    <span className="text-[#8A7E72] block">Craft Discipline:</span>
                    <strong className="text-[#28231F]">{currentUserApplication.craftCategory}</strong>
                  </div>
                  <div>
                    <span className="text-[#8A7E72] block">Workshop Location:</span>
                    <strong className="text-[#28231F]">{currentUserApplication.location}</strong>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsBecomeSellerOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#A86F47] text-white text-xs sm:text-sm font-semibold hover:bg-[#8F5732] cursor-pointer"
                  >
                    Continue Browsing Marketplace
                  </button>
                </div>
              </div>
            </div>
          ) : !currentUser ? (
            /* Case 3: Not Logged In */
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#F6EDE6] text-[#A86F47] mx-auto flex items-center justify-center mb-3">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#28231F]">Sign In to Apply</h3>
              <p className="text-xs sm:text-sm text-[#645D56] mt-2 max-w-md mx-auto">
                Please sign in to your buyer account or register before applying to become an artisan partner.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsBecomeSellerOpen(false);
                    setActiveTab('login');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
                >
                  Sign In / Register
                </button>
                <button
                  type="button"
                  onClick={() => setIsBecomeSellerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#EFE7DC] hover:bg-[#E4D9C4] text-[#28231F] text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Case 4: Application Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Studio Overview */}
              <div>
                <h4 className="font-serif text-base font-bold text-[#28231F] mb-3 flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#A86F47]" />
                  <span>1. Studio Identity & Craft</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Shop / Studio Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g., Terracotta & Hearth Pottery"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Primary Craft Category *
                    </label>
                    <select
                      value={craftCategory}
                      onChange={(e) => setCraftCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 cursor-pointer"
                    >
                      <option value="Ceramics & Pottery">Ceramics & Pottery</option>
                      <option value="Woodwork & Carving">Woodwork & Carving</option>
                      <option value="Jewelry & Metalsmithing">Jewelry & Metalsmithing</option>
                      <option value="Textiles & Fiber Art">Textiles & Fiber Art</option>
                      <option value="Glass & Papercraft">Glass & Papercraft</option>
                      <option value="Leather & Heritage Goods">Leather & Heritage Goods</option>
                      <option value="Home Goods & Decor">Home Goods & Decor</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-[#28231F] mb-1">
                    Studio Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g., Wheel-thrown earthenware shaped with desert river clay"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-[#28231F] mb-1">
                    Crafting Story & Studio Philosophy *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell our community about your materials, tools (e.g. kickwheel, joinery, forge), and artisanal tradition..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                  />
                </div>
              </div>

              {/* Workshop Location & Contact */}
              <div className="pt-2 border-t border-[#EFE7DC]">
                <h4 className="font-serif text-base font-bold text-[#28231F] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6B7A52]" />
                  <span>2. Workshop Location & Contact</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Studio Location (City, State / Country) *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Santa Fe, New Mexico"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-[#28231F] mb-1">
                    Website or Workshop Portfolio (Optional)
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://instagram.com/yourstudiocraft"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                  />
                </div>
              </div>

              {/* Direct Deposit Banking */}
              <div className="pt-2 border-t border-[#EFE7DC]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-base font-bold text-[#28231F] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#A86F47]" />
                    <span>3. Payout & Bank Account Details</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-[#6B7A52] bg-[#EFF3EB] px-2 py-0.5 rounded-full">
                    95% Net Earnings
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g., First National Bank"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      placeholder="Full Name as on Account"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Routing Number (ACH) *
                    </label>
                    <input
                      type="text"
                      required
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="9-digit routing"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Checking or savings account"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Commission guarantee callout */}
              <div className="p-3.5 rounded-2xl bg-[#F6EDE6] border border-[#E8DEC8] text-xs text-[#28231F]">
                <strong className="text-[#A86F47]">Fair Marketplace Pledge:</strong> Artisan’s Corner deducts a flat 5% platform commission automatically upon customer order. 95% of every transaction is disbursed directly to your verified bank account.
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBecomeSellerOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E4D9C4] text-[#645D56] hover:bg-[#F8F4EE] text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
