'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signInUser } from '@/app/actions/auth';
import { useRouter } from '@/i18n/routing';

/**
 * Renders the user login form and handles authentication via Server Actions.
 */
export function LoginForm() {
  const t = useTranslations('Auth');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const result = await signInUser(formData);
    
    if (result.error) {
      setErrorMsg(result.error);
      setLoading(false);
    } else if (result.success) {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-2">
          <p className="text-sm text-red-400 text-center font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-textSecondary px-1" htmlFor="email">{t('email')}</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-white shadow-sm"
          placeholder="biker@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-textSecondary px-1" htmlFor="password">{t('password')}</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-white shadow-sm"
          placeholder="••••••••"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full mt-6 py-3.5 bg-primary text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(255,87,34,0.3)] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '...' : t('login')}
      </button>

      <button onClick={() => router.push('/register')} type="button" className="text-sm font-medium text-textSecondary mt-4 text-center hover:text-white transition-colors block">
        {t('dontHaveAccount')}
      </button>
    </form>
  );
}
