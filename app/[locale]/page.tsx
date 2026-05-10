import StoryGenerator from '@/components/StoryGenerator';
import FoodExplorer from '@/components/FoodExplorer';
import CrowdPredictor from '@/components/CrowdPredictor';

const stats = [
  { value: '24+', label: 'Hidden Gems' },
  { value: '8', label: 'Destinations' },
  { value: '₹500', label: 'Trips From' },
  { value: 'AI', label: 'Powered' },
];

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '72px 32px 56px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 50, background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.5px' }}>Discover India's Hidden Gems</span>
        </div>
        <h1 className="gradient-text" style={{ fontSize: 'clamp(52px,10vw,88px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.0, marginBottom: 20 }}>
          VIHARA
        </h1>
        <p style={{ fontSize: 'clamp(16px,2.5vw,22px)', color: 'var(--gold)', fontStyle: 'italic', marginBottom: 16 }}>
          Wander the Unseen. Discover the Soul of Bharat.
        </p>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.8 }}>
          Authentic Experiences &nbsp;·&nbsp; Budget Smart &nbsp;·&nbsp; Off-Beat Adventures
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/en/explore" className="btn btn-primary btn-lg">🚀 Start Exploring</a>
          <a href="/en/story" className="btn btn-secondary" style={{ borderRadius: 50, padding: '14px 28px', fontSize: 14 }}>✨ Create Travel Story</a>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 64 }}>
        {stats.map(s => (
          <div key={s.label} className="glass" style={{ padding: 24, textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--gold)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── WHAT YOU CAN DO ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          Everything You Need to <span className="text-gold">Explore India</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14 }}>
          Curated hidden gems, AI storytelling, local food discovery, and crowd-aware travel planning.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18, marginBottom: 72 }}>
        {[
          { icon: '🏖️', title: 'Hidden Gems', desc: 'Discover lesser-known destinations across India with authentic travel experiences away from tourist crowds.', href: '/en/explore' },
          { icon: '🗺️', title: 'Interactive Map', desc: 'Explore on a Leaflet map with state zones, sub-zone drill-down and real-time location tracking.', href: '/en/explore' },
          { icon: '🔄', title: 'Converters', desc: 'Convert currencies, time zones, distances, weights, and speeds — your all-in-one travel toolkit.', href: '/en/converters' },
          { icon: '💡', title: 'Travel Tips', desc: '9 curated tips + emergency numbers + a pre-trip checklist for smarter, safer adventures.', href: '/en/tips' },
          { icon: '✍️', title: 'Share a Gem', desc: 'Submit your favourite offbeat spot and help other travelers discover the untouched beauty of India.', href: '/en/submit' },
          { icon: '🤖', title: 'AI Assistant', desc: 'Ask VIHARA AI anything — destination recs, budget advice, and local insights powered by Gemini.', href: '/en/explore' },
        ].map(card => (
          <a key={card.title} href={card.href} style={{ textDecoration: 'none' }}>
            <div className="glass glass-hover" style={{ padding: 28, borderRadius: 'var(--r-lg)', height: '100%' }}>
              <div style={{ width: 52, height: 52, borderRadius: 'var(--r-md)', background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18 }}>
                {card.icon}
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--gold)', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{card.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* ── AI FEATURES SECTION ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 50, background: 'rgba(50,184,198,0.08)', border: '1px solid rgba(50,184,198,0.2)', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.5px' }}>✦ NEW AI FEATURES</span>
        </div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          Travel Smarter with <span className="text-teal">AI Assistance</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 14 }}>
          Three intelligent layers designed to deepen discovery, tell better stories, and help you travel at the right time.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 20, marginBottom: 72 }}>
        <StoryGenerator compact />
        <FoodExplorer compact />
        <CrowdPredictor compact />
      </div>

      {/* ── STORY TEASER ──────────────────────────────────────────────────── */}
      <div className="glass glass-gold" style={{ padding: '52px 44px', textAlign: 'center', borderRadius: 'var(--r-xl)', background: 'linear-gradient(135deg, var(--gold-dim), var(--teal-dim))', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: 42, marginBottom: 16 }}>✨</div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Turn Your Memories Into Stories
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.8 }}>
          Upload your travel photos and let VIHARA AI craft a cinematic travel journal — soulful, specific, and ready to share.
        </p>
        <a href="/en/story" className="btn btn-primary btn-lg">✨ Try Story Generator</a>
      </div>
    </div>
  );
}
