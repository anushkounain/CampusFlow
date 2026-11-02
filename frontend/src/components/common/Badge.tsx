import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'navy' | 'green' | 'amber' | 'red' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
}) => {
  const styles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    navy: 'bg-slate-900 text-white border-transparent',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${styles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
};
