import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserRole } from '../types/index.js';
import { ShieldAlert, LogIn, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  onOpenLogin?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  onOpenLogin
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono">Verifying authentication & role permissions...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="glass-panel max-w-lg mx-auto p-8 rounded-2xl border-brand-500/30 text-center space-y-4 my-12">
        <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">
          Authentication Required
        </h3>
        <p className="text-xs text-slate-400">
          You must be signed in with a verified CarbonLoop role to access this module.
        </p>
        <button
          onClick={onOpenLogin}
          className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 mx-auto"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In / Demo Access</span>
        </button>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="glass-panel max-w-lg mx-auto p-8 rounded-2xl border-rose-500/30 text-center space-y-4 my-12">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">
          Restricted Role Access
        </h3>
        <p className="text-xs text-slate-400">
          Your current role (<strong className="text-rose-300 uppercase">{user.role}</strong>) does not have permission to view this section.
        </p>
        <p className="text-[11px] text-slate-500">
          Required roles: [{allowedRoles.join(', ')}]
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export const RoleRoute: React.FC<ProtectedRouteProps> = (props) => {
  return <ProtectedRoute {...props} />;
};
