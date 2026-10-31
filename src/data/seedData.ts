import { Product, SellerProfile, User, Order, Review, Payout, CommissionRecord, SellerApplication } from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user-buyer-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@artisan.io',
    role: 'buyer',
    isSellerApproved: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 234-5678',
    address: {
      fullName: 'Elena Rostova',
      street: '42 Meadowlark Way',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'United States',
      phone: '+1 (555) 234-5678'
    },
    joinedDate: '2025-08-12',
    status: 'active'
  },
  {
    id: 'user-seller-1',
    name: "Liam O'Connor",
    email: 'liam@terracottahearth.com',
    role: 'seller',
    isSellerApproved: true,
    sellerProfileId: 'seller-1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 876-5432',
    address: {
      fullName: "Liam O'Connor",
      street: '78 Kiln Studio Lane',
      city: 'Santa Fe',
      state: 'NM',
      zipCode: '87501',
      country: 'United States',
      phone: '+1 (555) 876-5432'
    },
    joinedDate: '2025-03-15',
    status: 'active'
  },
  {
    id: 'user-admin-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@artisanscorner.org',
    role: 'admin',
    isSellerApproved: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 990-1122',
    joinedDate: '2024-11-01',
    status: 'active'
  },
  {
    id: 'user-admin-2',
    name: 'Sheetal Ingale',
    email: 'sheetalingale26@gmail.com',
    role: 'admin',
    isSellerApproved: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 345-6789',
    joinedDate: '2025-01-01',
    status: 'active'
  },
  {
    id: 'user-sheetal-seller',
    name: 'Sheetal1 (Seller)',
    email: 'sheetal1@gmail.com',
    role: 'seller',
    isSellerApproved: true,
    sellerProfileId: 'seller-sheetal-1',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 789-0123',
    address: {
      fullName: 'Sheetal Seller',
      street: '18 Artisan Atelier Way',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'United States',
      phone: '+1 (555) 789-0123'
    },
    joinedDate: '2025-02-10',
    status: 'active'
  },
  {
    id: 'user-sheetal-buyer',
    name: 'Sheetal2 (Buyer)',
    email: 'sheetal2@gmail.com',
    role: 'buyer',
    isSellerApproved: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 456-7890',
    address: {
      fullName: 'Sheetal Buyer',
      street: '25 Craft Collector Blvd',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States',
      phone: '+1 (555) 456-7890'
    },
    joinedDate: '2025-03-01',
    status: 'active'
  },
  {
    id: 'user-sheetal-admin',
    name: 'Sheetal3 (Admin)',
    email: 'sheetal3@gmail.com',
    role: 'admin',
    isSellerApproved: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 123-4567',
    joinedDate: '2025-01-01',
    status: 'active'
  },
  {
    id: 'user-applicant-1',
    name: 'Hannah Morales',
    email: 'hannah.morales@loomtextiles.co',
    role: 'buyer',
    isSellerApproved: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 432-8871',
    joinedDate: '2026-10-18',
    status: 'active'
  }
];

export const SEED_SELLER_APPLICATIONS: SellerApplication[] = [
  {
    id: 'app-seed-1',
    userId: 'user-applicant-1',
    userName: 'Hannah Morales',
    userEmail: 'hannah.morales@loomtextiles.co',
    shopName: 'Desert Loom Heritage Weavings',
    tagline: 'Hand-spun churro wool tapestries and botanically-dyed heirloom throws.',
    bio: 'Fourth-generation Zapotec & Southwestern weaver working on a traditional 60-inch counterbalance floor loom. Every textile is colored with natural cochineal, indigo, and hand-foraged rabbitbrush.',
    craftCategory: 'Textiles & Fiber Art',
    location: 'Taos, New Mexico',
    phone: '+1 (555) 432-8871',
    portfolioUrl: 'https://instagram.com/desertloomweavings',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    workshopAddress: '14 Camino Del Monte, Taos, NM 87571',
    workshopPhotoUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822321?auto=format&fit=crop&w=1000&q=80',
    yearsOfExperience: '12+ years',
    sampleTitle: 'Hand-Woven Churro Wool Tapestry',
    samplePrice: 285,
    sampleCategory: 'Textiles & Fiber Art',
    sampleDescription: 'Hand-spun churro sheep wool woven on traditional floor loom with natural cochineal and wild indigo dyes.',
    sampleMaterials: '100% Churro Wool, Natural Indigo, Wild Cochineal',
    sampleImageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80',
    sampleLeadTime: 'Made to order (2-3 weeks)',
    bankDetails: {
      bankName: 'Rio Grande Credit Union',
      accountHolder: 'Hannah Morales',
      routingNumber: '107002441',
      accountNumberLast4: '8834'
    },
    submittedAt: '2026-10-18T14:22:00Z',
    status: 'pending'
  }
];

