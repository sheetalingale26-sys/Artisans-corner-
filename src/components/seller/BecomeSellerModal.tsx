import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  X,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const CRAFT_CATEGORIES = [
  'Ceramics & Pottery',
  'Woodwork & Carving',
  'Jewelry & Metals',
  'Textiles & Weaving',
  'Glassblowing & Stained Glass',
  'Leathercraft & Bookbinding'
];

export const BecomeSellerModal: React.FC = () => {
  const {
    isBecomeSellerOpen,
    setIsBecomeSellerOpen,
    currentUser,
    isSellerApproved,
    quickOnboardSeller,
    switchRole,
    register
  } = useApp();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPassword, setGuestPassword] = useState('');

  const [shopName, setShopName] = useState('');
  const [craftCategory, setCraftCategory] = useState('Ceramics & Pottery');
  const [location, setLocation] = useState('');
  const [tagline, setTagline] = useState('');

  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isBecomeSellerOpen) return null;

  const handleClose = () => {
    setIsBecomeSellerOpen(false);
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!shopName.trim()) {
      setLocalError('Please enter your studio or shop name.');
      return;
    }
    if (!location.trim()) {
      setLocalError('Please enter your workshop location (city, state).');
      return;
    }

    if (!currentUser) {
      if (!guestName.trim()) {
        setLocalError('Please provide your full name.');
        return;
      }
      if (!guestEmail.trim() || !guestEmail.includes('@')) {
        setLocalError('Please provide a valid email address.');
        return;
      }
      if (!guestPassword || guestPassword.length < 6) {
        setLocalError('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (!currentUser) {
        const res = await register(guestName.trim(), guestEmail.trim(), guestPassword.trim(), {
          shopName: shopName.trim(),
          craftCategory,
          location: location.trim()
        });
        if (!res.success) {
          setLocalError(res.error || 'Failed to create artisan seller account.');
        } else {
          handleClose();
        }
      } else {
        const res = await quickOnboardSeller({
          shopName: shopName.trim(),
          craftCategory,
          location: location.trim(),
          tagline: tagline.trim()
        });
        if (!res.success) {
          setLocalError(res.error || 'Failed to activate seller studio.');
        } else {
          handleClose();
        }
      }
    } catch (err: any) {
      setLocalError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#FFFCF7] rounded-3xl border border-[#E8DEC8] shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#EFE7DC] text-[#8A7E72] hover:text-[#28231F] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSellerApproved ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#EFF3EB] text-[#6B7A52] mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#28231F]">You Are Already an Active Seller!</h3>
            <p className="text-xs sm:text-sm text-[#645D56] mt-2 max-w-md mx-auto">
              Your artisan studio is already active. You can enter your Seller Dashboard to add products, preview in 3D, and update your profile anytime.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  switchRole('seller');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
              >
                Go to Seller Dashboard
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-[#EFE7DC] hover:bg-[#E4D9C4] text-[#28231F] text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A86F47]/15 text-[#8F5732] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Artisan Fast-Track Onboarding
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#28231F]">
              Open Your Artisan Studio
            </h2>
            <p className="text-xs sm:text-sm text-[#645D56] mt-1 mb-5 leading-relaxed">
              Fill in your essential details to classify your account as a seller and immediately access your <strong>Seller Dashboard</strong>. You can complete your full story, workshop photos, and bank payout details anytime inside the dashboard!
            </p>

            {localError && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{localError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* If guest, ask for account info */}
              {!currentUser && (
                <div className="p-3.5 rounded-2xl bg-[#EFE7DC]/50 border border-[#E4D9C4] space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A7E72]">
                    Create Your Account
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#28231F] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g., Freja Lindqvist"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#28231F] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#28231F] mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={guestPassword}
                        onChange={(e) => setGuestPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Studio Details */}
              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1">
                  Studio / Shop Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E72]">
                    <Store className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g., Sylvan Wood & Clay Studio"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#28231F] mb-1">
                    Craft Discipline *
                  </label>
                  <select
                    value={craftCategory}
                    onChange={(e) => setCraftCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47]"
                  >
                    {CRAFT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#28231F] mb-1">
                    Studio City / Location *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E72]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Santa Fe, NM"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1">
                  Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g., Hand-thrown stoneware from native clays"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47]"
                />
              </div>

              {/* Commission notice */}
              <div className="p-3 rounded-xl bg-[#F6EDE6]/60 border border-[#E4D9C4] flex items-center gap-2.5 text-[11px] text-[#645D56]">
                <ShieldCheck className="w-4 h-4 text-[#A86F47] shrink-0" />
                <span>
                  <strong>95% Net Revenue Guarantee:</strong> You retain 95% of every sale. You can complete your bank payout details anytime in your dashboard profile.
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#E4D9C4] bg-white hover:bg-gray-50 text-[#645D56] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 py-3 px-4 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] active:bg-[#784624] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Open Studio & Go to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};