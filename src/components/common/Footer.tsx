import React from 'react';
import { useApp } from '../../context/AppContext';
import { Box, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, switchRole } = useApp();

  return (
    <footer className="bg-[#2A2521] text-[#FDFBF7] pt-14 pb-10 border-t border-[#3F3730]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#3F3730]">
          {/* Brand Ethos */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#A86F47] flex items-center justify-center text-white">
                <Box className="w-5 h-5 text-[#FAF4ED]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#FDFBF7]">
                Artisan’s Corner
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              A curated sanctuary for authentic studio craft. We empower independent makers with low 5% platform fees, verified provenance, and interactive 3D craft inspection.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D8A45F] font-medium bg-[#373029] p-2.5 rounded-xl border border-[#4A3F36]">
              <Shield className="w-4 h-4 text-[#A86F47] shrink-0" />
              <span>Flat 5% Commission • 95% to Artisans</span>
            </div>
          </div>

          {/* Curated Disciplines */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-[#D8A45F] uppercase tracking-wider mb-3">
              Craft Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('marketplace')}>
                Wheel-Thrown Ceramics & Pottery
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('marketplace')}>
                Hand-Carved Walnut & White Oak
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('marketplace')}>
                Forged Brass & Turquoise Jewelry
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('marketplace')}>
                Natural Fiber Weaving & Linen
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab('marketplace')}>
                Saddlery Vegetable Leathercraft
              </li>
            </ul>
          </div>

          {/* Quick Roles Navigation */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-[#D8A45F] uppercase tracking-wider mb-3">
              Marketplace Roles
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <button
                  onClick={() => switchRole('buyer')}
                  className="hover:text-white transition-colors text-left"
                >
                  Buyer Sanctuary (Browse & Review)
                </button>
              </li>
              <li>
                <button
                  onClick={() => switchRole('seller')}
                  className="hover:text-[#A86F47] transition-colors text-left"
                >
                  Seller Studio Hub (Manage Products & Payouts)
                </button>
              </li>
              <li>
                <button
                  onClick={() => switchRole('admin')}
                  className="hover:text-[#8A9A6E] transition-colors text-left"
                >
                  Platform Admin (5% Fee Ledger & Approvals)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('studio')}
                  className="hover:text-[#D8A45F] transition-colors text-left flex items-center gap-1 text-[#D8A45F]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  3D Procedural Studio Inspection
                </button>
              </li>
            </ul>
          </div>

          {/* Fair Fee Transparency */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-sm text-[#D8A45F] uppercase tracking-wider">
              The 5% Promise
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Unlike legacy marketplaces taking 15% to 30%, Artisan’s Corner takes only 5% to support servers and payment rails. The remaining 95% goes directly to support living artisans.
            </p>
            <div className="pt-2">
              <div className="text-[11px] text-gray-400">Join our seasonal studio journal:</div>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="email"
                  placeholder="artisan@guild.com"
                  className="bg-[#373029] border border-[#4A3F36] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-[#A86F47] flex-1"
                />
                <button className="px-3 py-1.5 bg-[#A86F47] hover:bg-[#8F5732] text-white text-xs font-medium rounded-lg transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="flex items-center gap-1.5">
            <span>© 2026 Artisan’s Corner Guild. Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#A86F47] fill-current" />
            <span>for independent makers.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1.5 text-center sm:text-right text-[11px]">
            <span>Transparent 5% Platform Model</span>
            <span>•</span>
            <span>Zero-Plastics Biodegradable Packaging</span>
            <span>•</span>
            <span>Carbon-Neutral Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
