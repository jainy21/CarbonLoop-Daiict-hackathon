import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import { 
  Leaf, 
  LayoutDashboard, 
  Package, 
  Building2, 
  Sparkles, 
  Map, 
  TrendingUp, 
  QrCode,
  ShieldCheck,
  User as UserIcon,
  LogIn,
  LogOut,
  ChevronDown,
  BarChart3,
  Users,
  Bot
} from 'lucide-react';

export type NavTab = 
  | 'overview'
  | 'waste-batches'
  | 'facilities'
  | 'smart-path'
  | 'map-logistics'
  | 'carbon-impact'
  | 'carbon-passports'
  | 'municipality-analytics'
  | 'admin-users';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  batchCount?: number;
  onOpenLoginModal: () => void;
  onOpenAskAI?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  batchCount = 4,
  onOpenLoginModal,
  onOpenAskAI
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Standard CarbonLoop Navigation (Spec Section 9)
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'waste-batches', label: 'Waste Batches', icon: Package, badge: batchCount },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'smart-path', label: 'Smart Carbon Path', icon: Sparkles },
    { id: 'map-logistics', label: 'Map & Logistics', icon: Map },
    { id: 'carbon-impact', label: 'Carbon Impact', icon: TrendingUp },
    { id: 'carbon-passports', label: 'Carbon Passports', icon: QrCode },
  ];

  // Additional role-specific items if user has specialized role
  if (user?.role === 'municipality') {
    navItems.splice(5, 0, { id: 'municipality-analytics', label: 'City Analytics', icon: BarChart3 });
  } else if (user?.role === 'admin') {
    navItems.splice(1, 0, { id: 'admin-users', label: 'Users & Roles', icon: Users });
  }

  const roleBadgeStyles: Record<UserRole, string> = {
    waste_generator: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
    facility_operator: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    municipality: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    admin: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
  };

  const roleLabels: Record<UserRole, string> = {
    waste_generator: 'Generator',
    facility_operator: 'Facility Operator',
    municipality: 'Municipality',
    admin: 'Administrator',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Leaf className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-tight text-lg text-slate-100">
                  CARBON<span className="text-brand-400">LOOP</span>
                </span>
                {user && (
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${roleBadgeStyles[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                Circular Carbon Ecosystem Protocol
              </p>
            </div>
          </div>

          {/* Navigation Bar (Spec Section 9) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-850 text-brand-300 border border-slate-700 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: AI Assistant + User Profile */}
          <div className="flex items-center gap-2">
            {/* Ask CarbonLoop AI Button (Spec Section 11) */}
            {onOpenAskAI && (
              <button
                type="button"
                onClick={onOpenAskAI}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-brand-500/30 hover:border-brand-500/60 text-brand-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Ask CarbonLoop AI Assistant"
              >
                <Bot className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden sm:inline">Ask CarbonLoop</span>
              </button>
            )}

            {/* Auth Profile */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="font-semibold text-slate-200 text-[11px] block leading-tight truncate max-w-[130px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-brand-400 font-mono block leading-tight capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl glass-panel p-3 border border-slate-700 bg-slate-950 shadow-2xl z-50 animate-fadeIn space-y-3">
                    <div className="pb-2 border-b border-slate-800 space-y-0.5">
                      <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate font-mono">{user.email}</p>
                      <div className="pt-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${roleBadgeStyles[user.role]}`}>
                          {roleLabels[user.role]}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">{user.organization}</p>
                    </div>

                    <div className="pt-1 flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Switch Role</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Nav */}
        <div className="flex lg:hidden items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-brand-300 border border-slate-700 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
