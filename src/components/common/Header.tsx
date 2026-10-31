import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Box,
  Compass,
  Store,
  ShieldCheck,
  ChevronDown,
  User as UserIcon,
  Package,
  Layers,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  Clock,
  Sparkles,
  ArrowRightLeft,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    isAdmin,
    isSellerApproved,
    currentSellerProfile,
    currentUserApplication,
    setIsBecomeSellerOpen,
    logout,
    cartTotalCount,
    wishlistCount,
    setIsCartOpen,
    activeTab,
    setActiveTab
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFCF7] border-b border-[#EFE7DC] backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] sm:h-[74px]">
          {/* Logo & Platform Ethos */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <button
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center gap-2.5 sm:gap-3 group text-left shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#A86F47] flex items-center justify-center text-white shadow-xs group-hover:bg-[#8F5732] transition-colors shrink-0">
                <Box className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFFCF7]" />
              </div>
              <div className="min-w-0">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-[#28231F] block leading-none truncate">
                  Artisan’s Corner
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#A86F47] hidden xs:block mt-0.5">
                  Handmade • Fair 5% Fee
                </span>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'marketplace'
                    ? 'bg-[#EFE7DC] text-[#28231F] font-semibold'
                    : 'text-[#645D56] hover:text-[#28231F] hover:bg-[#F8F4EE]'
                }`}
              >
                <Compass className="w-4 h-4 text-[#A86F47]" />
                Marketplace
              </button>

              <button
                onClick={() => setActiveTab('studio')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors relative cursor-pointer ${
                  activeTab === 'studio'
                    ? 'bg-[#EFE7DC] text-[#28231F] font-semibold'
                    : 'text-[#645D56] hover:text-[#28231F] hover:bg-[#F8F4EE]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#6B7A52]" />
                3D Craft Studio
                <span className="ml-1 text-[9px] font-bold uppercase tracking-wider bg-[#6B7A52] text-white px-1.5 py-0.5 rounded-full">
                  PBR
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#EFE7DC] text-[#28231F] font-semibold'
                    : 'text-[#645D56] hover:text-[#28231F] hover:bg-[#F8F4EE]'
                }`}
              >
                <Package className="w-4 h-4 text-[#A86F47]" />
                Track Orders
              </button>

              {/* Contextual Seller / Admin Hub Controls */}
              {isSellerApproved && (
                <div className="ml-2 flex items-center p-0.5 rounded-xl bg-[#F6EDE6] border border-[#E8DEC8]">
                  <button
                    onClick={() => switchRole('buyer')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      currentRole === 'buyer'
                        ? 'bg-[#FFFCF7] text-[#28231F] shadow-xs'
                        : 'text-[#A86F47] hover:text-[#28231F]'
                    }`}
                  >
                    Buyer
                  </button>
                  <button
                    onClick={() => switchRole('seller')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      currentRole === 'seller'
                        ? 'bg-[#A86F47] text-white shadow-xs'
                        : 'text-[#A86F47] hover:text-[#28231F]'
                    }`}
                  >
                    <Store className="w-3 h-3" />
                    <span>Studio</span>
                  </button>
                </div>
              )}

              {/* High-Impact Top-Nav: Become a Seller (Prominently visible for all buyers and guests) */}
              {!isSellerApproved && !isAdmin && (
                currentUserApplication?.status === 'rejected' ? (
                  <button
                    onClick={() => setIsBecomeSellerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-all cursor-pointer shadow-xs"
                    title="Your seller application was rejected. Click to view reason and reapply."
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>Application Rejected</span>
                  </button>
                ) : currentUserApplication?.status === 'pending' ? (
                  <button
                    onClick={() => setIsBecomeSellerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A86F47] bg-[#F6EDE6] border border-[#E8DEC8] hover:bg-[#EFE7DC] transition-all cursor-pointer shadow-xs"
                    title="View your pending application details"
                  >
                    <Clock className="w-3.5 h-3.5 animate-pulse text-[#A86F47]" />
                    <span>Application Pending</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsBecomeSellerOpen(true)}
                    className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#FFFCF7] bg-[#6B7A52] hover:bg-[#586543] border border-[#586543] transition-all duration-200 cursor-pointer shadow-xs hover:shadow"
                    title="Open an Artisan Shop & Sell Handcrafted Goods"
                  >
                    <Store className="w-3.5 h-3.5 text-[#D9E3D3] group-hover:scale-110 transition-transform" />
                    <span>Become a Seller</span>
                  </button>
                )
              )}

              {/* Admin Portal Link */}
              {isAdmin && (
                <button
                  onClick={() => switchRole('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-[#28231F] text-white'
                      : 'text-[#6B7A52] hover:bg-[#EFF3EB]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#8A9A6E]" />
                  <span>Admin Console</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Controls: Wishlist, Cart & Auth Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-[#F6EDE6] text-[#A86F47] border-[#A86F47]/50 shadow-xs'
                  : 'bg-[#F8F4EE] hover:bg-[#EFE7DC] text-[#28231F] border-[#E4D9C4]'
              }`}
              aria-label="Wishlist"
              title="View saved artisan favorites"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform active:scale-90 ${
                  wishlistCount > 0 || activeTab === 'wishlist'
                    ? 'text-[#A86F47] fill-[#A86F47]'
                    : 'text-[#28231F]'
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 bg-[#A86F47] text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl bg-[#F8F4EE] hover:bg-[#EFE7DC] text-[#28231F] border border-[#E4D9C4] transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#28231F]" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 bg-[#A86F47] text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Authentication & Profile Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl border border-[#E4D9C4] bg-[#F8F4EE] hover:bg-[#EFE7DC] transition-all cursor-pointer shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-white shrink-0 border border-[#A86F47]/20">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-[#28231F] leading-tight truncate max-w-[100px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-medium leading-tight capitalize text-[#A86F47]">
                      {isAdmin ? 'Admin' : isSellerApproved ? 'Artisan Seller' : 'Buyer'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#645D56]" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-[#FFFCF7] border border-[#E4D9C4] shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95">
                      {/* Account Header */}
                      <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#E8DEC8] mb-1">
                        <div className="font-semibold text-xs text-[#28231F]">{currentUser.name}</div>
                        <div className="text-[11px] text-[#645D56] truncate mt-0.5">{currentUser.email}</div>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white border border-[#E4D9C4]">
                          {isAdmin ? (
                            <span className="text-[#6B7A52] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Platform Admin
                            </span>
                          ) : isSellerApproved ? (
                            <span className="text-[#A86F47] flex items-center gap-1">
                              <Store className="w-3 h-3" /> Verified Artisan
                            </span>
                          ) : currentUserApplication?.status === 'rejected' ? (
                            <span className="text-red-700 flex items-center gap-1 font-bold">
                              <XCircle className="w-3 h-3 text-red-600" /> Application Rejected
                            </span>
                          ) : currentUserApplication?.status === 'pending' ? (
                            <span className="text-[#A86F47] flex items-center gap-1 font-semibold">
                              <Clock className="w-3 h-3 text-[#A86F47]" /> Application Pending
                            </span>
                          ) : (
                            <span className="text-[#28231F] flex items-center gap-1">
                              <UserIcon className="w-3 h-3" /> Buyer Account
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Role Perspective Switcher for Approved Sellers */}
                      {isSellerApproved && (
                        <div className="p-2 border-b border-[#EFE7DC] mb-1">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8A7E72] px-2 mb-1.5">
                            Switch Active Studio View
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => {
                                switchRole('buyer');
                                setUserMenuOpen(false);
                              }}
                              className={`p-2 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                                currentRole === 'buyer'
                                  ? 'bg-[#EFE7DC] text-[#28231F]'
                                  : 'hover:bg-[#F8F4EE] text-[#645D56]'
                              }`}
                            >
                              Buyer View
                            </button>
                            <button
                              onClick={() => {
                                switchRole('seller');
                                setUserMenuOpen(false);
                              }}
                              className={`p-2 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                                currentRole === 'seller'
                                  ? 'bg-[#A86F47] text-white'
                                  : 'hover:bg-[#F6EDE6] text-[#A86F47]'
                              }`}
                            >
                              Artisan Studio
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Navigation Links */}
                      <div className="flex flex-col gap-0.5 py-1">
                        <button
                          onClick={() => {
                            setActiveTab('orders');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#28231F] hover:bg-[#F8F4EE] transition-colors text-left cursor-pointer"
                        >
                          <Package className="w-4 h-4 text-[#A86F47]" />
                          <span>My Orders & Tracking</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('wishlist');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#28231F] hover:bg-[#F8F4EE] transition-colors text-left cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-[#A86F47]" />
                          <span>Saved Favorites ({wishlistCount})</span>
                        </button>

                        {!isSellerApproved && !isAdmin && (
                          currentUserApplication?.status === 'rejected' ? (
                            <div className="my-1 space-y-1">
                              <button
                                onClick={() => {
                                  setActiveTab('seller-dashboard');
                                  setUserMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-red-50 hover:bg-red-100/90 border border-red-200 transition-colors text-left cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-red-800 leading-tight">
                                      Application Rejected
                                    </div>
                                    <div className="text-[10px] text-red-600 leading-tight mt-0.5">
                                      View feedback & studio status
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold uppercase bg-red-200/80 text-red-800 px-1.5 py-0.5 rounded">
                                  Review
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  setIsBecomeSellerOpen(true);
                                  setUserMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A86F47] hover:bg-[#F8F4EE] transition-colors text-left cursor-pointer"
                              >
                                <Store className="w-4 h-4 text-[#A86F47]" />
                                <span>Review Details & Reapply</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setIsBecomeSellerOpen(true);
                                setUserMenuOpen(false);
                              }}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#6B7A52] hover:bg-[#EFF3EB] transition-colors text-left cursor-pointer"
                            >
                              <Store className="w-4 h-4" />
                              <span>
                                {currentUserApplication?.status === 'pending'
                                  ? 'View Application Status'
                                  : 'Become an Artisan Seller'}
                              </span>
                            </button>
                          )
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => {
                              switchRole('admin');
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#6B7A52] hover:bg-[#EFF3EB] transition-colors text-left cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Platform Admin Console</span>
                          </button>
                        )}
                      </div>

                      {/* Logout Action */}
                      <div className="pt-1 mt-1 border-t border-[#EFE7DC]">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Signed Out State: Login & Register CTA */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl border border-[#E4D9C4] bg-white hover:bg-[#F8F4EE] text-xs font-semibold text-[#28231F] transition-all cursor-pointer shadow-xs"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-xs font-semibold text-white shadow-xs transition-all cursor-pointer hidden xs:block"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center py-2 border-t border-[#EFE7DC] text-xs font-medium overflow-x-auto no-scrollbar gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'marketplace' ? 'bg-[#A86F47] text-white' : 'text-[#645D56] hover:bg-[#F8F4EE]'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'studio' ? 'bg-[#6B7A52] text-white' : 'text-[#645D56] hover:bg-[#F8F4EE]'
            }`}
          >
            3D Studio
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'orders' ? 'bg-[#A86F47] text-white' : 'text-[#645D56] hover:bg-[#F8F4EE]'
            }`}
          >
            Orders
          </button>
          {isSellerApproved && (
            <button
              onClick={() => switchRole('seller')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'seller-dashboard' ? 'bg-[#A86F47] text-white' : 'text-[#A86F47] bg-[#F6EDE6]'
              }`}
            >
              Seller Hub
            </button>
          )}
          {!isSellerApproved && !isAdmin && (
            currentUserApplication?.status === 'rejected' ? (
              <button
                onClick={() => setActiveTab('seller-dashboard')}
                className="px-3.5 py-1.5 rounded-xl whitespace-nowrap shrink-0 text-red-700 bg-red-50 font-semibold text-xs shadow-xs border border-red-200 flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5 text-red-600" />
                <span>Application Rejected</span>
              </button>
            ) : currentUserApplication?.status === 'pending' ? (
              <button
                onClick={() => setIsBecomeSellerOpen(true)}
                className="px-3.5 py-1.5 rounded-xl whitespace-nowrap shrink-0 text-[#A86F47] bg-[#F6EDE6] font-semibold text-xs shadow-xs border border-[#E8DEC8]"
              >
                Application Pending
              </button>
            ) : (
              <button
                onClick={() => setIsBecomeSellerOpen(true)}
                className="px-3.5 py-1.5 rounded-xl whitespace-nowrap shrink-0 text-white bg-[#6B7A52] font-semibold text-xs shadow-xs"
              >
                Become a Seller
              </button>
            )
          )}
          {isAdmin && (
            <button
              onClick={() => switchRole('admin')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 ${
                activeTab === 'admin-dashboard' ? 'bg-[#28231F] text-white' : 'text-[#6B7A52] bg-[#EFF3EB]'
              }`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
