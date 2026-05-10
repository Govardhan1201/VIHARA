import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AIChatbot from '@/components/AIChatbot';
import Cursor from '@/components/Cursor';

export const metadata: Metadata = {
  title: "VIHARA | Discover India's Hidden Gems",
  description: "Wander the Unseen. Discover the Soul of Bharat. Authentic off-beat destinations across India.",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Cursor />
          <AppHeader />
          <main className="main-content">
            {children}
          </main>
          <AIChatbot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
