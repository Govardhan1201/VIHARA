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
        position:'fixed', top:0, left:0, right:0, height:'var(--nav-h)', zIndex:900,
        background: scrolled ? 'rgba(8,12,12,0.98)' : 'rgba(8,12,12,0.6)',
        backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(201,150,90,0.2)' : 'rgba(255,255,255,0.05)'}`,
        transition:'all 300ms ease', display:'flex', alignItems:'center',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', gap:24, width:'100%' }}>
          {/* Logo */}
          <button onClick={() => navigate('')} style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:900, letterSpacing:3, color:'var(--gold)', textTransform:'uppercase' }}>VIHARA</span>
          </button>

          {/* Nav Links — desktop */}
          <nav style={{ flex:1, display:'flex', gap:2, justifyContent:'center', flexWrap:'nowrap', overflow:'hidden' }} className="desktop-nav">
            {NAV.filter(n => n.path !== '').slice(0, 7).map(item => {
              const active = currentPath === item.path;
              return (
                <button key={item.path} onClick={() => navigate(item.path)} style={{
                  padding:'7px 14px', background:'none', border:'none', cursor:'pointer',
                  fontFamily:'DM Sans,sans-serif', fontSize:13, fontWeight:600,
                  color: active ? 'var(--gold)' : 'var(--text-muted)',
                  borderRadius:'var(--r-sm)', transition:'all var(--dur)',
                  whiteSpace:'nowrap',
                }}
                  onMouseEnter={e => { if(!active)(e.currentTarget as HTMLButtonElement).style.color='var(--text)'; }}
                  onMouseLeave={e => { if(!active)(e.currentTarget as HTMLButtonElement).style.color='var(--text-muted)'; }}
                >
                  {navLabel(item)}
                  {active && <span style={{ display:'block', height:2, background:'var(--gold)', borderRadius:2, marginTop:2 }} />}
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, marginLeft:'auto' }}>
            {/* Lang Switcher */}
            <div className="lang-switcher" style={{ display:'flex' }}>
              {(['en','hi','te'] as Locale[]).map(l => (
                <button key={l} className={`lang-btn${locale===l?' active':''}`} onClick={() => switchLocale(l)}>
                  {l==='en'?'EN':l==='hi'?'हि':'తె'}
                </button>
              ))}
            </div>

            {/* Submit CTA — desktop */}
            <button onClick={() => navigate('/submit')} className="btn btn-primary btn-sm" style={{ display:'flex', borderRadius:50 }}>
              + Submit
            </button>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(o => !o)} style={{
              width:40, height:40, background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:'var(--r-sm)', display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:5, cursor:'pointer', transition:'all var(--dur)',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor='var(--gold-border)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor='var(--border)'}
            >
              {[0,1,2].map(i => (
                <span key={i} style={{ display:'block', width:18, height:2, background:'var(--text-muted)', borderRadius:2, transition:'all var(--dur)',
                  transform: menuOpen ? (i===0?'rotate(45deg) translate(5px,5px)':i===1?'scaleX(0)':'rotate(-45deg) translate(5px,-5px)') : 'none',
                  opacity: menuOpen && i===1 ? 0 : 1,
                }} />
              ))}
            </button>
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
