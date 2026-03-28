'use client';

import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/routing';
import { Home, User } from 'lucide-react';

export default function BottomNav() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: t('garage'), match: (p: string) => p === '/' },
    { href: '/profile', icon: User, label: t('profile'), match: (p: string) => p.includes('/profile') },
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full h-[70px] bg-surface flex justify-around items-center border-t border-border z-10 pb-[env(safe-area-inset-bottom,10px)] sm:rounded-b-[32px]">
      {navItems.map((item) => {
        const isActive = item.match(pathname);
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 text-xs gap-1 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-textSecondary hover:text-primary'}`}
          >
            <Icon 
              size={24} 
              className={`transition-all duration-200 ${isActive ? 'scale-110 stroke-[2.5px]' : 'scale-100 stroke-2'}`}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
