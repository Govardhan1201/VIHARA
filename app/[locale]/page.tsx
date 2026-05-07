import Link from 'next/link';

const introCards = [
  { icon: '🏖️', title: 'Hidden Gems', desc: 'Discover lesser-known destinations across India with authentic travel experiences away from the tourist crowds.' },
  { icon: '💰', title: 'Budget Friendly', desc: 'Smart filtering by budget, transport, and accommodation to match every traveler\'s needs and pocket.' },
  { icon: '🗺️', title: 'Interactive Map', desc: 'Explore destinations on an interactive map with state zones, sub-zones and real-time location tracking.' },
  { icon: '🔄', title: 'Converters', desc: 'Convert currencies, time zones, distances, weights, and speeds instantly — your all-in-one travel toolkit.' },
  { icon: '✈️', title: 'Travel Planning', desc: 'Get detailed information on duration, transport options, and activities for every destination.' },
  { icon: '🎯', title: 'Share Your Gems', desc: 'Submit your own hidden gem locations and help other travelers discover the untouched beauty of India.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '64px 24px 48px', borderBottom: '1px solid var(--border-color)', marginBottom: '48px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🌍</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px', color: 'var(--text-primary)' }}>
          VIHARA
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--accent-gold)', fontStyle: 'italic', marginBottom: '16px' }}>
          Wander the Unseen. Discover the Soul of Bharat.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.7 }}>
          Authentic Experiences &nbsp;•&nbsp; Budget Smart &nbsp;•&nbsp; Off-Beat Adventures
        </p>
        <Link href="/explore">
          <button className="btn-gold" style={{ fontSize: '15px', padding: '14px 36px', borderRadius: '50px' }}>
            🚀 Start Exploring
          </button>
        </Link>
      </section>

      {/* Intro Cards */}
      <div className="intro-cards-grid">
        {introCards.map((card, i) => (
          <div key={i} className="intro-card">
            <div className="intro-card-icon">{card.icon}</div>
            <div className="intro-card-title">{card.title}</div>
            <p className="intro-card-desc">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center', marginTop: '60px', padding: '48px 24px', background: 'rgba(250,196,150,0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Know a Hidden Gem? 💎
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Share your favorite offbeat destination with the VIHARA community.
        </p>
        <Link href="/submit">
          <button className="btn-outline">✍️ Submit Your Hidden Gem</button>
        </Link>
      </div>
    </div>
  );
}
