
import React from 'react';
import { Theme, themes } from '../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themeNames: Record<Theme, string> = {
  orange: '活力橙',
  mint: '薄荷绿',
  blue: '天空蓝',
  purple: '浪漫紫',
  dark: '深邃黑',
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500">选择主题</h3>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(themes) as Theme[]).map((theme) => {
          const config = themes[theme];
          const isActive = currentTheme === theme;
          
          return (
            <button
              key={theme}
              onClick={() => onThemeChange(theme)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${isActive ? 'ring-2 ring-offset-2' : ''}`}
              style={{
                backgroundColor: config.bgSecondary,
                borderColor: isActive ? config.primary : config.textSecondary + '30',
              }}
            >
              <div className="flex gap-1.5">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: config.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: config.accent }}
                />
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: config.text }}
              >
                {themeNames[theme]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
