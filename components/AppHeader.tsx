'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: '🏠', label: 'Home', sub: 'Welcome to VIHARA' },
  { href: '/explore', icon: '🗺️', label: 'Explore', sub: 'Discover destinations' },
  { href: '/submit', icon: '✍️', label: 'Submit Gem', sub: 'Share your hidden gem' },
  { href: '/converters', icon: '💱', label: 'Converters', sub: 'Unit & currency tools' },
  { href: '/tips', icon: '💡', label: 'Travel Tips', sub: 'Helpful advice' },
  { href: '/admin', icon: '🔐', label: 'Admin Panel', sub: 'Approve submissions' },
];

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rawPath = usePathname() || '/';
  const pathname = rawPath.replace(/^\/(en|hi|te)/, '') || '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
        <a href="/en" className="app-logo">
          <img src="https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/41df026d-c095-4b1f-8b52-455c3571b0ef" alt="VIHARA" />
          <span>VIHARA</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Discover India
          </span>
          <button className="hamburger-btn" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span style={{ transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' }} />
            <span style={{ transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </header>

      <div className={`sidebar-overlay ${open ? 'active' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`sidebar ${open ? 'active' : ''}`}>
        <div className="sidebar-brand">
          <div style={{ fontFamily: 'var(--heading)', color: 'var(--gold)', fontWeight: 800, fontSize: '16px', letterSpacing: '2px' }}>VIHARA</div>
          <p>Wander the Unseen · Discover Bharat</p>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Navigation</div>
          {navItems.map(item => (
            <a
              key={item.href}
              href={`/en${item.href === '/' ? '' : item.href}`}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <div className="icon">{item.icon}</div>
              <div className="info">
                <span className="label">{item.label}</span>
                <span className="sub">{item.sub}</span>
              </div>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">VIHARA © 2025</div>
      </aside>
    </>
  );
}
