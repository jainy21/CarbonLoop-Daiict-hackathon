import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { User, UserRole } from '../types/index.js';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Package, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Lock,
  Zap,
  Activity
} from 'lucide-react';

export const AdminManagementView: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/users', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.warn('Failed to fetch admin users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const roleColors: Record<UserRole, string> = {
    waste_generator: 'bg-brand-500/10 text-brand-300 border-brand-500/30',
    facility_operator: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    municipality: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    admin: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GLOBAL SYSTEM GOVERNANCE</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            CarbonLoop Administrative Control Center
          </h2>
          <p className="text-xs text-slate-400">
            Manage authenticated users, cross-module permissions, facility registries, and circular carbon ledger health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            Ledger Status: Healthy
          </span>
        </div>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-brand-400" />
            Registered Roles
          </span>
          <div className="text-2xl font-mono font-black text-slate-100">
            {users.length || 4} <span className="text-xs font-normal text-slate-400">Accounts</span>
          </div>
          <div className="text-[11px] text-slate-400">All 4 roles active in system</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            Active Facilities
          </span>
          <div className="text-2xl font-mono font-black text-cyan-300">
            5 <span className="text-xs font-normal text-slate-400">Plants</span>
          </div>
          <div className="text-[11px] text-cyan-400/80">Pyrolysis & Biogas</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-indigo-400" />
            Active Batches
          </span>
          <div className="text-2xl font-mono font-black text-indigo-300">
            4 <span className="text-xs font-normal text-slate-400">Batches</span>
          </div>
          <div className="text-[11px] text-indigo-400/80">Tracked in lifecycle ledger</div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30">
          <span className="text-xs text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Auth Enforcement
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300">
            JWT + Bcrypt
          </div>
          <div className="text-[11px] text-emerald-400">Role-Based Access Control</div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            Authenticated User Directory & Role Assignments
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {users.length} Users registered
          </span>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center items-center text-slate-400 text-xs gap-2">
            <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            Loading user directory...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Organization / Entity</th>
                  <th className="py-3 px-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/60">
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      {u.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${roleColors[u.role as UserRole] || 'bg-slate-800 text-slate-400'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {u.organization}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
