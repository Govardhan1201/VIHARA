import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ maxWidth: 520 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🗺️</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,8vw,56px)', fontWeight: 900, color: 'var(--gold)', marginBottom: 12, letterSpacing: '-1px' }}>
          Lost on the Map
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 36 }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back to exploring India's hidden gems.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ padding: '13px 32px', borderRadius: 50, background: 'linear-gradient(135deg,#C9965A,#e8b87a)', color: '#1a0f00', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            🏠 Go Home
          </Link>
          <Link href="/en/explore" style={{ padding: '13px 32px', borderRadius: 50, background: 'transparent', color: 'var(--text-muted)', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            🌍 Explore Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
