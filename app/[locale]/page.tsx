import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';

const FEATURES = [
  { icon:'🗺️', key:'0' }, { icon:'✨', key:'1' }, { icon:'🍛', key:'2' },
  { icon:'🧭', key:'3' }, { icon:'💱', key:'4' }, { icon:'💡', key:'5' },
];

export default async function HomePage() {
  const t = await getTranslations('home');
  const ta = await getTranslations('about');

  return (
    <>
      {/* ── VIDEO HERO ── */}
      <section className="hero" style={{ marginTop:'-72px' }}>
        {/* Fallback gradient (always shown behind video) */}
        <div className="hero-fallback" style={{
          background: 'linear-gradient(135deg,#080C0C 0%,#0d1a14 35%,#0c100a 60%,#0a0f18 100%)',
          animation: 'none',
        }}>
          {/* Decorative orbs */}
          <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(201,150,90,0.07) 0%,transparent 70%)', top:'20%', left:'10%', pointerEvents:'none' }} />
          <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(78,205,196,0.05) 0%,transparent 70%)', bottom:'10%', right:'15%', pointerEvents:'none' }} />
        </div>
        {/* User-replaceable video — place your video at /public/videos/hero.mp4 */}
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingBottom: '10vh' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(50px, 12vw, 120px)', fontWeight: 900, letterSpacing: '0.15em', margin: 0, textTransform: 'uppercase', textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.6)', color: 'var(--gold)' }}>VIHARA</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(14px, 3vw, 20px)', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 10px rgba(0,0,0,0.8)', marginTop: '16px' }}>Discover the soul of Bharat</p>
        </div>
        <style>{`
          @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          .ai-link:hover { border-color: var(--teal-border) !important; transform: translateX(4px) !important; }
        `}</style>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="section" style={{ background:'var(--bg)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign:'center' }}>
            <div className="badge badge-gold section-badge">{t('features_title')}</div>
            <h2 className="section-title">{t('features_sub')}</h2>
          </div>
          <div className="feat-grid">
            {FEATURES.map((f, i) => {
              const feats = ta.raw('features') as any[];
              const feat = feats[i];
              const hrefs = ['./explore','./story','./food','./crowd','./converters','./tips'];
              return (
                <a key={i} href={hrefs[i]} style={{ textDecoration:'none' }}>
                  <div className="feat-card">
                    <div className="feat-icon">{f.icon}</div>
                    <div className="feat-title">{feat?.title}</div>
                    <p className="feat-desc">{feat?.desc}</p>
                    <div style={{ marginTop:20, fontSize:12, color:'var(--gold)', fontWeight:600 }}>Explore →</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI FEATURES STRIP ── */}
      <section className="section" style={{ background:'var(--surface)' }}>
        <div className="container">
          <div className="ai-grid">
            <div>
              <div className="badge badge-teal" style={{ marginBottom:20 }}>✦ AI Powered</div>
              <h2 className="section-title">{t('ai_title')}</h2>
              <hr className="section-divider" />
              <p style={{ color:'var(--text-muted)', fontSize:15, lineHeight:1.8, marginBottom:32 }}>{t('ai_sub')}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[['✨','AI Travel Story Generator','./story'],['🧭','Crowd Prediction AI','./crowd'],['🍛','Local Food Explorer','./food']].map(([icon,label,href]) => (
                  <a key={href} href={href} className="ai-link" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', textDecoration:'none', transition:'all var(--dur)' }}>
                    <span style={{ fontSize:22 }}>{icon}</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', fontWeight:600, color:'var(--text)', fontSize:14 }}>{label}</span>
                    <span style={{ marginLeft:'auto', color:'var(--teal)', fontSize:14 }}>→</span>
                  </a>
                ))}
              </div>
            </div>
            <div style={{ position:'relative', display:'grid', gap:16 }}>
              {[{icon:'📷',t:'Upload travel photos',d:'Share your journey images with VIHARA AI'},
                {icon:'🤖',t:'AI crafts your story',d:'Gemini writes a cinematic, soulful travel journal'},
                {icon:'📋',t:'Share & remember',d:'Copy your story or social caption instantly'}].map((s, idx) => (
                <div key={s.t} className="step-card">
                  <div className="step-line" />
                  <div style={{ width:44, height:44, background:'var(--teal-dim)', border:'1px solid var(--teal-border)', borderRadius:'var(--r-sm)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, zIndex:1 }}>{s.icon}</div>
                  <div style={{ zIndex:1 }}>
                    <div style={{ fontWeight:700, color:'var(--text)', marginBottom:4, fontSize:14 }}>{s.t}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.5 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign:'center', padding:'72px 32px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%,rgba(201,150,90,0.08),transparent 60%)', pointerEvents:'none' }} />
            <div className="badge badge-gold" style={{ marginBottom:24 }}>🌍 Ready to Wander?</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,5vw,48px)', fontWeight:900, marginBottom:16, color:'var(--text)' }}>
              Discover the <span className="gradient-text">Unseen India</span>
            </h2>
            <p style={{ color:'var(--text-muted)', marginBottom:40, fontSize:16, maxWidth:500, margin:'0 auto 40px' }}>
              Hidden valleys, tribal cultures, coastal secrets — all in one place, powered by AI.
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <a href="./explore" className="btn btn-primary" style={{ padding:'14px 32px', fontSize:15 }}>Start Exploring</a>
              <a href="./about" className="btn btn-secondary" style={{ padding:'14px 32px', fontSize:15 }}>Learn About VIHARA</a>
            </div>
          </div>
        </div>
      </section>

      {/* Video placeholder note */}
      <div style={{ display:'none' }}>Add your travel video to /public/videos/hero.mp4 to enable the video hero background</div>
    </>
  );
}
