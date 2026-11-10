// src/components/ui/Card.tsx
import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, elevated = false, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 transition-shadow duration-200 ${
        elevated ? 'shadow-lg shadow-slate-900/5' : 'shadow-sm'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};