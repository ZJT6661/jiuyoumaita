
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { themes } from '../types';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function Settings() {
  const { theme, setTheme } = useStore();
  const themeConfig = themes[theme];
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: themeConfig.bg }}>
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-3 rounded-xl transition-all hover:opacity-80 active:scale-95"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <ArrowLeft size={24} color={themeConfig.text} />
          </Link>
          <h1 
            className="text-2xl font-bold"
            style={{ color: themeConfig.text }}
          >
            设置
          </h1>
        </div>
        
        <div 
          className="rounded-2xl p-5"
          style={{ backgroundColor: themeConfig.bgSecondary }}
        >
          <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
        </div>
        
        <div 
          className="mt-6 rounded-2xl p-5 text-center"
          style={{ backgroundColor: themeConfig.bgSecondary }}
        >
          <p 
            className="text-sm"
            style={{ color: themeConfig.textSecondary }}
          >
            就要买它 - 为你的目标而攒钱
          </p>
          <p 
            className="text-xs mt-1"
            style={{ color: themeConfig.textSecondary }}
          >
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
