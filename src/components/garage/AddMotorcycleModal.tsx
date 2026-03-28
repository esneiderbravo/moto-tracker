'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { createMotorcycle } from '@/app/actions/motorcycles';
import { searchMotorcycleWithAI, type MotorcycleAIResult } from '@/app/actions/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles, Search, Loader2 } from 'lucide-react';

/**
 * Full-screen bottom-sheet modal for adding a new motorcycle.
 * Features AI-powered search to auto-fill specs via Google Gemini.
 */
export default function AddMotorcycleModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const t = useTranslations('Garage');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState<MotorcycleAIResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const makeRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiError('');
    setAiResult(null);

    const result = await searchMotorcycleWithAI(aiQuery);

    if (result.error) {
      setAiError(result.error);
    } else if (result.data) {
      setAiResult(result.data);
      if (makeRef.current) makeRef.current.value = result.data.make ?? '';
      if (modelRef.current) modelRef.current.value = result.data.model ?? '';
      if (yearRef.current) yearRef.current.value = result.data.year ? String(result.data.year) : '';
      if (colorRef.current) colorRef.current.value = result.data.color ?? '';
    }

    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const result = await createMotorcycle(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end"
        onClick={onClose}
      >
        <motion.div
          key="modal-sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="bg-surface rounded-t-[32px] p-6 pb-10 flex flex-col gap-5 max-h-[92%] overflow-y-auto [&::-webkit-scrollbar]:hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">{t('addMotorcycle')}</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* AI Search Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-0.5 bg-background border border-primary/40 rounded-2xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Sparkles size={16} className="text-primary shrink-0" />
              <input
                type="text"
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAISearch()}
                placeholder="Search with AI: 'Yamaha MT-09 2023'..."
                className="flex-1 bg-transparent py-3 text-sm text-white placeholder-textSecondary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAISearch}
                disabled={aiLoading || !aiQuery.trim()}
                className="p-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors disabled:opacity-40"
              >
                {aiLoading
                  ? <Loader2 size={16} className="text-primary animate-spin" />
                  : <Search size={16} className="text-primary" />
                }
              </button>
            </div>

            {aiError && (
              <p className="text-xs text-red-400 px-2">{aiError}</p>
            )}

            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 bg-primary/10 border border-primary/30 rounded-xl flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={13} className="text-primary" />
                  <span className="text-xs font-semibold text-primary">AI found this motorcycle</span>
                </div>
                <p className="text-xs text-white font-bold">{aiResult.make} {aiResult.model} {aiResult.year && `(${aiResult.year})`}</p>
                {aiResult.description && <p className="text-xs text-textSecondary leading-relaxed">{String(aiResult.description)}</p>}
                {aiResult.engineCC && <p className="text-xs text-textSecondary">{aiResult.engineCC}cc · {aiResult.horsepower}hp · Service every {aiResult.serviceIntervalKm}km</p>}
              </motion.div>
            )}
          </div>

          {/* Image picker */}
          <label htmlFor="moto-image" className="cursor-pointer group">
            <div className="w-full h-36 rounded-2xl bg-background border-2 border-dashed border-border group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden">
              {imagePreview
                ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                : <div className="flex flex-col items-center gap-2 text-textSecondary group-hover:text-primary transition-colors">
                    <Camera size={30} />
                    <span className="text-xs font-medium">{t('photo')}</span>
                  </div>
              }
            </div>
            <input ref={fileInputRef} id="moto-image" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 text-center">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-textSecondary">{t('make')}</label>
                <input ref={makeRef} name="make" required placeholder="Yamaha" className="px-3 py-2.5 bg-background border border-border rounded-xl text-white text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-textSecondary">{t('model')}</label>
                <input ref={modelRef} name="model" required placeholder="MT-09" className="px-3 py-2.5 bg-background border border-border rounded-xl text-white text-sm focus:border-primary focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-textSecondary">{t('year')}</label>
                <input ref={yearRef} name="year" type="number" required placeholder="2023" min="1900" max="2030" className="px-3 py-2.5 bg-background border border-border rounded-xl text-white text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-textSecondary">{t('color')}</label>
                <input ref={colorRef} name="color" placeholder="Midnight Black" className="px-3 py-2.5 bg-background border border-border rounded-xl text-white text-sm focus:border-primary focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-textSecondary">{t('licensePlate')}</label>
                <input name="licensePlate" placeholder="RXZ-12D" className="px-3 py-2.5 bg-background border border-border rounded-xl text-white text-sm focus:border-primary focus:outline-none uppercase" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-textSecondary">{t('currentKm')}</label>
                <input name="currentKm" type="number" placeholder="12500" min="0" className="px-3 py-2.5 bg-background border border-border rounded-xl text-white text-sm focus:border-primary focus:outline-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_4px_12px_rgba(255,87,34,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? t('saving') : t('save')}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
