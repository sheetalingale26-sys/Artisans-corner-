import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SellerOnboardingFormData {
  // Step 1: Craft Identity
  shopName: string;
  tagline: string;
  craftCategory: string;
  bio: string;
  phone: string;
  location: string;
  
  // Step 2: Workshop & Provenance
  workshopAddress: string;
  workshopPhotoUrl: string;
  portfolioUrl: string;
  yearsOfExperience: string;
  
  // Step 3: First Sample Listing
  sampleTitle: string;
  samplePrice: number;
  sampleCategory: string;
  sampleDescription: string;
  sampleMaterials: string;
  sampleImageUrl: string;
  sampleLeadTime: string;
  
  // Step 4: Banking & Payouts
  bankName: string;
  accountHolder: string;
  routingNumber: string;
  accountNumberLast4: string;
  
  // Step 5: Pledge
  pledgeSigned: boolean;
  termsAccepted: boolean;
}

interface SellerOnboardingState {
  currentStep: number; // 1 to 5
  formData: SellerOnboardingFormData;
  isSubmitting: boolean;
  isCompleted: boolean;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateField: <K extends keyof SellerOnboardingFormData>(field: K, value: SellerOnboardingFormData[K]) => void;
  updateMultipleFields: (fields: Partial<SellerOnboardingFormData>) => void;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  setCompleted: (completed: boolean) => void;
}

const INITIAL_FORM_DATA: SellerOnboardingFormData = {
  shopName: '',
  tagline: '',
  craftCategory: 'Ceramics & Pottery',
  bio: '',
  phone: '',
  location: '',
  workshopAddress: '',
  workshopPhotoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
  portfolioUrl: '',
  yearsOfExperience: '3-5 years',
  sampleTitle: '',
  samplePrice: 95,
  sampleCategory: 'Ceramics & Pottery',
  sampleDescription: '',
  sampleMaterials: 'Stoneware Clay, Wood Ash Glaze',
  sampleImageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
  sampleLeadTime: 'Made to order (3-5 days)',
  bankName: '',
  accountHolder: '',
  routingNumber: '',
  accountNumberLast4: '',
  pledgeSigned: false,
  termsAccepted: false,
};

export const useSellerOnboardingStore = create<SellerOnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: INITIAL_FORM_DATA,
      isSubmitting: false,
      isCompleted: false,

      setStep: (step) => set({ currentStep: Math.max(1, Math.min(5, step)) }),

      nextStep: () => set((state) => ({ currentStep: Math.min(5, state.currentStep + 1) })),

      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

      updateField: (field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),

      updateMultipleFields: (fields) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...fields,
          },
        })),

      resetForm: () =>
        set({
          currentStep: 1,
          formData: INITIAL_FORM_DATA,
          isSubmitting: false,
          isCompleted: false,
        }),

      setSubmitting: (isSubmitting) => set({ isSubmitting }),

      setCompleted: (isCompleted) => set({ isCompleted }),
    }),
    {
      name: 'artisans-corner-seller-onboarding',
    }
  )
);