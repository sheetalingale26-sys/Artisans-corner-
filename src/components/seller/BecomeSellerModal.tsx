import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useSellerOnboardingStore } from '../../stores/sellerOnboardingStore';
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
  ArrowLeft,
  Layers,
  AlertCircle,
  Camera,
  Hammer,
  FileCheck,
  Palette,
  Check,
  XCircle,
  RotateCcw,
  FileText,
  Eye
} from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

export const BecomeSellerModal: React.FC = () => {
  const {
    isBecomeSellerOpen,
    setIsBecomeSellerOpen,
    currentUser,
    currentUserApplication,
    isSellerApproved,
    applyToBecomeSeller,
    switchRole,
    register,
    login,
    showToast
  } = useApp();

  const {
    currentStep,
    formData,
    isSubmitting,
    setStep,
    nextStep,
    prevStep,
    updateField,
    updateMultipleFields,
    setSubmitting,
    resetForm
  } = useSellerOnboardingStore();

  const [localError, setLocalError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [authMode, setAuthMode] = useState<'create' | 'login'>('create');
  const [isReapplying, setIsReapplying] = useState(false);

  const handleCloseModal = () => {
    setIsBecomeSellerOpen(false);
    setIsReapplying(false);
  };

  const handleStartReapply = () => {
    if (!currentUserApplication) return;
    updateMultipleFields({
      shopName: currentUserApplication.shopName || '',
      tagline: currentUserApplication.tagline || '',
      craftCategory: currentUserApplication.craftCategory || 'Ceramics & Pottery',
      bio: currentUserApplication.bio || '',
      phone: currentUserApplication.phone || '',
      location: currentUserApplication.location || '',
      workshopAddress: currentUserApplication.workshopAddress || '',
      workshopPhotoUrl: currentUserApplication.workshopPhotoUrl || '',
      portfolioUrl: currentUserApplication.portfolioUrl || '',
      yearsOfExperience: currentUserApplication.yearsOfExperience || '3-5 years',
      sampleTitle: currentUserApplication.sampleTitle || '',
      samplePrice: currentUserApplication.samplePrice || 95,
      sampleCategory: currentUserApplication.sampleCategory || currentUserApplication.craftCategory,
      sampleDescription: currentUserApplication.sampleDescription || '',
      sampleMaterials: currentUserApplication.sampleMaterials || '',
      sampleImageUrl: currentUserApplication.sampleImageUrl || '',
      sampleLeadTime: currentUserApplication.sampleLeadTime || 'Made to order (3-5 days)',
      bankName: currentUserApplication.bankDetails?.bankName || '',
      accountHolder: currentUserApplication.bankDetails?.accountHolder || '',
      routingNumber: currentUserApplication.bankDetails?.routingNumber || '',
      accountNumberLast4: currentUserApplication.bankDetails?.accountNumberLast4 || '',
      pledgeSigned: true,
      termsAccepted: true
    });
    setStep(1);
    setIsReapplying(true);
    setLocalError(null);
  };

  // Pre-fill user details if logged in
  useEffect(() => {
    if (currentUser) {
      if (!formData.accountHolder) updateField('accountHolder', currentUser.name);
      if (!formData.phone && currentUser.phone) updateField('phone', currentUser.phone);
    }
  }, [currentUser]);

  if (!isBecomeSellerOpen) return null;

  const craftCategories = [
    'Ceramics & Pottery',
    'Woodwork & Carving',
    'Jewelry & Metals',
    'Textiles & Weaving',
    'Glassblowing & Stained Glass',
    'Leathercraft & Bookbinding'
  ];

  const handleStepNext = () => {
    setLocalError(null);

    if (currentStep === 1) {
      if (!currentUser && authMode === 'create' && (!guestName.trim() || !guestEmail.trim() || !guestPassword.trim())) {
        setLocalError('Please provide your name, email, and a password to create your artisan account.');
        return;
      }
      if (!formData.shopName.trim()) {
        setLocalError('Please specify your shop or studio name.');
        return;
      }
      if (!formData.bio.trim() || formData.bio.trim().length < 20) {
        setLocalError('Please share at least 20 characters about your handcraft process and heritage.');
        return;
      }
      if (!formData.location.trim()) {
        setLocalError('Please provide your studio or city location.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.workshopAddress.trim()) {
        updateField('workshopAddress', `${formData.location} Artisan Workshop`);
      }
    }

    if (currentStep === 3) {
      if (!formData.sampleTitle.trim()) {
        setLocalError('Please enter a title for your initial handcrafted sample.');
        return;
      }
      if (!formData.sampleDescription.trim()) {
        setLocalError('Please enter a brief description of this artifact.');
        return;
      }
    }

    if (currentStep === 4) {
      if (!formData.bankName.trim() || !formData.accountHolder.trim() || !formData.routingNumber.trim() || !formData.accountNumberLast4.trim()) {
        setLocalError('Please complete your bank disbursement details to receive 95% net sales deposits.');
        return;
      }
    }

    nextStep();
  };

  const handleFinalSubmit = async () => {
    setLocalError(null);

    if (!formData.pledgeSigned || !formData.termsAccepted) {
      setLocalError('You must agree to the Authentic Craft Pledge and Platform Terms before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      // If user is guest, register first
      if (!currentUser) {
        if (authMode === 'create') {
          const regRes = await register(guestName.trim(), guestEmail.trim(), guestPassword.trim());
          if (!regRes.success) {
            setLocalError(regRes.error || 'Failed to create your account.');
            setSubmitting(false);
            return;
          }
        } else {
          const logRes = await login(guestEmail.trim(), guestPassword.trim());
          if (!logRes.success) {
            setLocalError(logRes.error || 'Failed to sign in.');
            setSubmitting(false);
            return;
          }
        }
      }

      const res = await applyToBecomeSeller({
        shopName: formData.shopName.trim(),
        tagline: formData.tagline.trim() || `Handcrafted ${formData.craftCategory}`,
        bio: formData.bio.trim(),
        craftCategory: formData.craftCategory,
        location: formData.location.trim(),
        phone: formData.phone.trim() || '+1 (555) 000-0000',
        portfolioUrl: formData.portfolioUrl.trim() || undefined,
        workshopAddress: formData.workshopAddress.trim() || `${formData.location.trim()} Artisan Workshop`,
        workshopPhotoUrl: formData.workshopPhotoUrl.trim() || undefined,
        yearsOfExperience: formData.yearsOfExperience || '3-5 years',
        sampleTitle: formData.sampleTitle.trim() || `${formData.shopName.trim()} Signature Work`,
        samplePrice: Number(formData.samplePrice) || 95,
        sampleCategory: formData.sampleCategory || formData.craftCategory,
        sampleDescription: formData.sampleDescription.trim() || formData.bio.trim(),
        sampleMaterials: formData.sampleMaterials.trim() || 'Hand-selected natural studio materials',
        sampleImageUrl: formData.sampleImageUrl.trim() || undefined,
        sampleLeadTime: formData.sampleLeadTime.trim() || 'Made to order (3-5 days)',
        bankDetails: {
          bankName: formData.bankName.trim(),
          accountHolder: formData.accountHolder.trim(),
          routingNumber: formData.routingNumber.trim(),
          accountNumberLast4: formData.accountNumberLast4.trim().slice(-4)
        }
      });

      if (!res.success && res.error) {
        setLocalError(res.error);
      } else {
        showToast('Artisan partnership application submitted! Curators will review within 24-48 hours.', 'success');
        resetForm();
        setIsReapplying(false);
      }
    } catch (err: any) {
      setLocalError(err.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#FFFCF7] rounded-3xl shadow-2xl border border-[#E4D9C4] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#28231F] text-white p-6 sm:p-8 relative">
          <button
            onClick={handleCloseModal}
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#373029] border border-[#4A3F36] text-[11px] font-semibold text-[#D8A45F] uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5" />
            Verified Artisan Partnership
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            {isReapplying ? 'Revise & Resubmit Artisan Application' : 'Open Your Artisan Studio'}
          </h2>
          <p className="text-xs sm:text-sm text-[#C9BFB5] mt-1 max-w-xl">
            Join a curated collective of master craftspeople. Retain <strong>95% of every transaction</strong> with automated weekly direct deposits.
          </p>

          {/* Stepper Progress Bar (Only shown when not already approved or pending, and not viewing rejected dossier) */}
          {!isSellerApproved &&
            !(currentUserApplication && currentUserApplication.status === 'pending') &&
            (!currentUserApplication || currentUserApplication.status !== 'rejected' || isReapplying) && (
            <div className="mt-6 pt-5 border-t border-[#443B34]">
              <div className="grid grid-cols-5 gap-2">
                {[
                  { step: 1, label: 'Identity' },
                  { step: 2, label: 'Studio' },
                  { step: 3, label: 'Sample' },
                  { step: 4, label: 'Banking' },
                  { step: 5, label: 'Pledge' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => s.step < currentStep && setStep(s.step)}
                    disabled={s.step > currentStep}
                    className={`flex flex-col items-center gap-1.5 transition-all text-center ${
                      s.step === currentStep
                        ? 'text-[#D8A45F]'
                        : s.step < currentStep
                        ? 'text-[#8A9A6E] cursor-pointer'
                        : 'text-gray-500 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        s.step === currentStep
                          ? 'bg-[#D8A45F] text-[#28231F] ring-4 ring-[#D8A45F]/20'
                          : s.step < currentStep
                          ? 'bg-[#8A9A6E] text-white'
                          : 'bg-[#373029] text-gray-400'
                      }`}
                    >
                      {s.step < currentStep ? <Check className="w-3.5 h-3.5" /> : s.step}
                    </div>
                    <span className="text-[10px] font-semibold hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto">
          {/* Case 1: Already Approved */}
          {isSellerApproved ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#EFF3EB] text-[#6B7A52] mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#28231F]">You Are an Approved Artisan Partner!</h3>
              <p className="text-sm text-[#645D56] mt-2 max-w-md mx-auto">
                Your studio is active on Artisanâ€™s Corner. You can switch into your Artisan Studio management view at any time using the header toggle.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsBecomeSellerOpen(false);
                    switchRole('seller');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
                >
                  Enter Artisan Studio
                </button>
                <button
                  type="button"
                  onClick={() => setIsBecomeSellerOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#EFE7DC] hover:bg-[#E4D9C4] text-[#28231F] text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : currentUserApplication && currentUserApplication.status === 'pending' ? (
            /* Case 2: Application Pending Review */
            <div className="py-4">
              <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E8DEC8] text-center">
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
                  Our platform curators are reviewing your studio submission. Once approved, the <strong>Seller Hub</strong> will automatically unlock in your account navigation without having to log in again.
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
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 rounded-xl bg-[#A86F47] text-white text-xs sm:text-sm font-semibold hover:bg-[#8F5732] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : currentUserApplication && currentUserApplication.status === 'rejected' && !isReapplying ? (
            /* Case 2.5: Application Rejected View & Reapply */
            <div className="py-2 space-y-5">
              {/* Top Status Banner */}
              <div className="p-6 rounded-3xl bg-red-50/90 border border-red-200 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 mx-auto flex items-center justify-center border border-red-200">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-200 text-xs font-bold uppercase tracking-wider">
                    Application Rejected
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#28231F] mt-2">
                    "{currentUserApplication.shopName}"
                  </h3>
                  <p className="text-xs sm:text-sm text-[#645D56] mt-1 max-w-md mx-auto leading-relaxed">
                    This seller application was reviewed by platform administrators and was not approved. Review the feedback below to adjust your application details and resubmit.
                  </p>
                </div>

                {/* Prominent Rejection Reason Card */}
                <div className="p-4 bg-white/95 rounded-2xl border border-red-200 text-left space-y-1.5 shadow-xs max-w-lg mx-auto">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Rejection Reason & Admin Feedback</span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-900 leading-relaxed font-medium">
                    {currentUserApplication.adminNotes || 'Application does not meet current platform artisan curation standards.'}
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartReapply}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Submit a New Application</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#D5C7B5] bg-white hover:bg-[#F8F4EE] text-[#28231F] text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Full Submitted Dossier Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-2">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#28231F] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#A86F47]" />
                    <span>Submitted Application Details</span>
                  </h4>
                  <span className="text-[11px] text-[#8A7E72]">
                    Submitted: {new Date(currentUserApplication.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Studio Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE7DC]">
                    <span className="text-[#8A7E72] block text-[10px] font-bold uppercase tracking-wider">
                      Craft Discipline
                    </span>
                    <span className="font-semibold text-[#28231F] text-sm block mt-0.5">
                      {currentUserApplication.craftCategory}
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE7DC]">
                    <span className="text-[#8A7E72] block text-[10px] font-bold uppercase tracking-wider">
                      Studio Location
                    </span>
                    <span className="font-semibold text-[#28231F] text-sm block mt-0.5">
                      {currentUserApplication.location}
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE7DC]">
                    <span className="text-[#8A7E72] block text-[10px] font-bold uppercase tracking-wider">
                      Years of Experience
                    </span>
                    <span className="font-semibold text-[#28231F] text-sm block mt-0.5">
                      {currentUserApplication.yearsOfExperience || '3-5 years'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE7DC]">
                    <span className="text-[#8A7E72] block text-[10px] font-bold uppercase tracking-wider">
                      Contact Phone
                    </span>
                    <span className="font-semibold text-[#28231F] text-sm block mt-0.5">
                      {currentUserApplication.phone || 'Not provided'}
                    </span>
                  </div>
                </div>

                {/* Bio / Heritage Story */}
                <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EFE7DC] space-y-1 text-xs">
                  <span className="text-[#8A7E72] block text-[10px] font-bold uppercase tracking-wider">
                    Studio Narrative & Heritage
                  </span>
                  <p className="text-[#4A423B] leading-relaxed">
                    {currentUserApplication.bio}
                  </p>
                </div>

                {/* Uploaded Evidence Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Workshop Photo */}
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE7DC] space-y-2">
                    <span className="text-[#8A7E72] block text-[10px] font-bold uppercase tracking-wider">
                      Studio Workshop Proof
                    </span>
                    {currentUserApplication.workshopPhotoUrl ? (
                      <img
                        src={currentUserApplication.workshopPhotoUrl}
                        alt="Workshop Proof"
                        className="w-full h-36 object-cover rounded-lg border border-[#E8DEC8]"
                      />
                    ) : (
                      <div className="h-24 bg-[#F2EDE4] rounded-lg flex items-center justify-center text-xs text-[#8A7E72] italic">
                        No workshop image uploaded
                      </div>
                    )}
                    <p className="text-[11px] text-[#645D56] truncate">
                      {currentUserApplication.workshopAddress || `${currentUserApplication.location} Workshop`}
                    </p>
                  </div>

                  {/* Flagship Sample Artifact */}
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EFE7DC] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8A7E72] text-[10px] font-bold uppercase tracking-wider">
                        Flagship Sample Artifact
                      </span>
                      {currentUserApplication.samplePrice && (
                        <span className="text-[#6B7A52] font-bold text-xs">
                          ${currentUserApplication.samplePrice}
                        </span>
                      )}
                    </div>
                    {currentUserApplication.sampleImageUrl ? (
                      <img
                        src={currentUserApplication.sampleImageUrl}
                        alt="Sample Artifact Proof"
                        className="w-full h-36 object-cover rounded-lg border border-[#E8DEC8]"
                      />
                    ) : (
                      <div className="h-24 bg-[#F2EDE4] rounded-lg flex items-center justify-center text-xs text-[#8A7E72] italic">
                        No sample image uploaded
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-[#28231F] truncate">
                        {currentUserApplication.sampleTitle || `${currentUserApplication.shopName} Sample`}
                      </p>
                      <p className="text-[11px] text-[#8A7E72] truncate">
                        {currentUserApplication.sampleMaterials || 'Studio Materials'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banking Verification Details */}
                <div className="p-3 bg-[#F8F4EE] rounded-xl border border-[#E4D9C4] text-[11px] text-[#645D56] flex flex-wrap gap-4 items-center">
                  <div className="font-semibold text-[#28231F] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#6B7A52]" />
                    <span>Bank: {currentUserApplication.bankDetails?.bankName}</span>
                  </div>
                  <div>Beneficiary: <strong>{currentUserApplication.bankDetails?.accountHolder}</strong></div>
                  <div>Routing: <span className="font-medium text-[#2A2521]">{currentUserApplication.bankDetails?.routingNumber}</span></div>
                  <div>Account ending: <span className="font-medium text-[#2A2521]">•••• {currentUserApplication.bankDetails?.accountNumberLast4}</span></div>
                </div>
              </div>
            </div>
          ) : (
            /* Case 3: 5-Stage Stepper Funnel */
            <div>
              {/* Reapply Banner if in reapplication mode */}
              {isReapplying && currentUserApplication && (
                <div className="p-4 mb-5 rounded-2xl bg-[#FFF8F0] border border-[#E8DEC8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A86F47] flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Revised Application Mode
                    </span>
                    <p className="text-xs text-[#28231F] mt-0.5">
                      Revise your studio details according to the admin feedback and submit for re-review.
                    </p>
                    {currentUserApplication.adminNotes && (
                      <p className="text-[11px] text-red-700 mt-1 italic">
                        <strong>Admin Feedback:</strong> {currentUserApplication.adminNotes}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReapplying(false)}
                    className="px-3 py-1.5 rounded-xl border border-[#D5C7B5] bg-white hover:bg-[#F8F4EE] text-xs font-semibold text-[#28231F] shrink-0 cursor-pointer"
                  >
                    View Application Details
                  </button>
                </div>
              )}

              {localError && (
                <div className="p-3.5 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{localError}</span>
                </div>
              )}

              {/* STEP 1: CRAFT IDENTITY & PROFILE */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="border-b border-[#E8DEC8] pb-3">
                    <h4 className="font-serif text-xl font-bold text-[#28231F]">Step 1: Brand & Craft Identity</h4>
                    <p className="text-xs text-[#645D56]">Tell us about your studio brand, primary materials, and artisanal heritage.</p>
                  </div>

                  {/* Guest User Account Section */}
                  {!currentUser && (
                    <div className="p-4 rounded-2xl bg-[#F6EDE6]/60 border border-[#E8DEC8] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#28231F]">Artisan Account Credentials</span>
                        <button
                          type="button"
                          onClick={() => setAuthMode(authMode === 'create' ? 'login' : 'create')}
                          className="text-[11px] text-[#A86F47] hover:underline font-semibold"
                        >
                          {authMode === 'create' ? 'Already registered? Sign in' : 'New artisan? Register here'}
                        </button>
                      </div>

                      {authMode === 'create' && (
                        <div>
                          <label className="text-[11px] font-semibold text-[#645D56] block mb-1">Your Full Name</label>
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="e.g. Elena Rostova"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#645D56] block mb-1">Email Address</label>
                          <input
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="elena@clayworkshop.com"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#645D56] block mb-1">Password</label>
                          <input
                            type="password"
                            value={guestPassword}
                            onChange={(e) => setGuestPassword(e.target.value)}
                            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Studio / Shop Name *</label>
                      <input
                        type="text"
                        value={formData.shopName}
                        onChange={(e) => updateField('shopName', e.target.value)}
                        placeholder="e.g. Terracotta & Ember Studio"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Craft Discipline *</label>
                      <select
                        value={formData.craftCategory}
                        onChange={(e) => updateField('craftCategory', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      >
                        {craftCategories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#28231F] block mb-1">Tagline or Craft Motto</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => updateField('tagline', e.target.value)}
                      placeholder="e.g. Wheel-thrown stoneware fired with organic wood ash"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Workshop City & Country *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="e.g. Kyoto, Japan or Sedona, AZ"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Artisan Direct Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+1 (555) 234-5678"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#28231F] block mb-1">Artisan Story & Provenance *</label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Describe your techniques, apprenticeships, kiln firing methods, or lineage..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47] resize-none"
                    />
                    <span className="text-[10px] text-[#8A7E72] block mt-1">Minimum 20 characters required.</span>
                  </div>
                </div>
              )}

              {/* STEP 2: WORKSHOP PROVENANCE & VERIFICATION */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="border-b border-[#E8DEC8] pb-3">
                    <h4 className="font-serif text-xl font-bold text-[#28231F]">Step 2: Studio & Provenance Verification</h4>
                    <p className="text-xs text-[#645D56]">Our curators verify that all items are 100% created by human artisans in real workshops.</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#28231F] block mb-1">Workshop Physical Address</label>
                    <input
                      type="text"
                      value={formData.workshopAddress}
                      onChange={(e) => updateField('workshopAddress', e.target.value)}
                      placeholder="144 Clay Lane, Kyoto Studio 4"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Years Practicing Craft</label>
                      <select
                        value={formData.yearsOfExperience}
                        onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      >
                        <option value="1-2 years">1-2 years (Emerging Artisan)</option>
                        <option value="3-5 years">3-5 years (Practicing Maker)</option>
                        <option value="6-10 years">6-10 years (Established Craftsman)</option>
                        <option value="10+ years">10+ years (Master Guild Artisan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Portfolio or Social URL</label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => updateField('portfolioUrl', e.target.value)}
                        placeholder="https://instagram.com/yourstudiocraft"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploadField
                      label="Workshop or Studio Photograph"
                      value={formData.workshopPhotoUrl}
                      onChange={(val) => updateField('workshopPhotoUrl', val)}
                      helperText="Upload a photo of your workbench, kiln, or workshop from your device (PNG, JPG, AVIF, WEBP) or paste an image URL to verify authentic tooling."
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: INITIAL SAMPLE WORK */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="border-b border-[#E8DEC8] pb-3">
                    <h4 className="font-serif text-xl font-bold text-[#28231F]">Step 3: Sample Work Submission</h4>
                    <p className="text-xs text-[#645D56]">Submit an initial flagship piece for catalog curation and 3D craft studio matching.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Artifact Title *</label>
                      <input
                        type="text"
                        value={formData.sampleTitle}
                        onChange={(e) => updateField('sampleTitle', e.target.value)}
                        placeholder="e.g. Wabi-Sabi Stoneware Tea Bowl"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Target Price (USD) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <input
                          type="number"
                          value={formData.samplePrice}
                          onChange={(e) => updateField('samplePrice', Number(e.target.value))}
                          className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Materials Used *</label>
                      <input
                        type="text"
                        value={formData.sampleMaterials}
                        onChange={(e) => updateField('sampleMaterials', e.target.value)}
                        placeholder="e.g. Coarse Japanese Stoneware, Natural Feldspar"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Crafting Lead Time</label>
                      <input
                        type="text"
                        value={formData.sampleLeadTime}
                        onChange={(e) => updateField('sampleLeadTime', e.target.value)}
                        placeholder="Made to order (3-5 days)"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#28231F] block mb-1">Artifact Description & Technique *</label>
                    <textarea
                      rows={2}
                      value={formData.sampleDescription}
                      onChange={(e) => updateField('sampleDescription', e.target.value)}
                      placeholder="Wheel-thrown and trimmed by hand, fired in a wood-burning kiln for 48 hours..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47] resize-none"
                    />
                  </div>

                  <div>
                    <ImageUploadField
                      label="Sample Artifact Photo"
                      value={formData.sampleImageUrl}
                      onChange={(val) => updateField('sampleImageUrl', val)}
                      helperText="Upload a flagship craft artifact photo from your device (PNG, JPG, AVIF, WEBP) or paste an image link."
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: BANKING & FINANCIAL SETUP */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="border-b border-[#E8DEC8] pb-3">
                    <h4 className="font-serif text-xl font-bold text-[#28231F]">Step 4: Banking & Direct Payout Details</h4>
                    <p className="text-xs text-[#645D56]">You retain 95% of every sale. Payouts are dispatched directly to your designated bank account.</p>
                  </div>

                  <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#E8DEC8] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#28231F] font-semibold">
                      <ShieldCheck className="w-4 h-4 text-[#6B7A52]" />
                      <span>Platform Commission Rate:</span>
                    </div>
                    <span className="font-bold text-[#A86F47] bg-[#F6EDE6] px-2.5 py-1 rounded-lg border border-[#E8DEC8]">
                      5% (Artisan Net: 95%)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Bank Name *</label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => updateField('bankName', e.target.value)}
                        placeholder="e.g. JPMorgan Chase, Barclays"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Account Holder Full Legal Name *</label>
                      <input
                        type="text"
                        value={formData.accountHolder}
                        onChange={(e) => updateField('accountHolder', e.target.value)}
                        placeholder="Legal individual or business name"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Routing Number / Sort Code *</label>
                      <input
                        type="text"
                        value={formData.routingNumber}
                        onChange={(e) => updateField('routingNumber', e.target.value)}
                        placeholder="9 digits (e.g. 122000496)"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#28231F] block mb-1">Account Number (Ending 4 required) *</label>
                      <input
                        type="password"
                        value={formData.accountNumberLast4}
                        onChange={(e) => updateField('accountNumberLast4', e.target.value)}
                        placeholder="Account number"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: CRAFT STANDARDS PLEDGE */}
              {currentStep === 5 && (
                <div className="space-y-5">
                  <div className="border-b border-[#E8DEC8] pb-3">
                    <h4 className="font-serif text-xl font-bold text-[#28231F]">Step 5: Artisan Code of Craftsmanship</h4>
                    <p className="text-xs text-[#645D56]">The gold standard of Artisanâ€™s Corner: pure craft, zero mass reproduction.</p>
                  </div>

                  {/* Summary Review Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8] space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold text-[#28231F]">
                      <span>{formData.shopName || 'Artisan Studio'}</span>
                      <span className="text-[#A86F47]">{formData.craftCategory}</span>
                    </div>
                    <p className="text-[#645D56] italic">"{formData.tagline || 'Handcrafted Excellence'}"</p>
                    <div className="text-[11px] text-[#8A7E72] pt-2 border-t border-[#E8DEC8]">
                      Workshop: <strong>{formData.location}</strong> â€¢ Flagship Piece: <strong>{formData.sampleTitle || 'Sample Work'} (${formData.samplePrice})</strong>
                    </div>
                  </div>

                  {/* Pledge Checkboxes */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-3 p-3 rounded-2xl border border-[#DDD1BE] bg-white cursor-pointer hover:border-[#A86F47] transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.pledgeSigned}
                        onChange={(e) => updateField('pledgeSigned', e.target.checked)}
                        className="mt-0.5 rounded text-[#A86F47] focus:ring-[#A86F47]"
                      />
                      <div className="text-xs text-[#28231F]">
                        <strong className="block mb-0.5 font-semibold">100% Handcrafted & Human-Directed Pledge</strong>
                        I certify that all works sold through my studio are handmade, wheel-thrown, forged, carved, or personally assembled by myself or direct studio assistants. No mass-produced dropshipping.
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-2xl border border-[#DDD1BE] bg-white cursor-pointer hover:border-[#A86F47] transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) => updateField('termsAccepted', e.target.checked)}
                        className="mt-0.5 rounded text-[#A86F47] focus:ring-[#A86F47]"
                      />
                      <div className="text-xs text-[#28231F]">
                        <strong className="block mb-0.5 font-semibold">Terms of Commercial Fair Play & Payout Protocol</strong>
                        I agree to the 5% platform curation fee and agree to dispatch orders within the declared crafting lead times with genuine tracking numbers.
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="mt-8 pt-5 border-t border-[#E8DEC8] flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DDD1BE] text-xs sm:text-sm font-semibold text-[#28231F] hover:bg-[#F4EEE6] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsBecomeSellerOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#8A7E72] hover:text-[#28231F] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleStepNext}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting || !formData.pledgeSigned || !formData.termsAccepted}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#6B7A52] hover:bg-[#586543] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit for Verification</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};