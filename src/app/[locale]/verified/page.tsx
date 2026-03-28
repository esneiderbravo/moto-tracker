'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

/**
 * Beautiful Verification Success Page shown after user clicks the email link.
 */
export default function VerifiedPage() {
  const t = useTranslations('Auth');
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-background relative overflow-hidden">
      {/* Decorative Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-success/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
        className="flex flex-col items-center bg-surface p-10 rounded-[32px] border border-success/30 shadow-[0_20px_60px_rgba(3,218,198,0.15)] max-w-sm w-full text-center relative z-10"
      >
        <motion.div 
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
          className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6 border border-success/40 shadow-inner"
        >
          <CheckCircle className="w-12 h-12 text-success drop-shadow-md" />
        </motion.div>

        <h1 className="text-3xl font-extrabold text-white mb-3">
          {t('verifiedTitle') || '¡Cuenta Activada!'}
        </h1>
        
        <p className="text-textSecondary text-sm mb-8 leading-relaxed">
          {t('verifiedSubtitle') || 'Tu correo electrónico ha sido verificado con éxito. Ya eres oficialmente parte de la comunidad MotoTracker.'}
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_4px_12px_rgba(255,87,34,0.3)] hover:shadow-[0_8px_20px_rgba(255,87,34,0.5)] transition-all"
        >
          {t('goToGarage') || 'Ir a mi Garaje'}
          <motion.div
            initial={{ x: -2 }}
            animate={{ x: 2 }}
            transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
          >
            <ArrowRight size={22} strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
}
