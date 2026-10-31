import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Product,
  SellerProfile,
  Order,
  OrderItem,
  OrderStatus,
  Review,
  Payout,
  CommissionRecord,
  CartItem,
  CraftModelType,
  SellerApplication
} from '../types';
import {
  SEED_USERS,
  SEED_SELLERS,
  SEED_PRODUCTS,
  SEED_REVIEWS,
  SEED_ORDERS,
  SEED_PAYOUTS,
  SEED_COMMISSIONS,
  SEED_SELLER_APPLICATIONS
} from '../data/seedData';
import { auth, db, googleProvider, initAnalytics } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export const AUTHORIZED_ADMIN_EMAILS = [
  'admin@artisanscorner.org',
  'marcus.vance@artisanscorner.org',
  'director@artisanscorner.org',
  'admin@artisans-corner.com',
  'sheetalingale26@gmail.com'
];

interface AppContextType {
  // Current user & authentication
  currentUser: User | null;
  currentRole: UserRole;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  isSellerApproved: boolean;
  isAdmin: boolean;
  AUTHORIZED_ADMIN_EMAILS: string[];

  // Users management
  users: User[];
  toggleUserStatus: (userId: string) => void;

  // Seller Applications & Onboarding
  sellerApplications: SellerApplication[];
  currentUserApplication: SellerApplication | undefined;
  applyToBecomeSeller: (
    data: Omit<SellerApplication, 'id' | 'userId' | 'userName' | 'userEmail' | 'submittedAt' | 'status'>
  ) => Promise<{ success: boolean; error?: string }>;
  approveSellerApplication: (applicationId: string) => void;
  rejectSellerApplication: (applicationId: string, feedback?: string) => void;
  isBecomeSellerOpen: boolean;
  setIsBecomeSellerOpen: (open: boolean) => void;

  // Sellers
  sellers: SellerProfile[];
  currentSellerProfile: SellerProfile | undefined;
  updateSellerProfile: (updated: Partial<SellerProfile>) => void;
  updateSellerVerification: (sellerId: string, status: 'verified' | 'pending' | 'rejected') => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartCommissionEstimate: number; // 5% fee included in sale

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Orders
  orders: Order[];
  buyerOrders: Order[];
  placeOrder: (shippingAddress: Order['shippingAddress']) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (
    review: Omit<Review, 'id' | 'createdAt' | 'buyerId' | 'buyerName' | 'buyerAvatar' | 'verifiedPurchase'>
  ) => void;
  getProductReviews: (productId: string) => Review[];

  // Payouts & Commissions
  payouts: Payout[];
  commissions: CommissionRecord[];
  requestPayout: (amount: number, method: string) => boolean;
  processPayout: (payoutId: string, approved: boolean) => void;

  // 3D Studio inspection state
  active3DModel: CraftModelType;
  setActive3DModel: (model: CraftModelType) => void;
  open3DStudioWithModel: (model: CraftModelType) => void;

  // Active view navigation
  activeTab: 'marketplace' | 'studio' | 'orders' | 'seller-dashboard' | 'admin-dashboard' | 'wishlist' | 'login' | 'register';
  setActiveTab: (tab: 'marketplace' | 'studio' | 'orders' | 'seller-dashboard' | 'admin-dashboard' | 'wishlist' | 'login' | 'register') => void;

