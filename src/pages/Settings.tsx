import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { themes, BankCard } from '../types';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function Settings() {
  const {
    theme,
    setTheme,
    bankCards,
    addBankCard,
    deleteBankCard,
    settings,
    updateSettings
  } = useStore();
  const themeConfig = themes[theme];

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardBankName, setCardBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardBankName.trim() && cardNumber.trim()) {
      addBankCard({ bankName: cardBankName.trim(), cardNumber: cardNumber.trim() });
      setCardBankName('');
      setCardNumber('');
      setShowAddCardModal(false);
    }
  };

  const handlePasswordSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      updateSettings({
        requirePasswordForDelete: true,
        deletePassword: newPassword
      });
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSetup(false);
    }
  };

  const disablePassword = () => {
    updateSettings({
      requirePasswordForDelete: false,
      deletePassword: undefined
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-12 pb-8 pt-safe">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/"
              className="p-3 rounded-xl transition-all hover:opacity-80 active:scale-95"
              style={{ backgroundColor: themeConfig.bgSecondary }}
            >
              <ArrowLeft size={24} color={themeConfig.text} />
            </Link>
            <h1
              className="text-2xl font-bold"
              style={{ color: themeConfig.text }}
            >
              设置
            </h1>
          </div>

          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
          </div>

          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-bold flex items-center gap-2"
                style={{ color: themeConfig.text }}
              >
                <CreditCard size={20} />
                银行卡管理
              </h2>
              <button
                onClick={() => setShowAddCardModal(true)}
                className="p-2 rounded-lg transition-all hover:opacity-80"
                style={{ backgroundColor: themeConfig.primary }}
              >
                <Plus size={20} color="white" />
              </button>
            </div>

            {bankCards.length === 0 ? (
              <p
                className="text-sm text-center py-8"
                style={{ color: themeConfig.textSecondary }}
              >
                还没有添加银行卡
              </p>
            ) : (
              <div className="space-y-3">
                {bankCards.map((card: BankCard) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ backgroundColor: themeConfig.bg }}
                  >
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: themeConfig.text }}
                      >
                        {card.bankName}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: themeConfig.textSecondary }}
                      >
                        **** {card.cardNumber.slice(-4)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteBankCard(card.id)}
                      className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-bold flex items-center gap-2"
                style={{ color: themeConfig.text }}
              >
                <Lock size={20} />
                删除密码
              </h2>
            </div>

            {settings.requirePasswordForDelete ? (
              <div>
                <p
                  className="text-sm mb-4"
                  style={{ color: themeConfig.textSecondary }}
                >
                  已启用删除密码保护
                </p>
                <button
                  onClick={disablePassword}
                  className="w-full py-3 rounded-xl font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: themeConfig.bg,
                    color: '#EF4444'
                  }}
                >
                  关闭密码保护
                </button>
              </div>
            ) : (
              <div>
                <p
                  className="text-sm mb-4"
                  style={{ color: themeConfig.textSecondary }}
                >
                  开启后，删除目标和记录需要输入密码
                </p>
                <button
                  onClick={() => setShowPasswordSetup(true)}
                  className="w-full py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: themeConfig.primary }}
                >
                  设置删除密码
                </button>
              </div>
            )}
          </div>

          <div
            className="mt-6 rounded-2xl p-5 text-center"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <p
              className="text-sm"
              style={{ color: themeConfig.textSecondary }}
            >
              就要买它 - 为你的目标而攒钱
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: themeConfig.textSecondary }}
            >
              Version 26.05.24
            </p>
          </div>
        </div>
      </div>

      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAddCardModal(false)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <button
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: themeConfig.textSecondary }}
            >
              <ArrowLeft size={20} />
            </button>

            <h3
              className="text-xl font-bold mb-6"
              style={{ color: themeConfig.text }}
            >
              添加银行卡
            </h3>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: themeConfig.text }}
                >
                  银行名称
                </label>
                <input
                  type="text"
                  value={cardBankName}
                  onChange={(e) => setCardBankName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                  style={{
                    borderColor: themeConfig.primary + '30',
                    backgroundColor: themeConfig.bg,
                    color: themeConfig.text,
                  }}
                  placeholder="例如：招商银行"
                  autoFocus
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: themeConfig.text }}
                >
                  卡号
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                  style={{
                    borderColor: themeConfig.primary + '30',
                    backgroundColor: themeConfig.bg,
                    color: themeConfig.text,
                  }}
                  placeholder="银行卡号"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: themeConfig.primary }}
              >
                <Plus size={20} />
                添加
              </button>
            </form>
          </div>
        </div>
      )}

      {showPasswordSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPasswordSetup(false)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: themeConfig.bgSecondary }}
          >
            <button
              onClick={() => setShowPasswordSetup(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: themeConfig.textSecondary }}
            >
              <ArrowLeft size={20} />
            </button>

            <h3
              className="text-xl font-bold mb-6"
              style={{ color: themeConfig.text }}
            >
              设置删除密码
            </h3>

            <form onSubmit={handlePasswordSetup} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: themeConfig.text }}
                >
                  新密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                    style={{
                      borderColor: themeConfig.primary + '30',
                      backgroundColor: themeConfig.bg,
                      color: themeConfig.text,
                    }}
                    placeholder="输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: themeConfig.textSecondary }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: themeConfig.text }}
                >
                  确认密码
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                  style={{
                    borderColor: themeConfig.primary + '30',
                    backgroundColor: themeConfig.bg,
                    color: themeConfig.text,
                  }}
                  placeholder="再次输入密码"
                />
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">密码不一致</p>
              )}
              <button
                type="submit"
                disabled={!newPassword || newPassword !== confirmPassword}
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: themeConfig.primary }}
              >
                设置密码
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}