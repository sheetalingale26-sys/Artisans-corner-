/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { Marketplace } from './components/buyer/Marketplace';
import { ProductDetailModal } from './components/buyer/ProductDetailModal';
import { CartDrawer } from './components/buyer/CartDrawer';
import { OrderTrackingView } from './components/buyer/OrderTrackingView';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArtisanStudio3D } from './components/studio/ArtisanStudio3D';
import { WishlistPage } from './components/buyer/WishlistPage';
import { AuthPage } from './components/auth/AuthPage';
import { BecomeSellerModal } from './components/seller/BecomeSellerModal';

import { ErrorBoundary, Studio3DErrorBoundary, AdminErrorBoundary } from './components/common/ErrorBoundary';

const MainLayout: React.FC = () => {
  const { activeTab, selectedProduct, setSelectedProduct } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EEE6] text-[#28231F] selection:bg-[#A86F47]/20 selection:text-[#A86F47]">
      <Header />

      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <ErrorBoundary sectionName="Curated Marketplace">
            <Marketplace />
          </ErrorBoundary>
        )}
        {activeTab === 'wishlist' && <WishlistPage />}
        {activeTab === 'studio' && (
          <Studio3DErrorBoundary>
            <ArtisanStudio3D />
          </Studio3DErrorBoundary>
        )}
        {activeTab === 'orders' && <OrderTrackingView />}
        {activeTab === 'seller-dashboard' && <SellerDashboard />}
        {activeTab === 'admin-dashboard' && (
          <AdminErrorBoundary>
            <AdminDashboard />
          </AdminErrorBoundary>
        )}
        {activeTab === 'login' && <AuthPage initialMode="login" />}
        {activeTab === 'register' && <AuthPage initialMode="register" />}
      </main>

      {/* Conditionally render footer when not in full-bleed 3D Studio or Auth page */}
      {activeTab !== 'studio' && activeTab !== 'login' && activeTab !== 'register' && <Footer />}

      {/* Overlays & Modals */}
      <CartDrawer />
      <BecomeSellerModal />
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary sectionName="Artisan's Corner Platform">
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
