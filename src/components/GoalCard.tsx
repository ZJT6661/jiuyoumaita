import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CreditCard } from 'lucide-react';
import { Goal, ThemeConfig, BankCard } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import ProgressBar from './ProgressBar';

interface GoalCardProps {
  goal: Goal;
  theme: ThemeConfig;
  bankCards: BankCard[];
  onDelete: (id: string) => void;
}

export default function GoalCard({ goal, theme, bankCards, onDelete }: GoalCardProps) {
  const percentage = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
  const associatedCard = goal.bankCardId ? bankCards.find(c => c.id === goal.bankCardId) : null;

  return (
    <Link
      to={`/goal/${goal.id}`}
      className="block p-4 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98]"
      style={{ backgroundColor: theme.bgSecondary }}
    >
      <div className="flex gap-4">
        {goal.image ? (
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={goal.image}
              alt={goal.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: theme.primary + '20' }}
          >
            <span
              className="text-xl font-bold"
              style={{ color: theme.primary }}
            >
              {goal.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className="font-bold text-lg truncate"
                style={{ color: theme.text }}
              >
                {goal.name}
              </h3>
              <p
                className="text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                {formatDate(goal.createdAt)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(goal.id);
              }}
              className="p-2 rounded-lg hover:bg-red-100 transition-colors"
              style={{ color: '#EF4444' }}
            >
              <Trash2 size={18} />
            </button>
          </div>

          {associatedCard && (
            <div className="flex items-center gap-2 mt-2">
              <CreditCard size={14} style={{ color: theme.textSecondary }} />
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                {associatedCard.bankName} ****{associatedCard.cardNumber.slice(-4)}
              </span>
            </div>
          )}

          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span
                className="text-sm"
                style={{ color: theme.textSecondary }}
              >
                {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: theme.primary }}
              >
                {percentage.toFixed(0)}%
              </span>
            </div>
            <ProgressBar
              current={goal.currentAmount}
              target={goal.targetAmount}
              theme={theme}
              size="small"
              showText={false}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}