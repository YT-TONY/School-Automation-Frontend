// src/components/ui/SkeletonLoader.tsx
import React from 'react';

export const SkeletonLoader: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-100 rounded-lg w-full" />
      ))}
    </div>
  );
};