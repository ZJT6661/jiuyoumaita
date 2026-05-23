
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Deposit, ThemeConfig } from '../types';
import { getMonthKey } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyChartProps {
  deposits: Deposit[];
  theme: ThemeConfig;
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ deposits, theme }) => {
  const chartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = getMonthKey(date);
      monthlyData[key] = 0;
    }
    
    deposits.forEach(deposit => {
      const date = new Date(deposit.date);
      const key = getMonthKey(date);
      if (monthlyData.hasOwnProperty(key)) {
        monthlyData[key] += deposit.amount;
      }
    });
    
    const labels = Object.keys(monthlyData).map(key => {
      const [year, month] = key.split('-');
      return `${month}月`;
    });
    
    const data = Object.values(monthlyData);
    
    return { labels, data };
  }, [deposits]);
  
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: '存入金额',
        data: chartData.data,
        backgroundColor: theme.primary + 'CC',
        borderColor: theme.primary,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function(context: any) {
            return `¥${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.textSecondary,
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: theme.textSecondary + '20',
        },
        ticks: {
          color: theme.textSecondary,
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return '¥' + value;
          },
        },
      },
    },
  };
  
  return (
    <div 
      className="rounded-2xl p-5"
      style={{ backgroundColor: theme.bgSecondary }}
    >
      <h3 
        className="text-lg font-bold mb-4"
        style={{ color: theme.text }}
      >
        近6个月存钱走势
      </h3>
      <div style={{ height: '200px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyChart;
