import React, { useState, useEffect } from 'react';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Fingerprint
} from 'lucide-react';
import { useApp, AUTHORIZED_ADMIN_EMAILS } from '../../context/AppContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { login, isAdmin, setActiveTab, currentUser } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'credentials' | 'success'>('credentials');

  useEffect(() => {
    if (isOpen && isAdmin && currentUser) {
      setStep('success');
    }
  }, [isOpen, isAdmin, currentUser]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      setError('Access denied. This portal is restricted to authorized SuperAdmin accounts only.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        setStep('success');
      } else {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch {
      setError('Unexpected error during authentication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    setActiveTab('admin-dashboard');
    onClose();
    setStep('credentials');
    setEmail('');
    setPassword('');
    setError(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('credentials');
      setEmail('');
      setPassword('');
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="admin-login-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-700/40 via-transparent to-stone-900/40 pointer-events-none" />
        <div className="relative bg-[#1C1813] border border-[#3F3730] rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-[#2A1F15] via-[#261A10] to-[#2A1F15] px-6 py-4 border-b border-[#3F3730] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#A86F47]/20 border border-[#A86F47]/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#D8A45F]" />
              </div>
              <div>
                <div className="text-[10px] text-[#8A7A68] uppercase tracking-widest font-medium">Artisan&apos;s Corner</div>
                <div className="text-sm font-semibold text-[#FDFBF7] -mt-0.5" id="admin-login-title">SuperAdmin Portal</div>
              </div>
            </div>
            <button onClick={handleClose} className="w-7 h-7 rounded-lg hover:bg-[#3F3730] flex items-center justify-center text-[#8A7A68] hover:text-white transition-colors" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 py-6">
            {step === 'success' ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#FDFBF7]">Identity Verified</h2>
                  <p className="text-xs text-[#8A7A68] mt-1">SuperAdmin access granted. You may now operate the platform control panel.</p>
                </div>
                <button id="admin-goto-dashboard-btn" onClick={handleGoToDashboard} className="w-full py-3 px-4 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20">
                  <Shield className="w-4 h-4" />
                  Open Admin Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-700/20 mb-5">
                  <Fingerprint className="w-4 h-4 text-[#D8A45F] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#A89880] leading-relaxed">This portal is restricted to authorized platform administrators. Unauthorized access attempts are logged and monitored.</p>
                </div>
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8A7A68] uppercase tracking-wider mb-1.5">Admin Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail className="w-4 h-4 text-[#5A5048]" /></div>
                      <input id="admin-email-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@artisanscorner.org" autoComplete="username" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#3F3730] bg-[#26201A] text-sm text-[#FDFBF7] placeholder-[#4A4038] focus:outline-none focus:ring-1 focus:ring-[#A86F47]/50 focus:border-[#A86F47]/60 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8A7A68] uppercase tracking-wider mb-1.5">Access Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className="w-4 h-4 text-[#5A5048]" /></div>
                      <input id="admin-password-input" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" autoComplete="current-password" className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#3F3730] bg-[#26201A] text-sm text-[#FDFBF7] placeholder-[#4A4038] focus:outline-none focus:ring-1 focus:ring-[#A86F47]/50 focus:border-[#A86F47]/60 transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5A5048] hover:text-[#A89880] transition-colors" aria-label="Toggle password visibility">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button id="admin-login-submit-btn" type="submit" disabled={isSubmitting} className="w-full mt-2 py-3 px-4 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] text-white text-sm font-semibold shadow-lg shadow-amber-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Authenticate &amp; Access</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
                <p className="text-center text-[10px] text-[#4A4038] mt-4">Session is encrypted Â· Activity is audited Â· Access is role-restricted</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};