
export interface Deposit {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
  isCompleted: boolean;
  deposits: Deposit[];
}

export type Theme = 'orange' | 'mint' | 'blue' | 'purple' | 'dark';

export interface ThemeConfig {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  bg: string;
  bgSecondary: string;
  text: string;
  textSecondary: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  orange: {
    primary: '#FF6B35',
    primaryLight: '#FF8F66',
    primaryDark: '#E55A2B',
    accent: '#FFD166',
    bg: '#FFF8F5',
    bgSecondary: '#FFFFFF',
    text: '#2D3748',
    textSecondary: '#718096',
  },
  mint: {
    primary: '#00C49A',
    primaryLight: '#33D4B3',
    primaryDark: '#00A884',
    accent: '#9BF3D7',
    bg: '#F0FFF9',
    bgSecondary: '#FFFFFF',
    text: '#2D3748',
    textSecondary: '#718096',
  },
  blue: {
    primary: '#4A90E2',
    primaryLight: '#73A8E9',
    primaryDark: '#3A7BC8',
    accent: '#AED6F1',
    bg: '#F0F7FF',
    bgSecondary: '#FFFFFF',
    text: '#2D3748',
    textSecondary: '#718096',
  },
  purple: {
    primary: '#9B59B6',
    primaryLight: '#B07EC7',
    primaryDark: '#7D3C98',
    accent: '#D7BDE2',
    bg: '#F8F4FF',
    bgSecondary: '#FFFFFF',
    text: '#2D3748',
    textSecondary: '#718096',
  },
  dark: {
    primary: '#FF6B35',
    primaryLight: '#FF8F66',
    primaryDark: '#E55A2B',
    accent: '#FFD166',
    bg: '#1A202C',
    bgSecondary: '#2D3748',
    text: '#F7FAFC',
    textSecondary: '#A0AEC0',
  },
};
