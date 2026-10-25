export type UserRole = 'buyer' | 'seller' | 'admin';

export interface SellerApplication {
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
  bankDetails: {
    bankName: string;
    accountHolder: string;
    routingNumber: string;
    accountNumberLast4: string;
  };
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  isSellerApproved?: boolean;
  sellerProfileId?: string;
  sellerApplication?: SellerApplication;
  address?: {
    fullName?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  joinedDate: string;
  status: 'active' | 'suspended';
}

export interface SellerProfile {
  id: string;
  userId: string;
  shopName: string;
  tagline: string;
  bio: string;
  craftCategory: string;
  location: string;
  avatarUrl: string;
  bannerUrl: string;
  rating: number;
  totalSales: number;
  grossRevenue: number;
  netEarnings: number;
  availablePayout: number;
  bankDetails: {
    bankName: string;
    accountHolder: string;
    routingNumber: string;
    accountNumberLast4: string;
  };
  verificationStatus: 'verified' | 'pending' | 'rejected';
  joinedDate: string;
}

export type CraftModelType = 
  | 'amphora-vase'
  | 'wood-lamp'
  | 'ceramic-teapot'
  | 'carved-bowl'
  | 'brass-jewelry';

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  sellerAvatar?: string;
  title: string;
  description: string;
  story: string; // The artisan's crafting tale
  price: number;
  stock: number;
  category: string;
  materials: string[];
  dimensions: string;
  weight: string;
  leadTime: string; // e.g. "Made to order (3-5 days)"
  careInstructions: string;
  images: string[];
  model3dType?: CraftModelType;
  featured?: boolean;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  commissionFee: number; // 5% of (price * quantity)
  sellerEarnings: number; // 95% of (price * quantity)
  image: string;
  model3dType?: CraftModelType;
}

export type OrderStatus =
  | 'ordered'
  | 'crafting'
  | 'quality_check'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusEvent {
  status: OrderStatus;
  label: string;
  date: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  platformCommissionTotal: number; // 5% platform cut
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  createdAt: string;
  estimatedDelivery: string;
  statusTimeline: OrderStatusEvent[];
}

export interface Payout {
  id: string;
  sellerId: string;
  shopName: string;
  amount: number;
  platformDeductionCalculated: number;
  requestDate: string;
  processedDate?: string;
  status: 'pending' | 'processed' | 'declined';
  method: string;
  accountEnding: string;
  notes?: string;
}

export interface CommissionRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  sellerId: string;
  shopName: string;
  grossSale: number;
  rate: number; // 0.05 (5%)
  commissionAmount: number;
  sellerNet: number;
  createdAt: string;
}
