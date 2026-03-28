'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signUpUser } from '@/app/actions/auth';
import { useRouter } from '@/i18n/routing';

/**
 * Renders the user registration form and handles the submission flow via Server Actions.
 */
export function RegisterForm() {
  const t = useTranslations('Auth');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const result = await signUpUser(formData);
    
    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 4000);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-surface rounded-2xl border border-success max-w-sm mx-auto w-full shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6 border border-success/30">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 text-center">{t('successTitle') || 'Success! Account created.'}</h3>
        <p className="text-textSecondary text-center text-sm leading-relaxed">
          {t('successMessage') || 'Please check your email to verify your account.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-2">
          <p className="text-sm text-red-400 text-center font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-textSecondary px-1" htmlFor="fullName">{t('fullName')}</label>
        <input 
          id="fullName" 
          name="fullName" 
          type="text" 
          required 
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-white shadow-sm"
          placeholder="e.g. Valentino Rossi"
        />
      </div>

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
        {loading ? 'Processing...' : t('signUp')}
      </button>

      <button onClick={() => router.push('/login')} type="button" className="text-sm font-medium text-textSecondary mt-4 text-center hover:text-white transition-colors">
        {t('alreadyHaveAccount')}
      </button>
    </form>
  );
}
