const introCards = [
  { icon: '🏖️', title: 'Hidden Gems', desc: 'Discover lesser-known destinations across India with authentic travel experiences away from tourist crowds.' },
  { icon: '💰', title: 'Budget Friendly', desc: 'Smart filtering by budget, transport, and accommodation to match every traveler\'s needs and pocket.' },
  { icon: '🗺️', title: 'Interactive Map', desc: 'Explore on a Leaflet map with state zones, sub-zone drill-down, and real-time location tracking.' },
  { icon: '🔄', title: 'Converters', desc: 'Convert currencies, time zones, distances, weights, and speeds — your all-in-one travel toolkit.' },
  { icon: '✈️', title: 'Travel Planning', desc: 'Detailed info on duration, transport, accommodation and activities for every destination.' },
  { icon: '🤖', title: 'AI Assistant', desc: 'Ask our VIHARA AI anything — get personalized recommendations, budgets, and travel advice instantly.' },
];

const stats = [
  { value: '24+', label: 'Hidden Gems' },
  { value: '4', label: 'States Covered' },
  { value: '₹500', label: 'Trips From' },
  { value: '100%', label: 'Off-Beat' },
];

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '72px 32px 56px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '50px', background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', marginBottom: '24px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.5px' }}>Discover India's Hidden Gems</span>
        </div>
        <h1 className="gradient-text" style={{ fontSize: 'clamp(52px,10vw,88px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.0, marginBottom: '20px' }}>
          VIHARA
        </h1>
        <p style={{ fontSize: 'clamp(16px,2.5vw,22px)', color: 'var(--gold)', fontStyle: 'italic', marginBottom: '16px' }}>
          Wander the Unseen. Discover the Soul of Bharat.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.8 }}>
          Authentic Experiences &nbsp;·&nbsp; Budget Smart &nbsp;·&nbsp; Off-Beat Adventures
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/en/explore" className="btn btn-primary btn-lg">🚀 Start Exploring</a>
          <a href="/en/submit" className="btn btn-secondary" style={{ borderRadius: '50px', padding: '14px 28px', fontSize: '14px' }}>✍️ Share a Gem</a>
        </div>
      </section>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '56px' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass" style={{ padding: '24px', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontFamily: 'var(--heading)', fontSize: '32px', fontWeight: 800, color: 'var(--gold)' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
          Everything You Need to <span className="text-gold">Explore India</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '14px' }}>
          Powerful tools, curated gems, and AI-powered recommendations — all in one place.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '64px' }}>
        {introCards.map((card, i) => (
          <div key={i} className="glass glass-hover" style={{ padding: '28px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 'var(--r-md)', background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '18px', transition: 'transform var(--dur)' }}>
              {card.icon}
            </div>
            <h3 style={{ fontFamily: 'var(--heading)', color: 'var(--gold)', fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>{card.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="glass-gold" style={{ padding: '48px 40px', textAlign: 'center', borderRadius: 'var(--r-xl)', background: 'linear-gradient(135deg, var(--gold-dim), var(--teal-dim))', marginBottom: '20px' }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>💎</div>
        <h2 style={{ fontFamily: 'var(--heading)', fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>
          Know a Hidden Gem?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', maxWidth: 460, margin: '0 auto 28px' }}>
          Help fellow travelers discover the untouched beauty of India. Submit your favourite offbeat location.
        </p>
        <a href="/en/submit" className="btn btn-primary btn-lg">✍️ Submit Your Hidden Gem</a>
      </div>
    </div>
  );
}
