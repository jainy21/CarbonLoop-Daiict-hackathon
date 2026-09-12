import React from 'react';
import { BatchStatus } from '../types/index.js';
import { 
  Sparkles, 
  Target, 
  CalendarClock, 
  Truck, 
  Building2, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';

interface BatchStatusBadgeProps {
  status: BatchStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const STATUS_CONFIG: Record<
  BatchStatus,
  { label: string; colorClass: string; bgClass: string; borderClass: string; icon: React.ElementType }
> = {
  generated: {
    label: 'Waste Generated',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
    icon: Sparkles
  },
  matched: {
    label: 'Facility Matched',
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    icon: Target
  },
  collection_scheduled: {
    label: 'Collection Scheduled',
    colorClass: 'text-indigo-400',
    bgClass: 'bg-indigo-500/10',
    borderClass: 'border-indigo-500/30',
    icon: CalendarClock
  },
  in_transit: {
    label: 'In Transit',
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/30',
    icon: Truck
  },
  received: {
    label: 'Facility Received',
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/30',
    icon: Building2
  },
  converting: {
    label: 'Converting',
    colorClass: 'text-emerald-400 animate-pulse',
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
  }
};

export const BatchStatusBadge: React.FC<BatchStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.generated;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bgClass} ${config.borderClass} ${config.colorClass} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
