import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, OrderStatus, CraftModelType } from '../../types';
import { SellerSalesGrowthChart } from './SellerSalesGrowthChart';
import {
  Store,
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  Building2,
  Send,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const {
    currentSellerProfile,
    updateSellerProfile,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    orders,
    updateOrderStatus,
    payouts,
    requestPayout,
    open3DStudioWithModel,
    setSelectedProduct,
    isSellerApproved,
    setIsBecomeSellerOpen,
    switchRole,
    setActiveTab: setGlobalActiveTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'earnings' | 'profile'>('products');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutMethod, setPayoutMethod] = useState<string>('Direct Deposit (ACH)');

  // Product form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story: '',
    price: 85,
    stock: 6,
    category: 'Ceramics & Pottery',
    materials: 'High-fire stoneware, Wood ash glaze',
    dimensions: '8" H × 5" W',
    weight: '2.1 lbs',
    leadTime: 'In Stock (Ships in 24 hours)',
    careInstructions: 'Handwash with gentle soap.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    model3dType: 'amphora-vase' as CraftModelType
  });

  // Store Profile edit state
  const [profileData, setProfileData] = useState({
    shopName: currentSellerProfile?.shopName || '',
    tagline: currentSellerProfile?.tagline || '',
    bio: currentSellerProfile?.bio || '',
    craftCategory: currentSellerProfile?.craftCategory || 'Ceramics & Pottery',
    location: currentSellerProfile?.location || '',
    bankName: currentSellerProfile?.bankDetails.bankName || '',
    accountHolder: currentSellerProfile?.bankDetails.accountHolder || '',
    routingNumber: currentSellerProfile?.bankDetails.routingNumber || '',
    accountNumberLast4: currentSellerProfile?.bankDetails.accountNumberLast4 || ''
  });

  const seller = currentSellerProfile;
  if (!isSellerApproved || !seller) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 bg-[#F4EEE6]">
        <div className="max-w-md w-full p-8 bg-[#FFFCF7] rounded-3xl border border-[#E4D9C4] shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F6EDE6] text-[#A86F47] mx-auto flex items-center justify-center mb-4 border border-[#E8DEC8] shadow-xs">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#28231F]">
            Artisan Studio Access
          </h2>
          <p className="text-xs sm:text-sm text-[#645D56] mt-2 mb-6 leading-relaxed">
            You need an approved Artisan Seller account to access this studio dashboard. Independent makers can apply in minutes and retain 95% of all sales!
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setIsBecomeSellerOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Apply to Become a Seller
            </button>
            <button
              onClick={() => setGlobalActiveTab('marketplace')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E4D9C4] text-[#645D56] hover:bg-[#F8F4EE] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter products and orders belonging to this seller
  const sellerProducts = products.filter((p) => p.sellerId === seller.id);
  const sellerOrders = orders.filter((o) => o.items.some((item) => item.sellerId === seller.id));
  const sellerPayouts = payouts.filter((p) => p.sellerId === seller.id);

  // Financial calculations
  const grossSales = seller.grossRevenue;
  const platformFeesDeducted = Number((grossSales * 0.05).toFixed(2));
  const netEarnings = Number((grossSales - platformFeesDeducted).toFixed(2));
  const availablePayout = seller.availablePayout;

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      story: '',
      price: 85,
      stock: 6,
      category: 'Ceramics & Pottery',
      materials: 'Natural river clay, Raw ash',
      dimensions: '10" H × 6" W',
      weight: '3.0 lbs',
      leadTime: 'In Stock (Ships next business day)',
      careInstructions: 'Wipe clean with a damp lint-free cloth.',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      model3dType: 'amphora-vase'
    });
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      description: p.description,
      story: p.story,
      price: p.price,
      stock: p.stock,
      category: p.category,
      materials: p.materials.join(', '),
      dimensions: p.dimensions,
      weight: p.weight,
      leadTime: p.leadTime,
      careInstructions: p.careInstructions,
      imageUrl: p.images[0] || '',
      model3dType: p.model3dType || 'amphora-vase'
    });
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const matsArray = formData.materials.split(',').map((m) => m.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: formData.title,
        description: formData.description,
        story: formData.story,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        materials: matsArray,
        dimensions: formData.dimensions,
        weight: formData.weight,
        leadTime: formData.leadTime,
        careInstructions: formData.careInstructions,
        images: [formData.imageUrl],
        model3dType: formData.model3dType
      });
    } else {
      addProduct({
        sellerId: seller.id,
        sellerName: seller.shopName,
        sellerLocation: seller.location,
        sellerAvatar: seller.avatarUrl,
        title: formData.title,
        description: formData.description,
        story: formData.story,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        materials: matsArray,
        dimensions: formData.dimensions,
        weight: formData.weight,
        leadTime: formData.leadTime,
        careInstructions: formData.careInstructions,
        images: [formData.imageUrl],
        model3dType: formData.model3dType,
        status: 'published'
      });
    }

    setShowAddModal(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile({
      shopName: profileData.shopName,
      tagline: profileData.tagline,
      bio: profileData.bio,
      craftCategory: profileData.craftCategory,
      location: profileData.location,
      bankDetails: {
        bankName: profileData.bankName,
        accountHolder: profileData.accountHolder,
        routingNumber: profileData.routingNumber,
        accountNumberLast4: profileData.accountNumberLast4
      }
    });
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0) return;
    const success = requestPayout(payoutAmount, payoutMethod);
    if (success) {
      setShowPayoutModal(false);
      setPayoutAmount(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Studio Header Card */}
        <div className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#A86F47] overflow-hidden shrink-0 border-2 border-white shadow-md">
                <img
                  src={seller.avatarUrl}
                  alt={seller.shopName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A2521]">
                    {seller.shopName}
                  </h1>
                  {seller.verificationStatus === 'verified' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EFF3EB] text-[#6B7A52] border border-[#D9E3D3] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Master Guild Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#645D56] mt-1 max-w-xl line-clamp-1">{seller.tagline}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A86F47]" />
                    {seller.location}
                  </span>
                  <span>•</span>
                  <span>Artisan Rating: <strong>{seller.rating}★</strong></span>
                  <span>•</span>
                  <span className="text-[#A86F47] font-semibold">5% Fair Platform Rate Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Studio Piece</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 border-t border-[#EFE7D8]">
            <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E4D9C4]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#645D56] block mb-1">
                Gross Studio Sales
              </span>
              <div className="font-serif text-2xl font-bold text-[#2A2521]">
                ${grossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                {seller.totalSales} items handcrafted & sold
              </span>
            </div>

            <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E4D9C4]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A86F47] block mb-1">
                5% Platform Fee (−)
              </span>
              <div className="font-serif text-2xl font-bold text-[#A86F47]">
                ${platformFeesDeducted.toFixed(2)}
              </div>
              <span className="text-[11px] text-[#A86F47] mt-1 block font-medium">
                Flat 5% Guild Operations Cap
              </span>
            </div>

            <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E4D9C4]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7A52] block mb-1">
                Net Artisan Earnings (95%)
              </span>
              <div className="font-serif text-2xl font-bold text-[#6B7A52]">
                ${netEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Disbursed to your accounts
              </span>
            </div>

            <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E4D9C4] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2A2521] block mb-1">
                  Available for Payout
                </span>
                <div className="font-serif text-2xl font-bold text-[#2A2521]">
                  ${availablePayout.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => {
                  setPayoutAmount(availablePayout);
                  setShowPayoutModal(true);
                }}
                disabled={availablePayout <= 0}
                className="mt-2 text-xs font-semibold py-1.5 px-3 bg-[#A86F47] text-white rounded-lg hover:bg-[#8F5732] disabled:opacity-40 transition-colors"
              >
                Request Payout
              </button>
            </div>
          </div>
        </div>

        {/* 7-Day Performance & Sales Growth Line Chart (Recharts) */}
        <SellerSalesGrowthChart
          sellerId={seller.id}
          sellerOrders={sellerOrders}
          grossRevenue={grossSales}
        />

        {/* Dashboard Tabs Navigation */}
        <div className="flex border-b border-[#E4D9C4] mb-8 overflow-x-auto gap-4">
          {[
            { id: 'products', label: `Catalogue & Stock (${sellerProducts.length})` },
            { id: 'orders', label: `Fulfillment & Orders (${sellerOrders.length})` },
            { id: 'earnings', label: `Sales & Payout Ledger (${sellerPayouts.length})` },
            { id: 'profile', label: 'Studio Profile & Bank Info' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#A86F47] text-[#A86F47]'
                  : 'border-transparent text-[#645D56] hover:text-[#2A2521]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Products & Inventory */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2A2521]">Studio Catalog</h3>
                <p className="text-xs text-[#645D56]">Manage active listings, inventory levels, and 3D procedural inspection tags.</p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#A86F47] text-white rounded-xl text-xs font-semibold"
              >
                <Plus className="w-4 h-4" /> Add Piece
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerProducts.map((p) => {
                const isLowStock = p.stock > 0 && p.stock <= 3;
                const isOut = p.stock === 0;

                return (
                  <div
                    key={p.id}
                    className="bg-[#F8F4EE] border border-[#E4D9C4] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-4/3 bg-[#EFE8DD] overflow-hidden">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        {p.model3dType && (
                          <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-[#2A2521]/90 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1">
                            <Layers className="w-3 h-3 text-[#D8A45F]" /> 3D Model: {p.model3dType}
                          </span>
                        )}
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isOut ? 'bg-red-600 text-white' : isLowStock ? 'bg-amber-600 text-white' : 'bg-[#6B7A52] text-white'
                        }`}>
                          {isOut ? 'Out of Stock' : `${p.stock} in stock`}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="text-[10px] uppercase font-semibold text-[#A86F47]">{p.category}</div>
                        <h4 className="font-serif font-bold text-base text-[#2A2521] mt-0.5">{p.title}</h4>
                        <div className="font-serif font-bold text-lg text-[#2A2521] mt-1">${p.price}</div>

                        {/* Quick Stock Controls */}
                        <div className="mt-3 pt-3 border-t border-[#EFE7D8] flex items-center justify-between text-xs">
                          <span className="text-[#645D56] font-medium">Quick Inventory:</span>
                          <div className="flex items-center border border-[#E4D9C4] rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateProductStock(p.id, p.stock - 1)}
                              className="px-2 py-1 text-gray-700 hover:bg-[#F8F4EE]"
                              disabled={p.stock <= 0}
                            >
                              −
                            </button>
                            <span className="px-2.5 font-mono font-bold text-xs">{p.stock}</span>
                            <button
                              onClick={() => updateProductStock(p.id, p.stock + 1)}
                              className="px-2 py-1 text-gray-700 hover:bg-[#F8F4EE]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-[#EFE7D8] flex items-center justify-between mt-2">
                      <div className="flex gap-2">
                        {p.model3dType && (
                          <button
                            onClick={() => open3DStudioWithModel(p.model3dType!)}
                            className="p-2 bg-[#FDFBF7] hover:bg-[#EFE7D8] text-gray-700 rounded-lg border border-[#E4D9C4]"
                            title="Inspect in 3D"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#A86F47]" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="p-2 bg-[#FDFBF7] hover:bg-[#EFE7D8] text-gray-700 rounded-lg border border-[#E4D9C4]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 bg-[#FDFBF7] hover:bg-[#EFE7D8] text-gray-700 rounded-lg border border-[#E4D9C4]"
                          title="Edit Piece"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#A86F47]" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 bg-[#FDFBF7] hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg border border-[#E4D9C4]"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Orders & Fulfillment */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2A2521]">Incoming Patron Orders</h3>
              <p className="text-xs text-[#645D56]">Manage fabrication stages, update courier status, and inspect net earnings.</p>
            </div>

            {sellerOrders.length === 0 ? (
              <div className="p-12 text-center bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4]">
                <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="font-serif text-base font-bold text-[#2A2521]">No incoming orders yet</p>
                <p className="text-xs text-gray-500 mt-1">Orders for your studio items will appear here immediately.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sellerOrders.map((ord) => {
                  const myItems = ord.items.filter((i) => i.sellerId === seller.id);
                  const myGross = myItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
                  const myFee = myItems.reduce((acc, i) => acc + i.commissionFee, 0);
                  const myNet = myItems.reduce((acc, i) => acc + i.sellerEarnings, 0);

                  return (
                    <div
                      key={ord.id}
                      className="bg-[#F8F4EE] rounded-2xl border border-[#E4D9C4] p-5 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EFE7D8] gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base font-bold text-[#2A2521]">
                              Order #{ord.orderNumber}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">Patron: <strong>{ord.buyerName}</strong> ({ord.buyerEmail})</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()} • Tracking: <span className="font-mono">{ord.trackingNumber}</span>
                          </div>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#645D56]">Fulfillment:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-white border border-[#E4D9C4] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2A2521] focus:outline-hidden focus:border-[#A86F47] cursor-pointer"
                          >
                            <option value="ordered">Ordered & Queued</option>
                            <option value="crafting">In Studio Crafting</option>
                            <option value="quality_check">Quality Check Complete</option>
                            <option value="shipped">Dispatched with Carrier</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered to Patron</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items from this seller */}
                      <div className="py-4 space-y-2">
                        {myItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <div className="font-bold text-[#2A2521]">{item.title}</div>
                                <div className="text-gray-500">Qty: {item.quantity} × ${item.price}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-bold text-[#2A2521]">${(item.price * item.quantity).toFixed(2)}</div>
                              <div className="text-[10px] text-[#A86F47]">−5% fee: ${item.commissionFee.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financial breakdown for artisan */}
                      <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E4D9C4] flex items-center justify-between text-xs">
                        <span className="text-gray-500">Artisan Settlement on this Order:</span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500">Gross: ${myGross.toFixed(2)}</span>
                          <span className="text-[#A86F47]">5% Fee: −${myFee.toFixed(2)}</span>
                          <span className="font-bold text-[#6B7A52] font-mono">Net Earned: ${myNet.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Earnings & Payout Ledger */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2A2521]">Earnings & Payout Ledger</h3>
                <p className="text-xs text-[#645D56]">5% automated fee settlement with direct deposit history.</p>
              </div>
              <button
                onClick={() => {
                  setPayoutAmount(availablePayout);
                  setShowPayoutModal(true);
                }}
                disabled={availablePayout <= 0}
                className="px-4 py-2 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl text-xs font-semibold disabled:opacity-40"
              >
                Request Payout
              </button>
            </div>

            <div className="bg-[#F8F4EE] rounded-2xl border border-[#E4D9C4] overflow-hidden shadow-xs">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead className="bg-[#EFE8DD] text-[#2A2521] font-semibold border-b border-[#E4D9C4]">
                    <tr>
                      <th className="p-3.5">Disbursement ID</th>
                      <th className="p-3.5">Request Date</th>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">Amount Requested</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4D9C4]">
                    {sellerPayouts.map((pay) => (
                      <tr key={pay.id} className="hover:bg-[#FDFBF7]">
                        <td className="p-3.5 font-mono font-bold text-[#2A2521]">{pay.id}</td>
                        <td className="p-3.5 text-gray-600">{pay.requestDate}</td>
                        <td className="p-3.5 text-gray-700">{pay.method} (•••• {pay.accountEnding})</td>
                        <td className="p-3.5 font-serif font-bold text-sm text-[#2A2521]">${pay.amount.toFixed(2)}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              pay.status === 'processed'
                                ? 'bg-[#EFF3EB] text-[#6B7A52] border border-[#D9E3D3]'
                                : pay.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {pay.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-500 italic">{pay.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Studio Profile & Bank Info */}
        {activeTab === 'profile' && (
          <div className="bg-[#F8F4EE] rounded-3xl border border-[#E4D9C4] p-6 sm:p-8 max-w-3xl">
            <h3 className="font-serif text-xl font-bold text-[#2A2521] mb-1">Artisan Profile & Banking</h3>
            <p className="text-xs text-[#645D56] mb-6">Update your workshop story, location, and verified bank routing for payouts.</p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Studio Shop Name
                  </label>
                  <input
                    type="text"
                    value={profileData.shopName}
                    onChange={(e) => setProfileData({ ...profileData, shopName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E4D9C4] rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Workshop Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E4D9C4] rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={profileData.tagline}
                  onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E4D9C4] rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                  Artisan Biography & Craft Heritage
                </label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E4D9C4] rounded-xl text-sm"
                />
              </div>

              {/* Bank Settlement Section */}
              <div className="pt-4 border-t border-[#EFE7D8]">
                <h4 className="font-serif font-bold text-sm text-[#2A2521] mb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#A86F47]" />
                  Direct Payout Bank Routing
                </h4>
                <p className="text-[11px] text-gray-500 mb-4">
                  Where Artisan's Corner automatically deposits your 95% sales revenue.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={profileData.bankName}
                      onChange={(e) => setProfileData({ ...profileData, bankName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#E4D9C4] rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={profileData.accountHolder}
                      onChange={(e) => setProfileData({ ...profileData, accountHolder: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#E4D9C4] rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={profileData.routingNumber}
                      onChange={(e) => setProfileData({ ...profileData, routingNumber: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#E4D9C4] rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Account Ending (Last 4 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={profileData.accountNumberLast4}
                      onChange={(e) => setProfileData({ ...profileData, accountNumberLast4: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#E4D9C4] rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Save Studio Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: Add / Edit Product */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-[#FDFBF7] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E4D9C4] z-10 max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95">
              <h2 className="font-serif text-2xl font-bold text-[#2A2521] mb-1">
                {editingProduct ? 'Edit Handmade Piece' : 'Add New Handcrafted Piece'}
              </h2>
              <p className="text-xs text-[#645D56] mb-5">
                Every listing is tagged with a 3D procedural inspection model for collectors.
              </p>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Piece Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Price ($ USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm font-mono"
                    />
                    <span className="text-[10px] text-[#A86F47] mt-0.5 block">
                      Net: ${(formData.price * 0.95).toFixed(2)} (95%)
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm cursor-pointer"
                    >
                      <option value="Ceramics & Pottery">Ceramics & Pottery</option>
                      <option value="Woodwork & Carving">Woodwork & Carving</option>
                      <option value="Jewelry & Metals">Jewelry & Metals</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      3D Model Inspector Preset *
                    </label>
                    <select
                      value={formData.model3dType}
                      onChange={(e) => setFormData({ ...formData, model3dType: e.target.value as CraftModelType })}
                      className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm cursor-pointer font-medium text-[#A86F47]"
                    >
                      <option value="amphora-vase">Amphora Vase (Ceramics)</option>
                      <option value="wood-lamp">Turned Oak Lamp (Woodwork)</option>
                      <option value="ceramic-teapot">Speckled Teapot (Ceramics)</option>
                      <option value="carved-bowl">Walnut Catchall Bowl (Woodwork)</option>
                      <option value="brass-jewelry">Turquoise Pendant (Metals)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Handmade Provenance Story
                  </label>
                  <textarea
                    rows={2}
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    placeholder="Describe how you shaped, carved, or fired this piece..."
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Materials (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    High-Res Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 border border-[#E4D9C4] rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl text-xs font-semibold shadow-md"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Request Payout */}
        {showPayoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowPayoutModal(false)} />
            <div className="relative bg-[#FDFBF7] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E4D9C4] z-10 animate-in fade-in zoom-in-95">
              <h2 className="font-serif text-2xl font-bold text-[#2A2521] mb-1">Request Studio Payout</h2>
              <p className="text-xs text-[#645D56] mb-4">
                Available to withdraw: <strong className="text-[#6B7A52]">${availablePayout.toFixed(2)}</strong>
              </p>

              <form onSubmit={handlePayoutSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Withdrawal Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    max={availablePayout}
                    min={1}
                    step="0.01"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2A2521] uppercase tracking-wider mb-1">
                    Disbursement Method
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F8F4EE] border border-[#E4D9C4] rounded-xl text-sm cursor-pointer"
                  >
                    <option value="Direct Deposit (ACH)">Direct Deposit ACH (ending in {seller.bankDetails.accountNumberLast4})</option>
                    <option value="Instant Debit Card">Instant Debit Card</option>
                    <option value="Stripe Connect Express">Stripe Connect Express</option>
                  </select>
                </div>

                <div className="bg-[#EFF3EB] p-3 rounded-xl border border-[#D9E3D3] text-[11px] text-[#556241]">
                  Platform commission was already deducted at checkout. You will receive 100% of this withdrawal amount (${payoutAmount.toFixed(2)}).
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="px-4 py-2 border border-[#E4D9C4] rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={payoutAmount <= 0 || payoutAmount > availablePayout}
                    className="px-5 py-2 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl text-xs font-semibold shadow-md disabled:opacity-40"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
