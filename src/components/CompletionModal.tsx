
import React from 'react';
import { X, Trophy, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalName: string;
  theme: ThemeConfig;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose, goalName, theme }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl text-center"
        style={{ backgroundColor: theme.bgSecondary }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: theme.textSecondary }}
        >
          <X size={24} />
        </button>
        
        <div className="mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"
            style={{ backgroundColor: theme.primary + '20' }}
          >
            <Trophy size={40} color={theme.primary} />
          </div>
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Sparkles 
                key={i} 
                size={20} 
                color={theme.accent}
              />
            ))}
          </div>
        </div>
        
        <h2 
          className="text-3xl font-bold mb-2"
          style={{ color: theme.primary }}
        >
          恭喜完成！
        </h2>
        <p 
          className="text-lg mb-8"
          style={{ color: theme.text }}
        >
          你的「{goalName}」目标已达成！
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: theme.primary }}
        >
          太棒了！
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;
