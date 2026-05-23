
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { themes } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import ProgressBar from '../components/ProgressBar';
import DepositModal from '../components/DepositModal';
import CompletionModal from '../components/CompletionModal';
import CalendarView from '../components/CalendarView';
import MonthlyChart from '../components/MonthlyChart';

export default function GoalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { goals, addDeposit, deleteDeposit } = useStore();
  const goal = goals.find(g => g.id === id);
  const theme = useStore(state => state.theme);
  const themeConfig = themes[theme];
  
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(false);
  
  useEffect(() => {
    if (goal) {
      if (!prevCompleted && goal.isCompleted) {
        setShowCompletion(true);
      }
      setPrevCompleted(goal.isCompleted);
    }
  }, [goal?.isCompleted, prevCompleted]);
  
  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeConfig.bg }}>
        <p style={{ color: themeConfig.text }}>目标不存在</p>
      </div>
    );
  }
  
  const percentage = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
  const sortedDeposits = [...goal.deposits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleDeposit = (amount: number, note?: string) => {
    addDeposit(goal.id, {
      amount,
      note,
      date: new Date().toISOString(),
    });
  };
  
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: themeConfig.bg }}>
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-xl transition-all hover:opacity-80 active:scale-95"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <ArrowLeft size={24} color={themeConfig.text} />
          </button>
          <div className="flex-1">
            <h1 
              className="text-2xl font-bold"
              style={{ color: themeConfig.text }}
            >
              {goal.name}
            </h1>
          </div>
        </div>
        
        <div 
          className="rounded-2xl p-6 mb-6"
          style={{ 
            background: `linear-gradient(135deg, ${themeConfig.primary}, ${themeConfig.primaryLight})`,
            color: 'white',
          }}
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm opacity-80 mb-1">已存</p>
              <p className="text-3xl font-bold">{formatCurrency(goal.currentAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80 mb-1">目标</p>
              <p className="text-3xl font-bold">{formatCurrency(goal.targetAmount)}</p>
            </div>
          </div>
          
          <ProgressBar
            current={goal.currentAmount}
            target={goal.targetAmount}
            theme={{ ...themeConfig, textSecondary: 'rgba(255,255,255,0.7)' } as any}
            size="large"
            showText={false}
          />
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm opacity-80">{percentage.toFixed(1)}%</span>
            {!goal.isCompleted && (
              <span className="text-sm opacity-80">
                还差 {formatCurrency(goal.targetAmount - goal.currentAmount)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-5 space-y-6">
        <CalendarView deposits={goal.deposits} theme={themeConfig} />
        
        <MonthlyChart deposits={goal.deposits} theme={themeConfig} />
        
        <div 
          className="rounded-2xl p-5"
          style={{ backgroundColor: themeConfig.bgSecondary }}
        >
          <h3 
            className="text-lg font-bold mb-4"
            style={{ color: themeConfig.text }}
          >
            存钱记录
          </h3>
          
          {sortedDeposits.length === 0 ? (
            <p 
              className="text-center py-8"
              style={{ color: themeConfig.textSecondary }}
            >
              还没有存钱记录
            </p>
          ) : (
            <div className="space-y-3">
              {sortedDeposits.map(deposit => (
                <div 
                  key={deposit.id}
                  className="flex items-center justify-between py-3 border-b"
                  style={{ borderColor: themeConfig.textSecondary + '20' }}
                >
                  <div className="flex-1">
                    <p 
                      className="font-bold text-lg"
                      style={{ color: themeConfig.primary }}
                    >
                      +{formatCurrency(deposit.amount)}
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: themeConfig.textSecondary }}
                    >
                      {formatDateTime(deposit.date)}
                    </p>
                    {deposit.note && (
                      <p 
                        className="text-sm mt-1"
                        style={{ color: themeConfig.textSecondary }}
                      >
                        {deposit.note}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteDeposit(goal.id, deposit.id)}
                    className="p-2 rounded-full hover:bg-red-50 transition-colors ml-4"
                    style={{ color: '#EF4444' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={() => setIsDepositModalOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: themeConfig.primary }}
      >
        <Plus size={24} />
        存入资金
      </button>
      
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSubmit={handleDeposit}
        theme={themeConfig}
      />
      
      <CompletionModal
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        goalName={goal.name}
        theme={themeConfig}
      />
    </div>
  );
}
