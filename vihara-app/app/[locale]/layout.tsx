import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Cursor from '@/components/Cursor';
import AIChatbot from '@/components/AIChatbot';
import SmoothLoader from '@/components/SmoothLoader';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "VIHARA | Discover India's Hidden Gems",
  description: "A premium travel guide to India's untouched destinations.",
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-white font-sans overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <SmoothLoader />
          <Cursor />
          {children}
          <AIChatbot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
