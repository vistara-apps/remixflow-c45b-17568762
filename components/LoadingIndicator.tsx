'use client';

import { FC } from 'react';

interface Props {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingIndicator: FC<Props> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  // Determine spinner size
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  // Determine text size
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center justify-center p-[--space-md]">
      <div className={`animate-spin rounded-full border-t-2 border-primary ${spinnerSizes[size]} mb-[--space-sm]`}></div>
      {message && <p className={`text-muted ${textSizes[size]}`}>{message}</p>}
    </div>
  );
};

export default LoadingIndicator;