  // Selected product detail modal
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  // Cart slideover
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Auth Modal (optional quick modal)
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'artisans_corner_auth_user_v2',
  USERS: 'artisans_corner_users_v2',
  CURRENT_ROLE: 'artisans_corner_role_v2',
  SELLERS: 'artisans_corner_sellers_v2',
  SELLER_APPLICATIONS: 'artisans_corner_seller_apps_v2',
  PRODUCTS: 'artisans_corner_products_v2',
  CART: 'artisans_corner_cart_v2',
  ORDERS: 'artisans_corner_orders_v2',
  REVIEWS: 'artisans_corner_reviews_v2',
  PAYOUTS: 'artisans_corner_payouts_v2',
  COMMISSIONS: 'artisans_corner_commissions_v2',
  WISHLIST: 'artisans_corner_wishlist_v2'
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const getCategoryWorkshopDefault = (category?: string) => {
  switch (category) {
    case 'Ceramics & Pottery':
      return 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80';
    case 'Woodwork & Carving':
      return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80';
    case 'Jewelry & Metals':
      return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80';
    case 'Textiles & Weaving':
    case 'Textiles & Fiber Art':
      return 'https://images.unsplash.com/photo-1596464716127-f2a829822321?auto=format&fit=crop&w=1000&q=80';
    case 'Glassblowing & Stained Glass':
      return 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80';
    case 'Leathercraft & Bookbinding':
      return 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80';
    default:
      return 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80';
  }
};

export const getCategorySampleDefault = (category?: string) => {
  switch (category) {
    case 'Ceramics & Pottery':
      return 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80';
    case 'Woodwork & Carving':
      return 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80';
    case 'Jewelry & Metals':
      return 'https://images.unsplash.com/photo-1611591475152-4735492d352b?auto=format&fit=crop&w=1000&q=80';
    case 'Textiles & Weaving':
    case 'Textiles & Fiber Art':
      return 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80';
    case 'Glassblowing & Stained Glass':
      return 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80';
    case 'Leathercraft & Bookbinding':
      return 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80';
    default:
      return 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80';
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const cached = loadStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    // Ensure any new seed users (like newly added admins) are present even if storage already exists
    const merged = [...cached];
    for (const seedU of SEED_USERS) {
      if (!merged.some((u) => u.email.toLowerCase() === seedU.email.toLowerCase())) {
        merged.push(seedU);
      }
    }
    return merged;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = loadStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (cached) return cached;
    // Default to the first buyer user if available to enable seamless preview, or null
    return SEED_USERS[0];
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const role = loadStorage<UserRole>(STORAGE_KEYS.CURRENT_ROLE, 'buyer');
    return role;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [sellers, setSellers] = useState<SellerProfile[]>(() => loadStorage(STORAGE_KEYS.SELLERS, SEED_SELLERS));
  const [sellerApplications, setSellerApplications] = useState<SellerApplication[]>(() => {
    const raw = loadStorage<SellerApplication[]>(STORAGE_KEYS.SELLER_APPLICATIONS, SEED_SELLER_APPLICATIONS);
    
    // Retrieve any persisted onboarding form data from Zustand store
    let onboardingData: any = null;
    try {
      const persisted = localStorage.getItem('artisans-corner-seller-onboarding');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        onboardingData = parsed?.state?.formData;
      }
    } catch {}

    return raw.map((app) => {
      const isMatchingOnboarding = onboardingData && (
        (onboardingData.shopName && onboardingData.shopName.toLowerCase() === app.shopName.toLowerCase()) ||
        (onboardingData.craftCategory === app.craftCategory)
      );

      const workshopPhotoUrl = app.workshopPhotoUrl || 
        (isMatchingOnboarding && onboardingData?.workshopPhotoUrl) || 
        getCategoryWorkshopDefault(app.craftCategory);

      const sampleImageUrl = app.sampleImageUrl || 
        (isMatchingOnboarding && onboardingData?.sampleImageUrl) || 
        getCategorySampleDefault(app.craftCategory);

      const userMatch = SEED_USERS.find((u) => u.id === app.userId || u.email === app.userEmail);
      const userAvatar = app.userAvatar || userMatch?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

      return {
        ...app,
        userAvatar,
        workshopPhotoUrl,
        sampleImageUrl,
        workshopAddress: app.workshopAddress || (isMatchingOnboarding && onboardingData?.workshopAddress) || `${app.location} Artisan Workshop`,
        yearsOfExperience: app.yearsOfExperience || (isMatchingOnboarding && onboardingData?.yearsOfExperience) || '3-5 years',
        sampleTitle: app.sampleTitle || (isMatchingOnboarding && onboardingData?.sampleTitle) || `${app.shopName} Signature Work`,
        samplePrice: app.samplePrice || (isMatchingOnboarding && Number(onboardingData?.samplePrice)) || 95,
        sampleCategory: app.sampleCategory || app.craftCategory,
        sampleDescription: app.sampleDescription || (isMatchingOnboarding && onboardingData?.sampleDescription) || app.bio,
        sampleMaterials: app.sampleMaterials || (isMatchingOnboarding && onboardingData?.sampleMaterials) || 'Hand-selected studio materials',
        sampleLeadTime: app.sampleLeadTime || (isMatchingOnboarding && onboardingData?.sampleLeadTime) || 'Made to order (3-5 days)'
      };
    });
  });
  const [products, setProducts] = useState<Product[]>(() => loadStorage(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS));
  const [cart, setCart] = useState<CartItem[]>(() => loadStorage(STORAGE_KEYS.CART, []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadStorage(STORAGE_KEYS.WISHLIST, ['prod-1']));
  const [orders, setOrders] = useState<Order[]>(() => loadStorage(STORAGE_KEYS.ORDERS, SEED_ORDERS));
  const [reviews, setReviews] = useState<Review[]>(() => loadStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS));
  const [payouts, setPayouts] = useState<Payout[]>(() => loadStorage(STORAGE_KEYS.PAYOUTS, SEED_PAYOUTS));
  const [commissions, setCommissions] = useState<CommissionRecord[]>(() =>
    loadStorage(STORAGE_KEYS.COMMISSIONS, SEED_COMMISSIONS)
  );

  const [activeTab, setActiveTab] = useState<
    'marketplace' | 'studio' | 'orders' | 'seller-dashboard' | 'admin-dashboard' | 'wishlist' | 'login' | 'register'
  >('marketplace');
  const [active3DModel, setActive3DModel] = useState<CraftModelType>('amphora-vase');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBecomeSellerOpen, setIsBecomeSellerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Helper: Save/update user document in Firestore
  const saveUserToFirestore = async (userData: User) => {
    try {
      if (!userData || !userData.id) return;
      const userRef = doc(db, 'users', userData.id);
      await setDoc(
        userRef,
        {
          uid: userData.id,
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'buyer',
          avatar: userData.avatar || '',
          isSellerApproved: Boolean(userData.isSellerApproved),
          sellerProfileId: userData.sellerProfileId || null,
          joinedDate: userData.joinedDate || new Date().toISOString().split('T')[0],
          status: userData.status || 'active',
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Failed to save user to Firestore:', err);
    }
  };

  // Initialize Firebase Analytics once on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const emailLower = (firebaseUser.email || '').toLowerCase().trim();
        // Check if user already exists in storage or is an authorized admin
        const isAuthorizedAdmin = AUTHORIZED_ADMIN_EMAILS.includes(emailLower);
        const matched = users.find((u) => u.email.toLowerCase() === emailLower || u.id === firebaseUser.uid);

        if (matched) {
          const updatedUser: User = {
            ...matched,
            name: firebaseUser.displayName || matched.name,
            avatar: firebaseUser.photoURL || matched.avatar,
            role: isAuthorizedAdmin ? 'admin' : matched.role
          };
          setCurrentUser(updatedUser);
          await saveUserToFirestore(updatedUser);
          if (updatedUser.role === 'admin') {
            setCurrentRole('admin');
          } else if (updatedUser.isSellerApproved && currentRole === 'seller') {
            setCurrentRole('seller');
          } else {
            setCurrentRole('buyer');
          }
        } else {
          // Create new user profile from Firebase User
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Artisan Guest',
            email: firebaseUser.email || '',
            role: isAuthorizedAdmin ? 'admin' : 'buyer',
            isSellerApproved: false,
            avatar:
              firebaseUser.photoURL ||
              `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
            joinedDate: new Date().toISOString().split('T')[0],
            status: 'active'
          };
          setUsers((prev) => [newUser, ...prev]);
          setCurrentUser(newUser);
          setCurrentRole(newUser.role);
          await saveUserToFirestore(newUser);
          if (newUser.role === 'admin') {
            setActiveTab('admin-dashboard');
          }
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [users, currentRole]);

  // Persist critical state to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => saveStorage(STORAGE_KEYS.CURRENT_USER, currentUser), [currentUser]);
  useEffect(() => saveStorage(STORAGE_KEYS.CURRENT_ROLE, currentRole), [currentRole]);
  useEffect(() => saveStorage(STORAGE_KEYS.SELLERS, sellers), [sellers]);
  useEffect(() => saveStorage(STORAGE_KEYS.SELLER_APPLICATIONS, sellerApplications), [sellerApplications]);
  useEffect(() => saveStorage(STORAGE_KEYS.PRODUCTS, products), [products]);
  useEffect(() => saveStorage(STORAGE_KEYS.CART, cart), [cart]);
  useEffect(() => saveStorage(STORAGE_KEYS.WISHLIST, wishlist), [wishlist]);
  useEffect(() => saveStorage(STORAGE_KEYS.ORDERS, orders), [orders]);
  useEffect(() => saveStorage(STORAGE_KEYS.REVIEWS, reviews), [reviews]);
  useEffect(() => saveStorage(STORAGE_KEYS.PAYOUTS, payouts), [payouts]);
  useEffect(() => saveStorage(STORAGE_KEYS.COMMISSIONS, commissions), [commissions]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Find seller application for current user
  const currentUserApplication: SellerApplication | undefined = sellerApplications.find(
    (a) => a.userId === currentUser?.id || a.userEmail.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  // Derive role capabilities
  const isEmailAdmin = Boolean(
    currentUser?.email && AUTHORIZED_ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim())
  );
  const isAdmin = currentUser?.role === 'admin' || isEmailAdmin || currentRole === 'admin';
  const isSellerApproved = Boolean(
    currentUser &&
    (!currentUserApplication || currentUserApplication.status === 'approved') &&
    (currentUser.isSellerApproved || currentUser.sellerProfileId || currentUser.role === 'seller')
  );

  // Find seller profile for current user
  const currentSellerProfile: SellerProfile | undefined = sellers.find(
    (s) => s.userId === currentUser?.id || (currentUser?.sellerProfileId && s.id === currentUser.sellerProfileId)
  );

  // Orders filtered specifically for current logged-in buyer
  const buyerOrders: Order[] = currentUser
    ? orders.filter(
        (o) => o.buyerId === currentUser.id || o.buyerEmail.toLowerCase() === currentUser.email.toLowerCase()
      )
    : [];


  // Login action using Firebase Authentication with local sync
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthLoading(true);
      const emailClean = email.trim();

      let firebaseUid: string | null = null;
      let displayName: string | null = null;

      try {
        const cred = await signInWithEmailAndPassword(auth, emailClean, password);
        firebaseUid = cred.user.uid;
        displayName = cred.user.displayName;
      } catch (fbErr: any) {
        console.warn('Firebase signIn attempt:', fbErr.message);
        // If user is already registered in local storage or is a pre-existing authorized admin/seller
        const localMatch = users.find((u) => u.email.toLowerCase() === emailClean.toLowerCase());
        if (!localMatch) {
          let errorMsg = 'Invalid email or password.';
          if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
            errorMsg = 'No account found with these credentials. Please check your details or register.';
          } else if (fbErr.code === 'auth/wrong-password') {
            errorMsg = 'Incorrect password. Please try again.';
          } else if (fbErr.code === 'auth/invalid-email') {
            errorMsg = 'Please provide a valid email address.';
          }
          return { success: false, error: errorMsg };
        } else {
          // If signing into a seeded admin account locally, allow password 123456
          if (password !== '123456' && password.length < 6) {
            return { success: false, error: 'Incorrect password. Please try again.' };
          }
        }
      }

      // Identify user from list
      const matched = users.find((u) => u.email.toLowerCase() === emailClean.toLowerCase());
      const isAuthorizedAdmin = AUTHORIZED_ADMIN_EMAILS.includes(emailClean.toLowerCase());

      if (matched) {
        if (matched.status === 'suspended') {
          return { success: false, error: 'Your account has been suspended. Please contact platform administration.' };
        }
        // Retrieve latest seller application matching user
        const matchedApp = sellerApplications.find(
          (a) => a.userId === matched.id || a.userEmail.toLowerCase() === matched.email.toLowerCase()
        );
        const isApprovedSeller = matchedApp
          ? matchedApp.status === 'approved'
          : Boolean(matched.isSellerApproved || matched.sellerProfileId);

        const userToSet: User = {
          ...matched,
          role: isAuthorizedAdmin ? 'admin' : isApprovedSeller ? 'seller' : 'buyer',
          isSellerApproved: isApprovedSeller,
          sellerApplication: matchedApp || matched.sellerApplication
        };
        setCurrentUser(userToSet);
        // Save user data to Firestore
        await saveUserToFirestore(userToSet);

        if (userToSet.role === 'admin' || isAuthorizedAdmin) {
          setCurrentRole('admin');
          setActiveTab('admin-dashboard');
        } else if (userToSet.isSellerApproved) {
          setCurrentRole('seller');
          setActiveTab('seller-dashboard');
        } else {
          setCurrentRole('buyer');
          setActiveTab('marketplace');
        }
        showToast(`Welcome back, ${userToSet.name}!`, 'success');
        return { success: true };
      }

      // If registered through Firebase but new to this device
      const newUser: User = {
        id: firebaseUid || `user-${Date.now()}`,
        name: displayName || emailClean.split('@')[0],
        email: emailClean,
        role: isAuthorizedAdmin ? 'admin' : 'buyer',
        isSellerApproved: false,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setCurrentRole(newUser.role);
      setActiveTab(newUser.role === 'admin' ? 'admin-dashboard' : 'marketplace');

      // Save new user data to Firestore
      await saveUserToFirestore(newUser);

      showToast(`Welcome to Artisan’s Corner, ${newUser.name}!`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'An unexpected error occurred during login.' };
    } finally {
      setAuthLoading(false);
    }
  };

  // Register action strictly for Buyer account with validation
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthLoading(true);
      const nameClean = name.trim();
      const emailClean = email.trim();

      if (!nameClean) return { success: false, error: 'Please enter your full name.' };
      if (!emailClean || !emailClean.includes('@')) return { success: false, error: 'Please enter a valid email address.' };
      if (!password || password.length < 6) return { success: false, error: 'Password must be at least 6 characters long.' };

      // Ensure user does not already exist locally
      const existing = users.find((u) => u.email.toLowerCase() === emailClean.toLowerCase());
      if (existing) {
        return { success: false, error: 'An account with this email address already exists. Please log in.' };
      }

      let firebaseUid: string | null = null;
      try {
        const cred = await createUserWithEmailAndPassword(auth, emailClean, password);
        firebaseUid = cred.user.uid;
        await updateProfile(cred.user, { displayName: nameClean });
      } catch (fbErr: any) {
        console.warn('Firebase registration notice:', fbErr.message);
        if (fbErr.code === 'auth/email-already-in-use') {
          return { success: false, error: 'This email is already in use. Please sign in instead.' };
        }
      }

      // Check if this registered email is in the authorized admin list
      const isAuthorizedAdmin = AUTHORIZED_ADMIN_EMAILS.includes(emailClean.toLowerCase());

      const newUser: User = {
        id: firebaseUid || `user-${Date.now()}`,
        name: nameClean,
        email: emailClean,
        role: isAuthorizedAdmin ? 'admin' : 'buyer',
        isSellerApproved: false,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setCurrentRole(newUser.role);
      setActiveTab(newUser.role === 'admin' ? 'admin-dashboard' : 'marketplace');

      // Save new user data to Firestore
      await saveUserToFirestore(newUser);

      showToast(`Account created successfully! Welcome to Artisan’s Corner, ${nameClean}.`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'An unexpected error occurred during registration.' };
    } finally {
      setAuthLoading(false);
    }
  };

  // Google Sign-In
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const emailClean = (firebaseUser.email || '').toLowerCase().trim();
      const isAuthorizedAdmin = AUTHORIZED_ADMIN_EMAILS.includes(emailClean);

      // Check if user already exists locally
      const matched = users.find((u) => u.email.toLowerCase() === emailClean || u.id === firebaseUser.uid);

      if (matched) {
        if (matched.status === 'suspended') {
          return { success: false, error: 'Your account has been suspended. Please contact platform administration.' };
        }
        const matchedApp = sellerApplications.find(
          (a) => a.userId === matched.id || a.userEmail.toLowerCase() === matched.email.toLowerCase()
        );
        const isApprovedSeller = matchedApp
          ? matchedApp.status === 'approved'
          : Boolean(matched.isSellerApproved || matched.sellerProfileId);

        const userToSet: User = {
          ...matched,
          id: firebaseUser.uid,
          name: firebaseUser.displayName || matched.name,
          avatar: firebaseUser.photoURL || matched.avatar,
          role: isAuthorizedAdmin ? 'admin' : isApprovedSeller ? 'seller' : matched.role,
          isSellerApproved: isApprovedSeller,
        };
        setCurrentUser(userToSet);
        await saveUserToFirestore(userToSet);

        if (userToSet.role === 'admin' || isAuthorizedAdmin) {
          setCurrentRole('admin');
          setActiveTab('admin-dashboard');
        } else if (userToSet.isSellerApproved) {
          setCurrentRole('seller');
          setActiveTab('seller-dashboard');
        } else {
          setCurrentRole('buyer');
          setActiveTab('marketplace');
        }
        showToast(`Welcome back, ${userToSet.name}!`, 'success');
        return { success: true };
      }

      // New Google user
      const newUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || emailClean.split('@')[0],
        email: emailClean,
        role: isAuthorizedAdmin ? 'admin' : 'buyer',
        isSellerApproved: false,
        avatar: firebaseUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setCurrentRole(newUser.role);
      setActiveTab(newUser.role === 'admin' ? 'admin-dashboard' : 'marketplace');

      // Save new user data to Firestore
      await saveUserToFirestore(newUser);


      // Save to Firestore
      await saveUserToFirestore(newUser);

      showToast(`Welcome to Artisan's Corner, ${newUser.name}!`, 'success');
      return { success: true };
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in popup was closed. Please try again.' };
      }
      return { success: false, error: err.message || 'Google sign-in failed. Please try again.' };
    } finally {
      setAuthLoading(false);
    }
  };

  // Secure Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('SignOut warning:', err);
    }
    setCurrentUser(null);
    setCurrentRole('buyer');
    setActiveTab('marketplace');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showToast('You have been securely signed out.', 'info');
  };

  // Role perspective switching
  const switchRole = (newRole: UserRole) => {
    if (!currentUser) {
      showToast('Please sign in to access personalized dashboards', 'warning');
      setActiveTab('login');
      return;
    }

    if (newRole === 'admin') {
      if (!isAdmin) {
        showToast('Access Restricted: Platform Admin authorization required', 'error');
        return;
      }
      setCurrentRole('admin');
      setActiveTab('admin-dashboard');
      showToast('Admin Executive Console active', 'info');
      return;
    }

    if (newRole === 'seller') {
      if (!isSellerApproved) {
        showToast('Artisan Studio access requires an approved seller account. Apply below!', 'warning');
        setIsBecomeSellerOpen(true);
        return;
      }
      setCurrentRole('seller');
      setActiveTab('seller-dashboard');
      showToast(`Artisan Studio active: ${currentSellerProfile?.shopName || currentUser.name}`, 'info');
      return;
    }

    // Default to Buyer view
    setCurrentRole('buyer');
    setActiveTab('marketplace');
    showToast(`Switched to Buyer Marketplace: ${currentUser.name}`, 'info');
  };

  // Apply to become a seller
  const applyToBecomeSeller = async (
    formData: Omit<SellerApplication, 'id' | 'userId' | 'userName' | 'userEmail' | 'submittedAt' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      showToast('Please sign in before submitting an artisan application', 'warning');
      setActiveTab('login');
      return { success: false, error: 'Sign in required.' };
    }

    if (currentUser.isSellerApproved) {
      showToast('Your account is already an approved Artisan Seller!', 'info');
      return { success: true };
    }

    const newApp: SellerApplication = {
      ...formData,
      id: currentUserApplication?.id || `app-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      adminNotes: undefined
    };

    setSellerApplications((prev) => [
      newApp,
      ...prev.filter(
        (a) =>
          a.id !== newApp.id &&
          a.userId !== currentUser.id &&
          a.userEmail.toLowerCase() !== currentUser.email.toLowerCase()
      )
    ]);

    // Attach application to user object
    const updatedUser: User = {
      ...currentUser,
      isSellerApproved: false,
      sellerApplication: newApp
    };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : u
      )
    );

    setIsBecomeSellerOpen(false);
    showToast(
      'Application submitted successfully! Our platform curation team will review your studio within 24-48 hours.',
      'success'
    );
    return { success: true };
  };

  // Admin approves a seller application
  const approveSellerApplication = (applicationId: string) => {
    if (!isAdmin) {
      showToast('Only authorized platform admins can approve seller applications', 'error');
      return;
    }

    const application = sellerApplications.find((a) => a.id === applicationId);
    if (!application) return;

    // Update application status
    setSellerApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'approved' as const } : a))
    );

    // Create or find SellerProfile
    const sellerId = `seller-${application.userId}`;
    const newSellerProfile: SellerProfile = {
      id: sellerId,
      userId: application.userId,
      shopName: application.shopName,
      tagline: application.tagline,
      bio: application.bio,
      craftCategory: application.craftCategory,
      location: application.location,
      avatarUrl:
        application.userAvatar ||
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bannerUrl:
        application.workshopPhotoUrl ||
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
      rating: 5.0,
      totalSales: 0,
      grossRevenue: 0,
      netEarnings: 0,
      availablePayout: 0,
      bankDetails: application.bankDetails,
      verificationStatus: 'verified',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setSellers((prev) => [newSellerProfile, ...prev.filter((s) => s.userId !== application.userId)]);

    // If sample artifact photo and title were provided, seed the first active product
    if (application.sampleTitle && application.sampleImageUrl) {
      const sampleProd: Product = {
        id: `prod-sample-${Date.now()}`,
        sellerId,
        sellerName: application.shopName,
        sellerLocation: application.location || 'Artisan Workshop',
        title: application.sampleTitle,
        category: application.sampleCategory || application.craftCategory,
        price: application.samplePrice || 95,
        rating: 5.0,
        reviewsCount: 1,
        images: [application.sampleImageUrl],
        description: application.sampleDescription || application.bio,
        materials: application.sampleMaterials
          ? application.sampleMaterials.split(',').map((m) => m.trim())
          : ['Artisan Handcrafted Materials'],
        story: application.bio || 'Handcrafted with traditional artisan techniques.',
        dimensions: 'Handcrafted dimensions',
        weight: 'Handmade item',
        leadTime: application.sampleLeadTime || 'Made to order (3-5 days)',
        careInstructions: 'Handle with care. Wipe gently with dry cloth.',
        status: 'published',
        stock: 5,
        featured: true,
        createdAt: new Date().toISOString()
      };
      setProducts((prev) => [sampleProd, ...prev]);
    }

    // Update user record
    setUsers((prev) =>
      prev.map((u) =>
        u.id === application.userId
          ? {
              ...u,
              isSellerApproved: true,
              sellerProfileId: sellerId,
              role: u.role === 'admin' ? 'admin' : 'seller'
            }
          : u
      )
    );

    // If current logged-in user is the applicant, update current user state
    if (currentUser?.id === application.userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              isSellerApproved: true,
              sellerProfileId: sellerId,
              role: prev.role === 'admin' ? 'admin' : 'seller'
            }
          : null
      );
    }

    showToast(`Approved "${application.shopName}"! Artisan studio is now active.`, 'success');
  };

  // Admin rejects a seller application
  const rejectSellerApplication = (applicationId: string, feedback?: string) => {
    if (!isAdmin) {
      showToast('Only authorized platform admins can review seller applications', 'error');
      return;
    }

    const rejectionReason = feedback?.trim() || 'Application does not meet current criteria.';
    let updatedTargetApp: SellerApplication | undefined;

    setSellerApplications((prev) =>
      prev.map((a) => {
        if (a.id === applicationId) {
          updatedTargetApp = {
            ...a,
            status: 'rejected' as const,
            adminNotes: rejectionReason
          };
          return updatedTargetApp;
        }
        return a;
      })
    );

    // Synchronize to users state
    setUsers((prev) =>
      prev.map((u) => {
        if (
          updatedTargetApp &&
          (u.id === updatedTargetApp.userId || u.email.toLowerCase() === updatedTargetApp.userEmail.toLowerCase())
        ) {
          return {
            ...u,
            isSellerApproved: false,
            role: u.role === 'admin' ? 'admin' : 'buyer',
            sellerApplication: updatedTargetApp
          };
        }
        return u;
      })
    );

    // Synchronize to currentUser if this is the applicant
    if (
      currentUser &&
      updatedTargetApp &&
      (currentUser.id === updatedTargetApp.userId ||
        currentUser.email.toLowerCase() === updatedTargetApp.userEmail.toLowerCase())
    ) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              isSellerApproved: false,
              role: prev.role === 'admin' ? 'admin' : 'buyer',
              sellerApplication: updatedTargetApp
            }
          : null
      );
      if (currentRole === 'seller') {
        setCurrentRole('buyer');
      }
    }

    showToast('Application marked as rejected with feedback recorded', 'info');
  };

  const toggleUserStatus = (userId: string) => {
    if (!isAdmin) {
      showToast('Admin privilege required to modify user accounts', 'error');
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u))
    );
    showToast('User account status updated', 'info');
  };

  const updateSellerProfile = (updated: Partial<SellerProfile>) => {
    if (!currentSellerProfile) return;
    setSellers((prev) => prev.map((s) => (s.id === currentSellerProfile.id ? { ...s, ...updated } : s)));
    showToast('Artisan studio profile updated successfully', 'success');
  };

  const updateSellerVerification = (sellerId: string, status: 'verified' | 'pending' | 'rejected') => {
    if (!isAdmin) {
      showToast('Admin privileges required to alter verification status', 'error');
      return;
    }
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, verificationStatus: status } : s)));
    showToast(`Artisan verification status updated to ${status}`, 'info');
  };

  // Product actions with ownership authorization
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => {
    if (!isSellerApproved && !isAdmin) {
      showToast('You must be an approved artisan seller to list products', 'error');
      return;
    }

    const sellerToUse = currentSellerProfile || sellers[0];
    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      sellerId: sellerToUse.id,
      sellerName: sellerToUse.shopName,
      sellerLocation: sellerToUse.location,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewsCount: 0
    };

    setProducts((prev) => [product, ...prev]);
    showToast(`Added "${product.title}" to studio catalogue`, 'success');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    // Security check: Only product owner or platform admin can update
    if (product.sellerId !== currentSellerProfile?.id && !isAdmin) {
      showToast('Permission denied: You can only edit your own listings', 'error');
      return;
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Product listing updated', 'success');
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (product.sellerId !== currentSellerProfile?.id && !isAdmin) {
      showToast('Permission denied: You can only delete your own listings', 'error');
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product listing removed', 'info');
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p)));
  };

  // Cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast('Sorry, this handmade piece is currently out of stock', 'warning');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) => (item.productId === product.id ? { ...item, quantity: nextQty } : item));
      }
      return [...prev, { productId: product.id, product, quantity: Math.min(product.stock, quantity) }];
    });
    showToast(`Added ${quantity} × ${product.title} to your cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const maxStock = item.product.stock;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCommissionEstimate = Number((cartSubtotal * 0.05).toFixed(2));

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed "${product?.title || 'Piece'}" from favorites`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${product?.title || 'Piece'}" to your favorites`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const wishlistCount = wishlist.length;

  // Place Order
  const placeOrder = async (shippingAddress: Order['shippingAddress']): Promise<Order | null> => {
    if (cart.length === 0) return null;

    if (!currentUser) {
      showToast('Please sign in or register to complete your order', 'warning');
      setActiveTab('login');
      return null;
    }

    const subtotal = cartSubtotal;
    const shippingFee = subtotal > 150 ? 0 : 14;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const platformCommissionTotal = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + shippingFee + tax).toFixed(2));

    const orderNumber = `AC-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const orderItems: OrderItem[] = cart.map((item) => {
      const lineGross = item.product.price * item.quantity;
      const commissionFee = Number((lineGross * 0.05).toFixed(2));
      const sellerEarnings = Number((lineGross - commissionFee).toFixed(2));

      return {
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        commissionFee,
        sellerEarnings,
        image:
          item.product.images[0] ||
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        model3dType: item.product.model3dType
      };
    });

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      tax,
      platformCommissionTotal,
      total,
      status: 'ordered',
      trackingNumber: `ARTISAN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: 'Artisan Carbon-Neutral Express',
      createdAt: nowIso,
      estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statusTimeline: [
        {
          status: 'ordered',
          label: 'Order Placed & Confirmed',
          date: 'Just now',
          description: 'Payment authorized. 5% platform fee recorded and artisan notified to reserve materials.'
        }
      ]
    };

    // 1. Update stock
    setProducts((prev) =>
      prev.map((p) => {
        const boughtItem = cart.find((ci) => ci.productId === p.id);
        if (boughtItem) {
          return { ...p, stock: Math.max(0, p.stock - boughtItem.quantity) };
        }
        return p;
      })
    );

    // 2. Update seller finances
    setSellers((prev) =>
      prev.map((s) => {
        const sellerItems = orderItems.filter((oi) => oi.sellerId === s.id);
        if (sellerItems.length > 0) {
          const sellerGross = sellerItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
          const sellerNet = sellerItems.reduce((acc, i) => acc + i.sellerEarnings, 0);
          const qty = sellerItems.reduce((acc, i) => acc + i.quantity, 0);
          return {
            ...s,
            grossRevenue: Number((s.grossRevenue + sellerGross).toFixed(2)),
            netEarnings: Number((s.netEarnings + sellerNet).toFixed(2)),
            availablePayout: Number((s.availablePayout + sellerNet).toFixed(2)),
            totalSales: s.totalSales + qty
          };
        }
        return s;
      })
    );

    // 3. Record commission in ledger
    const newCommissions: CommissionRecord[] = orderItems.map((item, idx) => ({
      id: `comm-${Date.now()}-${idx}`,
      orderId,
      orderNumber,
      sellerId: item.sellerId,
      shopName: item.sellerName,
      grossSale: item.price * item.quantity,
      rate: 0.05,
      commissionAmount: item.commissionFee,
      sellerNet: item.sellerEarnings,
      createdAt: nowIso
    }));

    setCommissions((prev) => [...newCommissions, ...prev]);

    // 4. Save order
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order #${orderNumber} placed successfully! 5% commission registered.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const statusLabels: Record<OrderStatus, string> = {
      ordered: 'Order Placed & Confirmed',
      crafting: 'In Studio Handcrafting',
      quality_check: 'Quality & Craft Inspection',
      shipped: 'Dispatched with Carrier',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered to Destination',
      cancelled: 'Order Cancelled'
    };

    const statusDefaultDesc: Record<OrderStatus, string> = {
      ordered: 'Order confirmed and materials reserved.',
      crafting: 'The artisan has begun wheel-throwing, carving, or assembly in the workshop.',
      quality_check: 'Passed tactile inspection and protective natural packaging seal.',
      shipped: 'Handed over to carrier. Secure tracking active.',
      out_for_delivery: 'On courier vehicle for final delivery to doorstep.',
      delivered: 'Package successfully delivered into client hands.',
      cancelled: 'Order cancelled. Refund initiated.'
    };

    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleTimeString(
      'en-US',
      { hour: 'numeric', minute: '2-digit' }
    )}`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newEvent = {
            status,
            label: statusLabels[status],
            date: dateFormatted,
            description: note || statusDefaultDesc[status]
          };
          return {
            ...ord,
            status,
            statusTimeline: [...ord.statusTimeline, newEvent]
          };
        }
        return ord;
      })
    );

    showToast(`Order status updated to: ${statusLabels[status]}`, 'info');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (order.buyerId !== currentUser?.id && !isAdmin) {
      showToast('Permission denied: You can only cancel your own orders', 'error');
      return;
    }

    updateOrderStatus(orderId, 'cancelled', reason || 'Order cancelled by customer request.');
    showToast('Order was cancelled', 'warning');
  };

  // Review actions
  const addReview = (
    reviewData: Omit<Review, 'id' | 'createdAt' | 'buyerId' | 'buyerName' | 'buyerAvatar' | 'verifiedPurchase'>
  ) => {
    if (!currentUser) {
      showToast('Please sign in to publish a product review', 'warning');
      setActiveTab('login');
      return;
    }

    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      createdAt: new Date().toISOString().split('T')[0],
      verifiedPurchase: true
    };

    const nextReviews = [newRev, ...reviews];
    setReviews(nextReviews);

    // Update product rating and reviewsCount
    const prodReviews = nextReviews.filter((r) => r.productId === reviewData.productId);
    const avg = Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1));

    setProducts((prev) =>
      prev.map((p) => (p.id === reviewData.productId ? { ...p, rating: avg, reviewsCount: prodReviews.length } : p))
    );

    showToast('Your artisan review and rating was published!', 'success');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Payouts
  const requestPayout = (amount: number, method: string): boolean => {
    if (!currentSellerProfile) {
      showToast('Artisan seller profile required to request payouts', 'error');
      return false;
    }
    if (amount <= 0 || amount > currentSellerProfile.availablePayout) {
      showToast('Requested amount exceeds available balance', 'error');
      return false;
    }

    const platformDeduction = Number((amount * 0.05).toFixed(2));
    const newPayout: Payout = {
      id: `pay-${Date.now()}`,
      sellerId: currentSellerProfile.id,
      shopName: currentSellerProfile.shopName,
      amount,
      platformDeductionCalculated: platformDeduction,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      method,
      accountEnding: currentSellerProfile.bankDetails.accountNumberLast4 || '4892',
      notes: 'Submitted for platform admin disbursement verification.'
    };

    setPayouts((prev) => [newPayout, ...prev]);
    setSellers((prev) =>
      prev.map((s) =>
        s.id === currentSellerProfile.id
          ? { ...s, availablePayout: Number((s.availablePayout - amount).toFixed(2)) }
          : s
      )
    );

    showToast(`Payout request for $${amount.toFixed(2)} submitted successfully`, 'success');
    return true;
  };

  const processPayout = (payoutId: string, approved: boolean) => {
    if (!isAdmin) {
      showToast('Admin authorization required to disburse payouts', 'error');
      return;
    }

    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id === payoutId) {
          return {
            ...p,
            status: approved ? 'processed' : 'declined',
            processedDate: new Date().toISOString().split('T')[0],
            notes: approved ? 'Approved by Platform Admin. Funds dispatched.' : 'Declined. Please contact support.'
          };
        }
        return p;
      })
    );

    if (!approved) {
      const payout = payouts.find((p) => p.id === payoutId);
      if (payout) {
        setSellers((prev) =>
          prev.map((s) =>
            s.id === payout.sellerId
              ? { ...s, availablePayout: Number((s.availablePayout + payout.amount).toFixed(2)) }
              : s
          )
        );
      }
    }

    showToast(
      approved ? 'Payout disbursement approved' : 'Payout request declined and balance restored',
      approved ? 'success' : 'warning'
    );
  };

  const open3DStudioWithModel = (model: CraftModelType) => {
    setActive3DModel(model);
    setActiveTab('studio');
    showToast(`Opening 3D Craft Studio for model inspection`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        authLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        switchRole,
        isSellerApproved,
        isAdmin,
        AUTHORIZED_ADMIN_EMAILS,
        users,
        toggleUserStatus,
        sellerApplications,
        currentUserApplication,
        applyToBecomeSeller,
        approveSellerApplication,
        rejectSellerApplication,
        isBecomeSellerOpen,
        setIsBecomeSellerOpen,
        sellers,
        currentSellerProfile,
        updateSellerProfile,
        updateSellerVerification,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartCommissionEstimate,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        orders,
        buyerOrders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        reviews,
        addReview,
        getProductReviews,
        payouts,
        commissions,
        requestPayout,
        processPayout,
        active3DModel,
        setActive3DModel,
        open3DStudioWithModel,
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
