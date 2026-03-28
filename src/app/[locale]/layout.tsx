import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import MobileLayout from '@/components/layout/MobileLayout';
import '../globals.css';

export const metadata: Metadata = {
  title: 'MotoTracker',
  description: 'Your ultimate motorcycle companion',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MobileLayout>
            {children}
          </MobileLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
