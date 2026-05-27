import React, { useState } from 'react';
import { ArrowLeft, Plus, Image } from 'lucide-react';
import { ThemeConfig, BankCard } from '../types';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; targetAmount: number; image?: string; bankCardId?: string }) => void;
  theme: ThemeConfig;
  bankCards: BankCard[];
}

export default function CreateGoalModal({ isOpen, onClose, onSubmit, theme, bankCards }: CreateGoalModalProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedBankCardId, setSelectedBankCardId] = useState<string | undefined>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && targetAmount) {
      onSubmit({
        name: name.trim(),
        targetAmount: parseFloat(targetAmount),
        image: selectedImage || undefined,
        bankCardId: selectedBankCardId,
      });
      setName('');
      setTargetAmount('');
      setSelectedImage(null);
      setSelectedBankCardId(undefined);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: theme.bgSecondary }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: theme.textSecondary }}
        >
          <ArrowLeft size={20} />
        </button>

        <h3
          className="text-xl font-bold mb-6"
          style={{ color: theme.text }}
        >
          创建目标
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              物品名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
              style={{
                borderColor: theme.primary + '30',
                backgroundColor: theme.bg,
                color: theme.text,
              }}
              placeholder="例如：iPhone 15 Pro"
              autoFocus
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              目标金额
            </label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
              style={{
                borderColor: theme.primary + '30',
                backgroundColor: theme.bg,
                color: theme.text,
              }}
              placeholder="目标金额"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.text }}
            >
              物品图片
            </label>
            <label
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-opacity-50"
              style={{
                borderColor: theme.primary + '50',
                backgroundColor: theme.bg,
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {selectedImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="预览"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <>
                  <Image size={32} style={{ color: theme.textSecondary }} />
                  <span
                    className="text-sm mt-2"
                    style={{ color: theme.textSecondary }}
                  >
                    点击上传图片
                  </span>
                </>
              )}
            </label>
            {selectedImage && (
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                移除图片
              </button>
            )}
          </div>

          {bankCards.length > 0 && (
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                关联银行卡（可选）
              </label>
              <select
                value={selectedBankCardId || ''}
                onChange={(e) => setSelectedBankCardId(e.target.value || undefined)}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                style={{
                  borderColor: theme.primary + '30',
                  backgroundColor: theme.bg,
                  color: theme.text,
                }}
              >
                <option value="">不关联</option>
                {bankCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.bankName} ****{card.cardNumber.slice(-4)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim() || !targetAmount}
            className="w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: theme.primary }}
          >
            <Plus size={20} />
            创建
          </button>
        </form>
      </div>
    </div>
  );
}