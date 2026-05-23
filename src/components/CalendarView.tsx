
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Deposit, ThemeConfig } from '../types';
import { formatCurrency, getDayKey } from '../utils/formatters';

interface CalendarViewProps {
  deposits: Deposit[];
  theme: ThemeConfig;
}

const CalendarView: React.FC<CalendarViewProps> = ({ deposits, theme }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const depositsByDay = useMemo(() => {
    const map: Record<string, Deposit[]> = {};
    deposits.forEach(deposit => {
      const key = getDayKey(new Date(deposit.date));
      if (!map[key]) map[key] = [];
      map[key].push(deposit);
    });
    return map;
  }, [deposits]);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();
  
  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }
  
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  return (
    <div 
      className="rounded-2xl p-5"
      style={{ backgroundColor: theme.bgSecondary }}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: theme.text }}
        >
          <ChevronLeft size={20} />
        </button>
        <h3 
          className="text-lg font-bold"
          style={{ color: theme.text }}
        >
          {year}年 {monthNames[month]}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: theme.text }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium py-2"
            style={{ color: theme.textSecondary }}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} />;
          }
          
          const date = new Date(year, month, day);
          const dayKey = getDayKey(date);
          const dayDeposits = depositsByDay[dayKey] || [];
          const total = dayDeposits.reduce((sum, d) => sum + d.amount, 0);
          const isToday = getDayKey(new Date()) === dayKey;
          
          return (
            <div
              key={index}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 relative ${total > 0 ? 'cursor-pointer' : ''}`}
              style={{
                backgroundColor: isToday ? theme.primary + '20' : 'transparent',
                border: isToday ? `2px solid ${theme.primary}` : 'none',
              }}
            >
              <span 
                className="text-sm font-medium"
                style={{ color: theme.text }}
              >
                {day}
              </span>
              {total > 0 && (
                <div 
                  className="mt-1 text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: theme.primary,
                    color: 'white',
                  }}
                >
                  +{Math.round(total)}
                </div>
              )}
              {total > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  {formatCurrency(total)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
