
import React from 'react';
import { ThemeConfig } from '../types';

interface ProgressBarProps {
  current: number;
  target: number;
  theme: ThemeConfig;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  target, 
  theme, 
  showText = true,
  size = 'medium'
}) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));
  
  const heightClasses = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6',
  };
  
  return (
    <div className="w-full">
      <div 
        className={`${heightClasses[size]} bg-gray-200 rounded-full overflow-hidden shadow-inner`}
        style={{ backgroundColor: theme.textSecondary + '30' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: theme.primary,
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.primaryLight})`,
          }}
        />
      </div>
      {showText && (
        <div className="mt-1 text-right text-sm font-medium" style={{ color: theme.textSecondary }}>
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
