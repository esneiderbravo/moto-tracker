import { useTranslations } from 'next-intl';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const t = useTranslations('Auth');

  return (
    <div className="flex flex-col px-6 pt-12 pb-24 gap-6 justify-center min-h-full">
      <header className="flex flex-col items-center gap-2 mb-6">
        <h1 className="text-3xl font-extrabold text-white text-center">{t('registerTitle')}</h1>
        <p className="text-sm text-textSecondary text-center max-w-[250px]">{t('registerSubtitle')}</p>
      </header>

      <RegisterForm />
    </div>
  );
}
