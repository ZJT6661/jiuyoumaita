
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { Goal, ThemeConfig } from '../types';
import { formatCurrency } from '../utils/formatters';
import ProgressBar from './ProgressBar';

interface GoalCardProps {
  goal: Goal;
  theme: ThemeConfig;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, theme, onDelete }) => {
  const navigate = useNavigate();
  const percentage = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
  
  const handleClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(`/goal/${goal.id}`);
    }
  };
  
  return (
    <div
      onClick={handleClick}
      className="relative p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
      style={{
        backgroundColor: theme.bgSecondary,
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      }}
    >
      {goal.isCompleted && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 size={24} color={theme.primary} />
        </div>
      )}
      
      <div className="mb-4">
        <h3 
          className="text-xl font-bold mb-1"
          style={{ color: theme.text }}
        >
          {goal.name}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm mb-1" style={{ color: theme.textSecondary }}>已存</p>
          <p 
            className="text-lg font-bold"
            style={{ color: theme.primary }}
          >
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm mb-1" style={{ color: theme.textSecondary }}>目标</p>
          <p 
            className="text-lg font-bold"
            style={{ color: theme.text }}
          >
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>
      
      <ProgressBar 
        current={goal.currentAmount} 
        target={goal.targetAmount} 
        theme={theme}
        size="medium"
      />
      
      {!goal.isCompleted && percentage < 100 && (
        <p className="mt-2 text-sm text-center" style={{ color: theme.textSecondary }}>
          还差 {formatCurrency(goal.targetAmount - goal.currentAmount)}
        </p>
      )}
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(goal.id);
        }}
        className="absolute bottom-3 right-3 p-2 rounded-full hover:bg-red-50 transition-colors"
        style={{ color: '#EF4444' }}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default GoalCard;
