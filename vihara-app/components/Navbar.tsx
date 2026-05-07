'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gradient uppercase tracking-widest">
          Vihara
        </Link>
        <div className="hidden md:flex gap-8 items-center text-sm uppercase tracking-wider">
          <Link href="/" className="hover:text-primary-500 transition-colors">{t('home')}</Link>
          <Link href="/explore" className="hover:text-primary-500 transition-colors">{t('explore')}</Link>
          <Link href="/submit" className="hover:text-primary-500 transition-colors">{t('submit')}</Link>
          <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-4">
            <Link href={pathname} locale="en" className="hover:text-primary-500 text-xs">EN</Link>
            <Link href={pathname} locale="hi" className="hover:text-primary-500 text-xs">HI</Link>
            <Link href={pathname} locale="te" className="hover:text-primary-500 text-xs">TE</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
