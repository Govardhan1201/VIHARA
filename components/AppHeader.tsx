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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rawPath = usePathname();
  // strip locale prefix
  const pathname = rawPath.replace(/^\/(en|hi|te)/, '') || '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setSidebarOpen(false);

  return (
    <>
      <header className="app-header" style={{ boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none' }}>
        <a href="/" className="app-logo">
          <img src="https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/41df026d-c095-4b1f-8b52-455c3571b0ef" alt="VIHARA Logo" />
          <span>VIHARA</span>
        </a>
        <button className="hamburger-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
          <span style={{ transform: sidebarOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ opacity: sidebarOpen ? 0 : 1 }} />
          <span style={{ transform: sidebarOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </header>

      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={close} />

      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              onClick={close}
            >
              <span className="icon">{item.icon}</span>
              <div>
                <div className="label">{item.label}</div>
                <div className="sub">{item.sub}</div>
              </div>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          VIHARA © 2025 · Wander the Unseen
        </div>
      </aside>
    </>
  );
}
