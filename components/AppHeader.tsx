'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const NAV = [
  { path: '', label: { en:'Home', hi:'होम', te:'హోమ్' } },
  { path: '/explore', label: { en:'Explore', hi:'अन्वेषण', te:'అన్వేషించు' } },
  { path: '/story', label: { en:'Stories', hi:'कहानियाँ', te:'కథలు' } },
  { path: '/food', label: { en:'Local Food', hi:'व्यंजन', te:'ఆహారం' } },
  { path: '/crowd', label: { en:'Crowd AI', hi:'भीड़ AI', te:'జన AI' } },
  { path: '/converters', label: { en:'Convert', hi:'कनवर्टर', te:'కన్వర్టర్' } },
  { path: '/tips', label: { en:'Tips', hi:'टिप्स', te:'సూచనలు' } },
  { path: '/submit', label: { en:'Submit Gem', hi:'सुझाएं', te:'సమర్పించు' } },
  { path: '/guide', label: { en:'How It Works', hi:'यह कैसे काम करता है', te:'ఇది ఎలా పనిచేస్తుంది' } },
  { path: '/about', label: { en:'About', hi:'बारे में', te:'గురించి' } },
];

type Locale = 'en' | 'hi' | 'te';

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || '/';
  const locale = useLocale() as Locale;
  const currentPath = pathname.replace(/^\/(en|hi|te)/, '') || '';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navigate = (path: string) => { router.push(`/${locale}${path}`); setMenuOpen(false); };
  const switchLocale = (l: string) => router.push(`/${l}${currentPath}`);

  const navLabel = (item: typeof NAV[0]) => item.label[locale] || item.label.en;

  return (
    <>
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:900,
        background: scrolled ? 'rgba(8,12,12,0.98)' : 'rgba(8,12,12,0.6)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(201,150,90,0.2)' : 'rgba(255,255,255,0.05)'}`,
        transition:'all 300ms ease', display:'flex', alignItems:'flex-start',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', width:'100%', paddingTop: 10, paddingBottom: 10 }}>
          {/* Left Stack: Logo + Menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => navigate('')} style={{ background:'none', border:'none', cursor:'pointer', padding: 0 }}>
              <span style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:900, letterSpacing:4, color:'var(--gold)', textTransform:'uppercase' }}>VIHARA</span>
            </button>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              background: 'none', border: 'none', padding: 0,
              display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer',
              width: 32
            }}>
              <span style={{ display: 'block', width: '100%', height: 2, background: 'var(--text)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span style={{ display: 'block', width: '70%', height: 2, background: 'var(--text)', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '85%', height: 2, background: 'var(--text)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>

          {/* Right controls */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Lang Switcher */}
            <div className="lang-switcher" style={{ display:'flex' }}>
              {(['en','hi','te'] as Locale[]).map(l => (
                <button key={l} className={`lang-btn${locale===l?' active':''}`} onClick={() => switchLocale(l)}>
                  {l==='en'?'EN':l==='hi'?'हि':'తె'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay */}
      {menuOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(8,12,12,0.97)', backdropFilter:'blur(20px)', zIndex:890, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, animation:'fadeIn 0.2s ease' }}>
          {NAV.map(item => {
            const active = currentPath === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                background:'none', border:'none', cursor:'pointer', fontFamily:'Playfair Display,serif',
                fontSize:'clamp(22px,5vw,36px)', fontWeight:700, color: active ? 'var(--gold)' : 'var(--text-muted)',
                padding:'10px 24px', transition:'all var(--dur)',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color='var(--text)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color=active?'var(--gold)':'var(--text-muted)'}
              >
                {navLabel(item)}
              </button>
            );
          })}
          {/* Lang switcher in menu */}
          <div className="lang-switcher" style={{ marginTop:24 }}>
            {(['en','hi','te'] as Locale[]).map(l => (
              <button key={l} className={`lang-btn${locale===l?' active':''}`} onClick={() => { switchLocale(l); setMenuOpen(false); }}>
                {l==='en'?'English':l==='hi'?'हिंदी':'తెలుగు'}
              </button>
            ))}
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ position:'absolute', top:24, right:24, background:'var(--card)', border:'1px solid var(--border)', borderRadius:'50%', width:44, height:44, fontSize:18, color:'var(--text-muted)', cursor:'pointer' }}>✕</button>
        </div>
      )}

      <style>{`
        @media(max-width:900px){ .desktop-nav { display:none !important; } }
        @media(min-width:901px){ }
      `}</style>
    </>
  );
}
