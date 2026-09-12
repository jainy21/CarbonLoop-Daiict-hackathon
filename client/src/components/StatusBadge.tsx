import React from 'react';
import { BatchStatus } from '../types/index.js';
import { 
  Sparkles, 
  Target, 
  CalendarClock, 
  Truck, 
  Building2, 
  Flame, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export interface StatusBadgeProps {
  status: BatchStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const STATUS_CONFIG: Record<
  string,
  { label: string; colorClass: string; bgClass: string; borderClass: string; icon: React.ElementType }
> = {
  generated: {
    label: 'Waste Generated',
    colorClass: 'text-amber-300',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
    icon: Sparkles
  },
  matched: {
    label: 'Facility Matched',
    colorClass: 'text-cyan-300',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    icon: Target
  },
  collection_scheduled: {
    label: 'Collection Scheduled',
    colorClass: 'text-indigo-300',
    bgClass: 'bg-indigo-500/10',
    borderClass: 'border-indigo-500/30',
    icon: CalendarClock
  },
  in_transit: {
    label: 'In Transit',
    colorClass: 'text-blue-300',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/30',
    icon: Truck
  },
  received: {
    label: 'Facility Received',
    colorClass: 'text-purple-300',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/30',
    icon: Building2
  },
  converting: {
    label: 'Converting',
    colorClass: 'text-emerald-300 animate-pulse',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/40',
    icon: Flame
  },
  converted: {
    label: 'Converted & Verified',
    colorClass: 'text-emerald-300',
    bgClass: 'bg-emerald-500/20',
    borderClass: 'border-emerald-400/50',
    icon: CheckCircle2
  },
  VERIFIED: {
    label: 'Passport Verified',
    colorClass: 'text-emerald-300',
    bgClass: 'bg-emerald-500/20',
    borderClass: 'border-emerald-400/50',
    icon: ShieldCheck
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const normalizedKey = status?.toLowerCase?.() || 'generated';
  const config =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG[normalizedKey] ||
    STATUS_CONFIG.generated;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1 font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide whitespace-nowrap transition-colors ${config.bgClass} ${config.borderClass} ${config.colorClass} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};

export { StatusBadge as BatchStatusBadge };