export const SEED_SELLERS: SellerProfile[] = [
  {
    id: 'seller-1',
    userId: 'user-seller-1',
    shopName: 'Terracotta & Hearth Pottery',
    tagline: 'Wheel-thrown earthenware shaped with desert river clay and botanical ash glazes.',
    bio: 'Fourth-generation studio potter based in Santa Fe. Every vessel is thrown on a foot-pedal kickwheel, wood-fired in an adobe anagama kiln for 72 hours, and individually stamped with our studio seal.',
    craftCategory: 'Ceramics & Pottery',
    location: 'Santa Fe, New Mexico',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    totalSales: 84,
    grossRevenue: 8940,
    netEarnings: 8493, // 95%
    availablePayout: 1820,
    bankDetails: {
      bankName: 'First National Bank of Santa Fe',
      accountHolder: "Liam O'Connor",
      routingNumber: '111900654',
      accountNumberLast4: '4892'
    },
    verificationStatus: 'verified',
    joinedDate: '2025-03-15'
  },
  {
    id: 'seller-2',
    userId: 'user-seller-2',
    shopName: 'Nordic Timber Guild',
    tagline: 'Hand-carved heirloom woodwork from sustainably harvested forest walnut & white oak.',
    bio: 'Guided by traditional joinery and Scandinavian sloyd woodcraft, we shape ergonomic kitchenware, live-edge bowls, and ambient desk lamps meant to outlive generations.',
    craftCategory: 'Woodwork & Carving',
    location: 'Bellingham, Washington',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    rating: 4.88,
    totalSales: 62,
    grossRevenue: 6200,
    netEarnings: 5890,
    availablePayout: 1140,
    bankDetails: {
      bankName: 'Cascadia Community Credit Union',
      accountHolder: 'Freja Lindqvist',
      routingNumber: '125000024',
      accountNumberLast4: '3119'
    },
    verificationStatus: 'verified',
    joinedDate: '2025-04-10'
  },
  {
    id: 'seller-3',
    userId: 'user-seller-3',
    shopName: 'Aura & Adorn Metalsmiths',
    tagline: 'Raw brass, hammered silver, and desert turquoise hand-forged into timeless amulets.',
    bio: 'Artisan metalworks forging talismanic jewelry with recycled precious metals, natural gemstone cabochons, and hand-chiseled textures inspired by archaic architecture.',
    craftCategory: 'Jewelry & Metals',
    location: 'Tucson, Arizona',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    rating: 4.92,
    totalSales: 47,
    grossRevenue: 4465,
    netEarnings: 4241.75,
    availablePayout: 850,
    bankDetails: {
      bankName: 'Sonora Valley Bank',
      accountHolder: 'Maya Chen',
      routingNumber: '122105155',
      accountNumberLast4: '7721'
    },
    verificationStatus: 'verified',
    joinedDate: '2025-05-20'
  },
  {
    id: 'seller-sheetal-1',
    userId: 'user-sheetal-seller',
    shopName: "Sheetal's Heritage Atelier",
    tagline: 'Ancestral stoneware ceramics and natural-fiber studio weaving.',
    bio: 'Dedicated to preserving ancestral craftsmanship through stoneware ceramics and natural-fiber studio weaving. Every piece is handcrafted in limited batches.',
    craftCategory: 'Ceramics & Pottery',
    location: 'Portland, Oregon',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    rating: 5.0,
    totalSales: 18,
    grossRevenue: 2850,
    netEarnings: 2707.5,
    availablePayout: 850,
    bankDetails: {
      bankName: 'First Artisan National Bank',
      accountHolder: 'Sheetal Seller',
      routingNumber: '121000358',
      accountNumberLast4: '4892'
    },
    verificationStatus: 'verified',
    joinedDate: '2025-02-10'
  }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sellerId: 'seller-1',
    sellerName: 'Terracotta & Hearth Pottery',
    sellerLocation: 'Santa Fe, NM',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'Earthy Terracotta Amphora Vase',
    description: 'An ancient silhouette reborn for modern botanical styling. Hand-thrown on a traditional kickwheel with mineral-rich iron terracotta clay and finished with subtle fluted ridges, sculpted twin handles, and an unglazed raw exterior patina.',
    story: 'Liam gathered this clay from the red sandstone bluffs outside Abiquiú, aging it for three lunar cycles before throwing on the studio wheel. The dual loop handles were pulled by thumb and joined using slip paste before entering the 2,100°F wood kiln.',
    price: 135,
    stock: 7,
    category: 'Ceramics & Pottery',
    materials: ['Wild Rio Grande Red Clay', 'Natural River Sand', 'Unglazed Smoked Terracotta'],
    dimensions: '11.5" H × 7.2" W × 6.8" D',
    weight: '3.8 lbs',
    leadTime: 'In Stock (Ships in 24 hours)',
    careInstructions: 'Wipe with damp cotton cloth. Water-tight interior with food-safe beeswax sealant.',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'amphora-vase',
    featured: true,
    status: 'published',
    createdAt: '2025-09-01',
    rating: 4.9,
    reviewsCount: 18
  },
  {
    id: 'prod-2',
    sellerId: 'seller-2',
    sellerName: 'Nordic Timber Guild',
    sellerLocation: 'Bellingham, WA',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    title: 'Handcrafted Oak & Brass Accent Lamp',
    description: 'Turn-lathed solid white oak pedestal paired with hand-brushed raw brass accents and an organic oatmeal linen shade. Yields a warm, restorative luminescence suited for reading corners and bedside tables.',
    story: 'Freja selects storm-felled Oregon white oaks, air-drying the timbers for eighteen months. The base is lathed in eight successive sanding passes and finished with cold-pressed organic walnut oil.',
    price: 185,
    stock: 4,
    category: 'Woodwork & Carving',
    materials: ['Sustainably Harvested White Oak', 'Raw Spun Brass', 'Natural Oatmeal Belgian Linen'],
    dimensions: '16" H × 9" Diameter Base',
    weight: '4.2 lbs',
    leadTime: 'Made to Order (3-4 days)',
    careInstructions: 'Dust with soft dry brush. Condition oak base once annually with pure beeswax balm.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'wood-lamp',
    featured: true,
    status: 'published',
    createdAt: '2025-09-10',
    rating: 5.0,
    reviewsCount: 12
  },
  {
    id: 'prod-3',
    sellerId: 'seller-1',
    sellerName: 'Terracotta & Hearth Pottery',
    sellerLocation: 'Santa Fe, NM',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'Artisan Speckled Ceramic Teapot',
    description: 'A contemplative slow-brew teapot featuring an arched spout sculpted for drip-free pouring, a snug-fitting lid with a spherical ceramic knob, and an overhead steam-bent brass handle.',
    story: 'Thrown in high-fire stoneware and bathed in a mineral glaze enriched with crushed wood ash from applewood pruning fires. The speckled exterior reflects the iron pockets blooming during the kiln reduction phase.',
    price: 110,
    stock: 5,
    category: 'Ceramics & Pottery',
    materials: ['Dense Stoneware Clay', 'Natural Ash & Feldspar Glaze', 'Hand-Bent Brass Wire Handle'],
    dimensions: '6.5" H × 8" W × 5.5" D',
    weight: '2.4 lbs',
    leadTime: 'In Stock (Ships next business day)',
    careInstructions: 'Handwash only with mild soap. Do not place directly on stovetop burners.',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'ceramic-teapot',
    featured: true,
    status: 'published',
    createdAt: '2025-09-15',
    rating: 4.8,
    reviewsCount: 9
  },
  {
    id: 'prod-4',
    sellerId: 'seller-2',
    sellerName: 'Nordic Timber Guild',
    sellerLocation: 'Bellingham, WA',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    title: 'Carved Walnut Live-Edge Catchall Bowl',
    description: 'Hand-gouged American black walnut bowl showcasing deep swirling grain patterns and a gently undulating rim. Ideal for entryway essentials, polished stones, or heirloom jewelry.',
    story: 'Each bowl begins with an offset block of heartwood walnut. Hand-gouged with Swiss chisels to leave tactile rhythmic tool marks on the underside before being buffed to a silky satin sheen.',
    price: 78,
    stock: 12,
    category: 'Woodwork & Carving',
    materials: ['American Black Walnut Heartwood', 'Pure Food-Grade Mineral Oil', 'Carnauba Wax'],
    dimensions: '9" L × 7.5" W × 2.2" H',
    weight: '1.6 lbs',
    leadTime: 'In Stock (Ships in 24 hours)',
    careInstructions: 'Never submerge in water. Refresh sheen with olive or walnut oil as needed.',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'carved-bowl',
    featured: false,
    status: 'published',
    createdAt: '2025-09-20',
    rating: 4.9,
    reviewsCount: 15
  },
  {
    id: 'prod-5',
    sellerId: 'seller-3',
    sellerName: 'Aura & Adorn Metalsmiths',
    sellerLocation: 'Tucson, AZ',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    title: 'Hammered Brass & Turquoise Pendant',
    description: 'A hand-hammered raw jewel brass amulet framing an authentic Sleeping Beauty mine turquoise cabochon with delicate copper matrix webbings. Suspended from an adjustable vegetable-tanned cord.',
    story: 'Maya saws, textures, and brazes each brass bezel over an open charcoal crucible. The turquoise stone is hand-cut and bezel-set using burnishing tools without synthetic resins.',
    price: 95,
    stock: 8,
    category: 'Jewelry & Metals',
    materials: ['Solid Jeweler’s Brass', 'Natural Arizona Turquoise', 'Vegetable-Tanned Leather Cord'],
    dimensions: '1.8" Pendant Diameter × 28" Cord Length',
    weight: '0.4 lbs',
    leadTime: 'In Stock (Ships in 24 hours)',
    careInstructions: 'Avoid swimming or showering while wearing. Polish with micro-fiber cloth.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'brass-jewelry',
    featured: true,
    status: 'published',
    createdAt: '2025-09-22',
    rating: 4.95,
    reviewsCount: 21
  },
  {
    id: 'prod-6',
    sellerId: 'seller-1',
    sellerName: 'Terracotta & Hearth Pottery',
    sellerLocation: 'Santa Fe, NM',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'Sage Garden Herb Planter Set',
    description: 'Set of two wheel-thrown planters with integrated drainage holes and matching flared drip saucers. Dipped in an unctuous sage-green celadon glaze over speckled terracotta.',
    story: 'Crafted for culinary herb gardeners. Liam designed the rim thickness to moderate soil root temperatures in sunny window sills.',
    price: 68,
    stock: 14,
    category: 'Ceramics & Pottery',
    materials: ['Porcelain Stoneware Blend', 'Sage Celadon Glaze', 'Cork Feet Protectors'],
    dimensions: '5.5" H × 6" Diameter each',
    weight: '3.1 lbs',
    leadTime: 'In Stock',
    careInstructions: 'Rinse with warm water. Frost-proof up to 28°F.',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'amphora-vase',
    featured: false,
    status: 'published',
    createdAt: '2025-09-28',
    rating: 4.7,
    reviewsCount: 8
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    buyerId: 'user-buyer-1',
    buyerName: 'Elena Rostova',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    title: 'Breathtaking center vessel for dried florals',
    comment: 'The weight and tactile texture of this terracotta amphora are remarkable. The dual handles have subtle finger indents that feel like an artifact discovered in an archaeological studio. Arrived meticulously packaged in recycled wood shavings.',
    createdAt: '2025-10-02',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    buyerId: 'user-buyer-2',
    buyerName: 'David K.',
    buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    title: 'Pure desert magic on my mantel',
    comment: 'You can immediately tell this is real wild-harvested clay and not industrial slipcast ceramics. The warm earthy tone catches the late afternoon sun like nothing else.',
    createdAt: '2025-10-08',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    buyerId: 'user-buyer-1',
    buyerName: 'Elena Rostova',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    title: 'Exceptional craftsmanship and soothing warmth',
    comment: 'The lathe work on the oak pedestal is silky smooth. The soft glow through the Belgian linen shade completely transformed my evening desk sanctuary.',
    createdAt: '2025-10-12',
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: 'prod-5',
    buyerId: 'user-buyer-3',
    buyerName: 'Sophia Miller',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    title: 'A true heirloom pendant',
    comment: 'The matrix on the turquoise is stunning and the hammered brass has an antique talismanic weight. I get compliments whenever I wear it.',
    createdAt: '2025-10-14',
    verifiedPurchase: true
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AC-9281',
    buyerId: 'user-buyer-1',
    buyerName: 'Elena Rostova',
    buyerEmail: 'elena.rostova@artisan.io',
    shippingAddress: {
      fullName: 'Elena Rostova',
      street: '42 Meadowlark Way',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'United States',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        productId: 'prod-1',
        title: 'Earthy Terracotta Amphora Vase',
        price: 135,
        quantity: 1,
        sellerId: 'seller-1',
        sellerName: 'Terracotta & Hearth Pottery',
        commissionFee: 6.75, // 5%
        sellerEarnings: 128.25, // 95%
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        model3dType: 'amphora-vase'
      }
    ],
    subtotal: 135,
    shippingFee: 12,
    tax: 10.80,
    platformCommissionTotal: 6.75, // 5% of subtotal
    total: 157.80,
    status: 'delivered',
    trackingNumber: 'USPS-9400111899562410',
    carrier: 'USPS Priority Mail',
    createdAt: '2025-09-24T14:32:00Z',
    estimatedDelivery: '2025-09-29',
    statusTimeline: [
      {
        status: 'ordered',
        label: 'Order Placed & Confirmed',
        date: 'Sept 24, 2025 - 2:32 PM',
        description: 'Payment processed. 5% platform fee recorded and artisan notified to prepare materials.'
      },
      {
        status: 'crafting',
        label: 'In Studio Preparation',
        date: 'Sept 25, 2025 - 9:15 AM',
        description: 'Liam hand-inspected the fired vessel and applied protective beeswax sealant.'
      },
      {
        status: 'quality_check',
        label: 'Quality & Craft Inspection',
        date: 'Sept 26, 2025 - 11:40 AM',
        description: 'Passed acoustic kiln resonance and watertight stability checks.'
      },
      {
        status: 'shipped',
        label: 'Dispatched with Carrier',
        date: 'Sept 26, 2025 - 4:10 PM',
        description: 'Handed off to USPS in Santa Fe, NM with reinforced biodegradable cushion wrap.'
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        date: 'Sept 29, 2025 - 8:30 AM',
        description: 'Loaded onto courier vehicle in Portland, OR.'
      },
      {
        status: 'delivered',
        label: 'Delivered to Front Porch',
        date: 'Sept 29, 2025 - 1:45 PM',
        description: 'Package received safely at client destination.'
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'AC-9344',
    buyerId: 'user-buyer-1',
    buyerName: 'Elena Rostova',
    buyerEmail: 'elena.rostova@artisan.io',
    shippingAddress: {
      fullName: 'Elena Rostova',
      street: '42 Meadowlark Way',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'United States',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        productId: 'prod-2',
        title: 'Handcrafted Oak & Brass Accent Lamp',
        price: 185,
        quantity: 1,
        sellerId: 'seller-2',
        sellerName: 'Nordic Timber Guild',
        commissionFee: 9.25,
        sellerEarnings: 175.75,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        model3dType: 'wood-lamp'
      },
      {
        productId: 'prod-4',
        title: 'Carved Walnut Live-Edge Catchall Bowl',
        price: 78,
        quantity: 1,
        sellerId: 'seller-2',
        sellerName: 'Nordic Timber Guild',
        commissionFee: 3.90,
        sellerEarnings: 74.10,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        model3dType: 'carved-bowl'
      }
    ],
    subtotal: 263,
    shippingFee: 16,
    tax: 21.04,
    platformCommissionTotal: 13.15, // 5% of 263
    total: 300.04,
    status: 'crafting',
    trackingNumber: 'FEDEX-7821904551',
    carrier: 'FedEx Ground Sustainable',
    createdAt: '2025-10-18T10:15:00Z',
    estimatedDelivery: '2025-10-26',
    statusTimeline: [
      {
        status: 'ordered',
        label: 'Order Placed & Confirmed',
        date: 'Oct 18, 2025 - 10:15 AM',
        description: 'Order confirmed and routed to Nordic Timber Guild in Bellingham, WA.'
      },
      {
        status: 'crafting',
        label: 'In Studio Lathe & Joinery',
        date: 'Oct 19, 2025 - 8:00 AM',
        description: 'Freja is custom-turning the white oak base and hand-buffing the walnut catchall.'
      }
    ]
  }
];

