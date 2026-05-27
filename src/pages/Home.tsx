import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, PiggyBank, TrendingUp, Trophy } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { themes } from '../types';
import { formatCurrency } from '../utils/formatters';
import GoalCard from '../components/GoalCard';
import CreateGoalModal from '../components/CreateGoalModal';

export default function Home() {
  const { goals, theme, bankCards, addGoal, deleteGoal, settings } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState<{ goalId: string; callback: () => void } | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const themeConfig = themes[theme];

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completionRate = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleDelete = (id: string) => {
    if (settings.requirePasswordForDelete && settings.deletePassword) {
      setPasswordPrompt({ goalId: id, callback: () => deleteGoal(id) });
    } else {
      deleteGoal(id);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordPrompt && passwordInput === settings.deletePassword) {
      passwordPrompt.callback();
      setPasswordPrompt(null);
      setPasswordInput('');
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col overflow-hidden" 
      style={{ 
        backgroundColor: themeConfig.bg,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-6 pb-6">
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
                      bankCards={bankCards}
                      onDelete={handleDelete}
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
                      bankCards={bankCards}
                      onDelete={handleDelete}
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
          <div className="h-24"></div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full max-w-md mx-auto py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: themeConfig.primary }}
        >
          <Plus size={24} />
          创建目标
        </button>
      </div>

      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => addGoal(data)}
        theme={themeConfig}
        bankCards={bankCards}
      />

      {passwordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setPasswordPrompt(null);
              setPasswordInput('');
            }}
          />
          <div
            className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: themeConfig.text }}>
              请输入密码
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                style={{
                  borderColor: themeConfig.primary + '30',
                  backgroundColor: themeConfig.bg,
                  color: themeConfig.text,
                }}
                placeholder="输入删除密码"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordPrompt(null);
                    setPasswordInput('');
                  }}
                  className="flex-1 py-3 rounded-xl font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: themeConfig.bg,
                    color: themeConfig.text,
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: themeConfig.primary }}
                >
                  确认
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}