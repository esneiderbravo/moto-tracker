'use client';

import { usePathname } from '@/i18n/routing';
import BottomNav from './BottomNav';
import SplashScreen from '@/components/ui/SplashScreen';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('/register') || pathname.includes('/login');

  return (
    <div className="w-screen h-screen mx-auto relative overflow-hidden bg-background sm:w-[414px] sm:h-[850px] sm:border-[8px] sm:border-border sm:rounded-[40px] sm:mt-[4vh] sm:shadow-2xl">
      <SplashScreen />
      <main className={`${isAuthPage ? 'h-full' : 'h-[calc(100%-70px)]'} overflow-y-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
        {children}
      </main>
      {!isAuthPage && <BottomNav />}
    </div>
  );
}
