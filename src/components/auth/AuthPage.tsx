import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Heart,
  Store,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onSuccess }) => {
  const { login, register, setActiveTab, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError('Please provide your email address.');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email format (e.g., name@domain.com).');
      return false;
    }
    if (!password) {
      setError('Please provide your password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return false;
      }
      if (!agreeTerms) {
        setError('Please accept the marketplace ethical trading guidelines to proceed.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Login failed. Please check your credentials.');
        } else {
          if (onSuccess) onSuccess();
        }
      } else {
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.error || 'Registration failed. Please try again.');
        } else {
          if (onSuccess) onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected connection error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-[#F4EEE6] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-[#FFFCF7] rounded-3xl shadow-xl border border-[#E8DEC8] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Visual Section */}
        <div className="lg:col-span-5 bg-[#28231F] text-[#FAF4ED] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle warm background glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#A86F47]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#6B7A52]/20 blur-3xl pointer-events-none" />

          {/* Brand header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#373029] border border-[#4A3F36] text-[11px] font-semibold text-[#D8A45F] tracking-wider uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#D8A45F]" />
              Artisanal Authenticity
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF4ED] leading-tight">
              Where human touch meets heirloom craft.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#C9BFB5] leading-relaxed">
              Step into an independent collective of woodworkers, master ceramicists, metalsmiths, and fiber artists.
            </p>
          </div>

          {/* Artisan Value Highlights */}
          <div className="my-8 space-y-4 relative z-10">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#373029]/70 border border-[#4A3F36]/60">
              <div className="w-8 h-8 rounded-xl bg-[#A86F47]/30 flex items-center justify-center shrink-0 text-[#D8A45F]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Fair 5% Commission</h4>
                <p className="text-[11px] text-gray-300">
                  Makers keep 95% of every dollar. Transparent, ethical commerce.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#373029]/70 border border-[#4A3F36]/60">
              <div className="w-8 h-8 rounded-xl bg-[#6B7A52]/30 flex items-center justify-center shrink-0 text-[#8A9A6E]">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Dual Buyer & Seller Profiles</h4>
                <p className="text-[11px] text-gray-300">
                  Every account starts with a Buyer dashboard. Apply to become a verified artisan anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="pt-6 border-t border-[#443B34] relative z-10">
            <p className="font-signature text-xl text-[#E8DEC8]">
              “Every kiln firing is a conversation between flame, mineral clay, and patience.”
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Liam O'Connor"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] text-gray-300">
                Liam O'Connor • Studio Potter, Santa Fe
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#FFFCF7]">
          {/* Mode Tabs */}
          <div className="flex p-1 bg-[#EFE7DC] rounded-2xl mb-8 max-w-sm">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#FFFCF7] text-[#28231F] shadow-xs'
                  : 'text-[#645D56] hover:text-[#28231F]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#FFFCF7] text-[#28231F] shadow-xs'
                  : 'text-[#645D56] hover:text-[#28231F]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#28231F]">
              {mode === 'login' ? 'Welcome Back to the Hearth' : 'Join Our Artisan Community'}
            </h1>
            <p className="text-xs sm:text-sm text-[#645D56] mt-1.5 mb-6">
              {mode === 'login'
                ? 'Sign in to access your orders, saved artisan favorites, and studio dashboards.'
                : 'Register as a buyer to discover one-of-a-kind handmade goods, or apply to sell.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E72]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Freja Lindqvist"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E72]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#28231F]">
                  Password
                </label>
                {mode === 'login' && (
                  <span className="text-[11px] text-[#A86F47] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E72]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A7E72] hover:text-[#28231F] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E72]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4D9C4] bg-white text-xs sm:text-sm text-[#28231F] placeholder-[#A09384] focus:outline-none focus:ring-2 focus:ring-[#A86F47]/30 focus:border-[#A86F47] transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#A86F47] focus:ring-[#A86F47]"
                  />
                  <span className="text-[11px] text-[#645D56] leading-tight">
                    I agree to the <strong>Artisan’s Corner Code of Ethics</strong>, respecting copyright, handcraft integrity, and fair marketplace trade.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#A86F47] hover:bg-[#8F5732] active:bg-[#784624] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Account' : 'Create Buyer Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 pt-5 border-t border-[#EFE7DC] text-center text-xs text-[#645D56]">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-semibold text-[#A86F47] hover:underline cursor-pointer"
                >
                  Register as a Buyer
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-semibold text-[#A86F47] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
