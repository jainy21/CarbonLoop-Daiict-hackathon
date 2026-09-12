import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import { 
  Leaf, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Zap, 
  Users, 
  TrendingUp,
  Truck,
  CheckCircle2
} from 'lucide-react';

interface LoginPageViewProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPageView: React.FC<LoginPageViewProps> = ({ onLoginSuccess }) => {
  const { login, register, quickDemoLogin, isLoading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<UserRole>('waste_generator');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegisterMode) {
        const u = await register({
          name,
          email,
          password,
          role,
          organization: organization || name
        });
        onLoginSuccess(u.role);
      } else {
        const u = await login(email, password);
        onLoginSuccess(u.role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleRoleQuickLogin = async (targetRole: UserRole) => {
    setError(null);
    try {
      const u = await quickDemoLogin(targetRole);
      onLoginSuccess(u.role);
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 mb-2 shadow-2xl shadow-brand-500/25 ring-1 ring-white/20">
            <Leaf className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
            CARBON<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200">LOOP</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto">
            Circular Carbon Ecosystem — Waste-to-Carbon-Value Chain Tracker
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-brand-400 font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Select a role below to access the tailored dashboard</span>
          </div>
        </div>

        {/* 4 Interactive Role Cards Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              1-Click Role Portals & Dedicated Dashboards
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Demo Creds: DemoPassword123!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Waste Generator */}
            <div
              onClick={() => handleRoleQuickLogin('waste_generator')}
              className="glass-panel p-5 rounded-2xl border-brand-500/30 hover:border-brand-400 bg-gradient-to-b from-brand-950/20 to-slate-900/90 hover:to-slate-900 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-brand-500/10 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                    Generator
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                    Waste Generator
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Farms, cooperatives & food processors logging waste batches & tracking journeys.
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 truncate pt-2 border-t border-slate-800">
                  User: generator@carbonloop.demo
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-brand-400 group-hover:text-brand-300">
                <span>Enter Generator Dashboard</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* 2. Facility Operator */}
            <div
              onClick={() => handleRoleQuickLogin('facility_operator')}
              className="glass-panel p-5 rounded-2xl border-cyan-500/30 hover:border-cyan-400 bg-gradient-to-b from-cyan-950/20 to-slate-900/90 hover:to-slate-900 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Plant Operator
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    Facility Operator
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Biochar pyrolysis & biogas plant intake, weighbridge & reactor management.
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 truncate pt-2 border-t border-slate-800">
                  User: facility@carbonloop.demo
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                <span>Enter Facility Dashboard</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* 3. Municipality */}
            <div
              onClick={() => handleRoleQuickLogin('municipality')}
              className="glass-panel p-5 rounded-2xl border-indigo-500/30 hover:border-indigo-400 bg-gradient-to-b from-indigo-950/20 to-slate-900/90 hover:to-slate-900 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Municipality
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    Municipality
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    City Climate Cell monitoring landfill diversion, methane abatement & audit logs.
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 truncate pt-2 border-t border-slate-800">
                  User: municipality@carbonloop.demo
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                <span>Enter City Analytics</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* 4. Administrator */}
            <div
              onClick={() => handleRoleQuickLogin('admin')}
              className="glass-panel p-5 rounded-2xl border-emerald-500/30 hover:border-emerald-400 bg-gradient-to-b from-emerald-950/20 to-slate-900/90 hover:to-slate-900 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Administrator
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Global Admin
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Full governance: User Directory, RBAC enforcement, Facility Database & ledger controls.
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 truncate pt-2 border-t border-slate-800">
                  User: admin@carbonloop.demo
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>Enter Admin Governance</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Form Box */}
        <div className="max-w-md mx-auto glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-slate-100">
              {isRegisterMode ? 'Register New Platform Account' : 'Sign In with Email & Password'}
            </h2>
            <p className="text-xs text-slate-400">
              Or use standard JWT credential authentication
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gujarat Agro Cluster"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                  >
                    <option value="waste_generator">Waste Generator</option>
                    <option value="facility_operator">Facility Operator</option>
                    <option value="municipality">Municipality</option>
                    <option value="admin">Administrator</option>
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
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegisterMode ? 'Register & Enter Dashboard' : 'Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-[11px] text-slate-400 hover:text-brand-300 transition-colors"
            >
              {isRegisterMode
                ? 'Already registered? Sign in with existing credentials'
                : 'Need a custom account? Register new user'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