export const SEED_PAYOUTS: Payout[] = [
  {
    id: 'pay-501',
    sellerId: 'seller-1',
    shopName: 'Terracotta & Hearth Pottery',
    amount: 1450.00,
    platformDeductionCalculated: 76.32,
    requestDate: '2025-09-30',
    processedDate: '2025-10-02',
    status: 'processed',
    method: 'Direct Deposit (ACH)',
    accountEnding: '4892',
    notes: 'Disbursed via automated bi-weekly settlement.'
  },
  {
    id: 'pay-502',
    sellerId: 'seller-1',
    shopName: 'Terracotta & Hearth Pottery',
    amount: 720.00,
    platformDeductionCalculated: 37.89,
    requestDate: '2025-10-15',
    status: 'pending',
    method: 'Direct Deposit (ACH)',
    accountEnding: '4892',
    notes: 'Pending scheduled bank batch disbursement.'
  }
];

export const SEED_COMMISSIONS: CommissionRecord[] = [
  {
    id: 'comm-1',
    orderId: 'ord-1001',
    orderNumber: 'AC-9281',
    sellerId: 'seller-1',
    shopName: 'Terracotta & Hearth Pottery',
    grossSale: 135.00,
    rate: 0.05,
    commissionAmount: 6.75,
    sellerNet: 128.25,
    createdAt: '2025-09-24T14:32:00Z'
  },
  {
    id: 'comm-2',
    orderId: 'ord-1002',
    orderNumber: 'AC-9344',
    sellerId: 'seller-2',
    shopName: 'Nordic Timber Guild',
    grossSale: 263.00,
    rate: 0.05,
    commissionAmount: 13.15,
    sellerNet: 249.85,
    createdAt: '2025-10-18T10:15:00Z'
  }
];
