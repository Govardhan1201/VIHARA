'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { path: '', icon: '🏠', label: 'Home', sub: 'Welcome to VIHARA' },
  { path: '/explore', icon: '🗺️', label: 'Explore', sub: 'Discover destinations' },
  { path: '/story', icon: '✨', label: 'Travel Stories', sub: 'AI photo-to-story' },
  { path: '/food', icon: '🍛', label: 'Local Food', sub: 'Taste every destination' },
  { path: '/submit', icon: '✍️', label: 'Submit Gem', sub: 'Share your hidden gem' },
  { path: '/converters', icon: '💱', label: 'Converters', sub: 'Unit & currency tools' },
  { path: '/tips', icon: '💡', label: 'Travel Tips', sub: 'Helpful advice' },
  { path: '/admin', icon: '🔐', label: 'Admin Panel', sub: 'Approve submissions' },
];

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || '/';
  // strip locale: /en/explore → /explore, /en → ''
  const currentPath = pathname.replace(/^\/(en|hi|te)/, '') || '';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navigate = (path: string) => {
    const locale = pathname.split('/')[1] || 'en';
    router.push(`/${locale}${path}`);
    setOpen(false);
  };

  return (
    <>
      {/* ── TOP BAR ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: scrolled ? 'rgba(10,12,12,0.97)' : 'rgba(13,15,15,0.9)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(250,196,150,0.25)' : 'rgba(255,255,255,0.07)'}`,
        zIndex: 1000, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 28px',
        transition: 'all 280ms ease',
      }}>
        <button onClick={() => navigate('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/41df026d-c095-4b1f-8b52-455c3571b0ef"
            alt="VIHARA" style={{ height: 38, width: 'auto', filter: 'drop-shadow(0 0 10px rgba(250,196,150,0.3))' }} />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 900, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase' }}>
            VIHARA
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 11, color: 'rgba(200,202,202,0.5)', letterSpacing: '1px', textTransform: 'uppercase', display: 'none' }}>
            Discover India
          </span>
          <button onClick={() => setOpen(o => !o)} aria-label="Menu" style={{
            width: 42, height: 42, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, cursor: 'pointer', transition: 'all 280ms ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(250,196,150,0.1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(250,196,150,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 20, height: 2, background: 'var(--gold)',
                borderRadius: 2, transformOrigin: 'center',
                transition: 'all 280ms ease',
                transform: open
                  ? i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 1 ? 'scaleX(0)' : 'rotate(-45deg) translate(5px, -5px)'
                  : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </header>

      {/* ── OVERLAY ── */}
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', zIndex: 998, animation: 'fadeIn 0.2s ease',
        }} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, width: 285, height: '100vh',
        background: 'rgba(10,12,12,0.99)',
        borderRight: '1px solid rgba(250,196,150,0.2)',
        boxShadow: '4px 0 40px rgba(0,0,0,0.7)',
        zIndex: 999, paddingTop: 64, display: 'flex', flexDirection: 'column',
        overflowY: 'auto', overflowX: 'hidden',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 280ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Sidebar Brand */}
        <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--gold)', fontWeight: 800, fontSize: 14, letterSpacing: 2, marginBottom: 3 }}>VIHARA</div>
          <div style={{ fontSize: 11, color: 'rgba(200,202,202,0.45)' }}>Wander the Unseen · Discover Bharat</div>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '8px 12px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(200,202,202,0.3)', padding: '14px 12px 8px' }}>Main Navigation</div>
          {navItems.map(item => {
            const active = currentPath === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                padding: active ? '12px 14px 12px 11px' : '12px 14px',
                borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                background: active ? 'rgba(250,196,150,0.08)' : 'transparent',
                border: 'none',
                borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                color: active ? 'var(--gold)' : 'rgba(200,202,202,0.7)',
                marginBottom: 2, transition: 'all 200ms ease',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: active ? 'rgba(250,196,150,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'rgba(250,196,150,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1, fontFamily: 'Inter, sans-serif' }}>{item.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.55, fontFamily: 'Inter, sans-serif' }}>{item.sub}</div>
                </div>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(200,202,202,0.3)', textAlign: 'center' }}>
          VIHARA © 2025 · Hidden Gems of India
        </div>
      </aside>

      <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
    </>
  );
}
