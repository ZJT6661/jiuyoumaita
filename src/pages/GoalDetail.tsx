import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, CreditCard } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { themes, BankCard } from '../types';
import { formatCurrency, formatDateTime, formatDate } from '../utils/formatters';
import ProgressBar from '../components/ProgressBar';
import DepositModal from '../components/DepositModal';
import CompletionModal from '../components/CompletionModal';
import CalendarView from '../components/CalendarView';
import MonthlyChart from '../components/MonthlyChart';

export default function GoalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { goals, addDeposit, deleteDeposit, bankCards, settings, updateGoal } = useStore();
  const goal = goals.find(g => g.id === id);
  const theme = useStore(state => state.theme);
  const themeConfig = themes[theme];

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState<{ depositId: string; callback: () => void } | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showEditCard, setShowEditCard] = useState(false);

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
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: themeConfig.bg }}>
        <p style={{ color: themeConfig.text }}>目标不存在</p>
      </div>
    );
  }

  const percentage = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
  const sortedDeposits = [...goal.deposits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const associatedCard = goal.bankCardId ? bankCards.find(c => c.id === goal.bankCardId) : null;

  const handleDeposit = (amount: number, note?: string) => {
    addDeposit(goal.id, {
      amount,
      note,
      date: new Date().toISOString(),
    });
  };

  const handleDeleteDeposit = (depositId: string) => {
    if (settings.requirePasswordForDelete && settings.deletePassword) {
      setPasswordPrompt({
        depositId,
        callback: () => deleteDeposit(goal.id, depositId)
      });
    } else {
      deleteDeposit(goal.id, depositId);
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

  const handleCardSelect = (cardId: string | undefined) => {
    updateGoal(goal.id, { bankCardId: cardId });
    setShowEditCard(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-12 pb-6 pt-safe">
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
              <p className="text-sm mt-1" style={{ color: themeConfig.textSecondary }}>
                创建于 {formatDate(goal.createdAt)}
              </p>
            </div>
          </div>

          {goal.image && (
            <div className="mb-6 rounded-2xl overflow-hidden">
              <img
                src={goal.image}
                alt={goal.name}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

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

          {bankCards.length > 0 && (
            <div
              className="rounded-2xl p-4 mb-6 cursor-pointer"
              style={{ backgroundColor: themeConfig.bgSecondary }}
              onClick={() => setShowEditCard(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} style={{ color: themeConfig.primary }} />
                  <div>
                    <p className="text-sm" style={{ color: themeConfig.textSecondary }}>
                      关联银行卡
                    </p>
                    <p className="font-medium" style={{ color: themeConfig.text }}>
                      {associatedCard ? `${associatedCard.bankName} · ****${associatedCard.cardNumber.slice(-4)}` : '未关联'}
                    </p>
                  </div>
                </div>
                <ArrowLeft size={16} style={{ color: themeConfig.textSecondary, transform: 'rotate(180deg)' }} />
              </div>
            </div>
          )}

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
                        onClick={() => handleDeleteDeposit(deposit.id)}
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
          <div className="h-32"></div>
        </div>
      </div>

      <div className="px-5 pb-8 pb-safe">
        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="w-full max-w-md mx-auto py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: themeConfig.primary }}
        >
          <Plus size={24} />
          存入资金
        </button>
      </div>

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

      {showEditCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowEditCard(false)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <button
              onClick={() => setShowEditCard(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: themeConfig.textSecondary }}
            >
              <ArrowLeft size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6" style={{ color: themeConfig.text }}>
              选择银行卡
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleCardSelect(undefined)}
                className={`w-full p-4 rounded-xl text-left transition-all ${goal.bankCardId === undefined ? 'ring-2' : ''}`}
                style={{
                  backgroundColor: themeConfig.bg,
                  color: themeConfig.text,
                  boxShadow: goal.bankCardId === undefined ? `0 0 0 2px ${themeConfig.primary}` : 'none'
                }}
              >
                不关联
              </button>
              {bankCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleCardSelect(card.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${goal.bankCardId === card.id ? 'ring-2' : ''}`}
                  style={{
                    backgroundColor: themeConfig.bg,
                    color: themeConfig.text,
                    boxShadow: goal.bankCardId === card.id ? `0 0 0 2px ${themeConfig.primary}` : 'none'
                  }}
                >
                  <p className="font-medium">{card.bankName}</p>
                  <p className="text-sm" style={{ color: themeConfig.textSecondary }}>
                    **** {card.cardNumber.slice(-4)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}