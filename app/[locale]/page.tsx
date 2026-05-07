import { useTranslations } from 'next-intl';
import Hero3D from '@/components/Hero3D';
import Navbar from '@/components/Navbar';
import { Link } from '@/i18n/routing';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <main className="relative min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Hero3D />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-slate-950 z-0"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <Link 
            href="/explore" 
            className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-semibold transition-all transform hover:scale-105"
          >
            {t('exploreBtn')}
          </Link>
        </div>
      </section>

      {/* Intro section */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="glass-effect p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="h-12 w-12 bg-primary-500/20 rounded-xl mb-6 flex items-center justify-center text-primary-500">
                ★
              </div>
              <h3 className="text-xl font-bold mb-4">Discover</h3>
              <p className="text-slate-400">Explore untouched regions of India that remain hidden from typical tourist maps.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
