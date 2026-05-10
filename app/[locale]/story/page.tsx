import StoryGenerator from '@/components/StoryGenerator';

export default function StoryPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div className="page-hero" style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
        <h1>AI Travel Story Generator</h1>
        <p className="tagline">Turn your travel memories into a cinematic journal — soulful, specific, and yours to keep</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
          {['📷 Upload your photos', '✨ AI crafts your story', '📋 Share your journey'].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--gold)', fontWeight: 800 }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{step}</span>
              {i < 2 && <span style={{ color: 'var(--border)' }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      <StoryGenerator />

      <div style={{ marginTop: 52, padding: '28px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.75 }}>
          Stories are generated in the tone of Vihara — offbeat, soulful, and rooted in India's hidden places.<br />
          Your photos stay private and are not stored. Every story is yours alone.
        </p>
      </div>
    </div>
  );
}
