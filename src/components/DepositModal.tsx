
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { ThemeConfig } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, note?: string) => void;
  theme: ThemeConfig;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSubmit, theme }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      onSubmit(numAmount, note || undefined);
      setAmount('');
      setNote('');
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ backgroundColor: theme.bgSecondary }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: theme.textSecondary }}
        >
          <X size={24} />
        </button>
        
        <h2 
          className="text-2xl font-bold mb-6"
          style={{ color: theme.text }}
        >
          存入资金
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              金额
            </label>
            <div className="relative">
              <span 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold"
                style={{ color: theme.primary }}
              >
                ¥
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                style={{
                  borderColor: theme.primary + '50',
                  backgroundColor: theme.bg,
                  color: theme.text,
                }}
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>
          
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              备注（可选）
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
              style={{
                borderColor: theme.primary + '30',
                backgroundColor: theme.bg,
                color: theme.text,
              }}
              placeholder="记点什么..."
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: theme.primary }}
          >
            <Plus size={20} />
            确认存入
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
