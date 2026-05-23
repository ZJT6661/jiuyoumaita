
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, PiggyBank, TrendingUp, Trophy } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { themes } from '../types';
import { formatCurrency } from '../utils/formatters';
import GoalCard from '../components/GoalCard';
import CreateGoalModal from '../components/CreateGoalModal';

export default function Home() {
  const { goals, theme, addGoal, deleteGoal } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const themeConfig = themes[theme];
  
  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completionRate = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: themeConfig.bg }}>
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 
              className="text-2xl font-bold"
              style={{ color: themeConfig.text }}
            >
              就要买它
            </h1>
            <p 
              className="text-sm mt-1"
              style={{ color: themeConfig.textSecondary }}
            >
              为你的目标而攒钱
            </p>
          </div>
          <Link
            to="/settings"
            className="p-3 rounded-xl transition-all hover:opacity-80 active:scale-95"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <Settings size={24} color={themeConfig.text} />
          </Link>
        </div>
        
        <div 
          className="rounded-2xl p-5 mb-6"
          style={{ 
            backgroundColor: themeConfig.primary,
            color: 'white',
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <PiggyBank className="mx-auto mb-2 opacity-90" size={24} />
              <p className="text-2xl font-bold">{formatCurrency(totalSaved)}</p>
              <p className="text-xs opacity-80">总存款</p>
            </div>
            <div>
              <Trophy className="mx-auto mb-2 opacity-90" size={24} />
              <p className="text-2xl font-bold">{completedGoals.length}</p>
              <p className="text-xs opacity-80">已完成</p>
            </div>
            <div>
              <TrendingUp className="mx-auto mb-2 opacity-90" size={24} />
              <p className="text-2xl font-bold">{completionRate.toFixed(0)}%</p>
              <p className="text-xs opacity-80">完成率</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-5">
        {activeGoals.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-lg font-bold mb-4"
              style={{ color: themeConfig.text }}
            >
              进行中
            </h2>
            <div className="space-y-4">
              {activeGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  theme={themeConfig}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          </div>
        )}
        
        {completedGoals.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-lg font-bold mb-4"
              style={{ color: themeConfig.text }}
            >
              已完成
            </h2>
            <div className="space-y-4">
              {completedGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  theme={themeConfig}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          </div>
        )}
        
        {goals.length === 0 && (
          <div 
            className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <PiggyBank 
              size={64} 
              color={themeConfig.primary} 
              className="mx-auto mb-4 opacity-50"
            />
            <p 
              className="text-lg font-medium mb-2"
              style={{ color: themeConfig.text }}
            >
              还没有目标
            </p>
            <p 
              className="text-sm"
              style={{ color: themeConfig.textSecondary }}
            >
              点击下方按钮创建你的第一个目标吧！
            </p>
          </div>
        )}
      </div>
      
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: themeConfig.primary }}
      >
        <Plus size={24} />
        创建目标
      </button>
      
      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(name, targetAmount) => addGoal({ name, targetAmount })}
        theme={themeConfig}
      />
    </div>
  );
}
