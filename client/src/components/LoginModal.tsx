import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import { 
  Leaf, 
  Lock, 
  Mail, 
  ShieldCheck, 
  User as UserIcon, 
  Building, 
  Building2, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  Zap,
  X
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<UserRole>('waste_generator');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        const u = await register({
          name,
          email,
          password,
          role,
          organization: organization || name
        });
        onSuccess?.(u.role);
        onClose();
      } else {
        const u = await login(email, password);
        onSuccess?.(u.role);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (targetRole: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const u = await quickDemoLogin(targetRole);
      onSuccess?.(u.role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl glass-panel p-6 sm:p-8 border border-brand-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-[#07111e] shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 mb-1 shadow-lg shadow-brand-500/20">
            <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            CARBON<span className="text-brand-400">LOOP</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Circular Carbon Ecosystem • Role-Based Portal
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegisterMode && (
            <>
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Organization / Entity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gujarat Agro FPO"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="waste_generator">Waste Generator (Farmer / Food Processor)</option>
                  <option value="facility_operator">Facility Operator (Pyrolysis / Biogas)</option>
                  <option value="municipality">Municipality (City Climate Cell)</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegisterMode ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError(null);
            }}
            className="text-[11px] text-slate-400 hover:text-brand-300 transition-colors"
          >
            {isRegisterMode
              ? 'Already have an account? Sign in here'
              : "Don't have an account? Register new role"}
          </button>
        </div>

        {/* 1-Click Hackathon Demo Access Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              1-Click Demo Access
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Pass: DemoPassword123!</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('waste_generator')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 text-left transition-all group"
            >
              <span className="text-[10px] text-brand-400 font-bold block uppercase">Generator</span>
              <span className="text-xs text-slate-200 font-semibold group-hover:text-white truncate block">
                Agro Cooperative
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('facility_operator')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
            >
              <span className="text-[10px] text-cyan-400 font-bold block uppercase">Operator</span>
              <span className="text-xs text-slate-200 font-semibold group-hover:text-white truncate block">
                BioChar Plant A
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('municipality')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
            >
              <span className="text-[10px] text-indigo-400 font-bold block uppercase">Municipality</span>
              <span className="text-xs text-slate-200 font-semibold group-hover:text-white truncate block">
                Ahmedabad AMC
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <span className="text-[10px] text-emerald-400 font-bold block uppercase">System Admin</span>
              <span className="text-xs text-slate-200 font-semibold group-hover:text-white truncate block">
                All Controls
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
