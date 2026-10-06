'use client';

import { GraduationCap } from 'lucide-react';

const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

export default function LoadingSpinner({ size = 'md', fullScreen = false }: any) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-primary-100 border-t-primary-500 animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {fullScreen && (
        <p className="text-sm font-medium text-dark-400 animate-pulse">Loading Eduvia&hellip;</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}
