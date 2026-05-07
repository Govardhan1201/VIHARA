import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AIChatbot from '@/components/AIChatbot';
import Cursor from '@/components/Cursor';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
    <html lang={locale} className={`${inter.variable} ${outfit.variable}`}>
      <body style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', overflowX: 'hidden' }}>
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
