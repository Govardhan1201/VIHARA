'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.15 });
    el.querySelectorAll('.reveal').forEach(r => obs.observe(r));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function AboutPage() {
  const t = useTranslations('about');
  const ref = useReveal();
  const steps = t.raw('steps') as { n: string; title: string; desc: string }[];
  const feats = t.raw('features') as { icon: string; title: string; desc: string }[];
  const stats = t.raw('stats') as { value: string; label: string }[];

  return (
    <div ref={ref}>
      {/* ── HERO ── */}
      <section style={{ padding:'100px 0 72px', textAlign:'center', background:'var(--surface)', borderBottom:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 0%,rgba(201,150,90,0.06),transparent 60%)', pointerEvents:'none' }} />
        <div className="container">
          <div className="reveal badge badge-gold" style={{ marginBottom:24, display:'inline-flex' }}>{t('badge')}</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(36px,7vw,72px)', fontWeight:900, color:'var(--text)', marginBottom:24, lineHeight:1.1 }}>
            {t('title')}
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize:'clamp(15px,2vw,18px)', color:'var(--text-muted)', maxWidth:620, margin:'0 auto', lineHeight:1.85 }}>
            {t('desc')}
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding:'56px 0', background:'var(--bg)' }}>
        <div className="container">
          <div className="stats-row reveal">
            {stats.map((s, i) => (
              <div key={i} className="stat-card" style={{ border:'1px solid var(--gold-border)' }}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="section" style={{ background:'var(--surface)' }}>
        <div className="container">
          <div className="reveal section-header" style={{ textAlign:'center' }}>
            <h2 className="section-title">{t('how_title')}</h2>
            <p className="section-sub" style={{ margin:'0 auto' }}>{t('how_sub')}</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:28 }}>
            {steps.map((step, i) => (
              <div key={i} className={`reveal reveal-delay-${i+1}`} style={{ position:'relative', padding:'36px 28px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-20, right:16, fontFamily:'Playfair Display,serif', fontSize:72, fontWeight:900, color:'rgba(201,150,90,0.06)', lineHeight:1 }}>{step.n}</div>
                <div style={{ width:40, height:40, borderRadius:12, background:'var(--gold-dim)', border:'1px solid var(--gold-border)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontWeight:900, color:'var(--gold)', fontSize:15, marginBottom:20 }}>
                  {step.n}
                </div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:'var(--text)', marginBottom:12 }}>{step.title}</h3>
                <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.75 }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{ position:'absolute', top:'50%', right:-14, transform:'translateY(-50%)', width:28, height:28, background:'var(--gold-dim)', border:'1px solid var(--gold-border)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)', fontSize:12, zIndex:2 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="container">
          <div className="reveal section-header" style={{ textAlign:'center' }}>
            <div className="badge badge-teal" style={{ marginBottom:16 }}>✦ Features</div>
            <h2 className="section-title">{t('features_title')}</h2>
          </div>
          <div className="feat-grid">
            {feats.map((feat, i) => (
              <div key={i} className={`feat-card reveal reveal-delay-${(i%4)+1}`}>
                <div className="feat-icon">{feat.icon}</div>
                <div className="feat-title">{feat.title}</div>
                <p className="feat-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section style={{ padding:'80px 0', background:'var(--surface)', borderTop:'1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth:720 }}>
          <div className="reveal" style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(40px,8vw,80px)', fontWeight:900, color:'var(--text)', opacity:0.06, letterSpacing:-4, lineHeight:0.8, marginBottom:32 }}>VIHARA</div>
            <blockquote style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(18px,3vw,26px)', fontStyle:'italic', color:'var(--text-muted)', lineHeight:1.8, marginBottom:32, borderLeft:'3px solid var(--gold)', paddingLeft:24, textAlign:'left' }}>
              "विहार" — a Sanskrit word meaning a pleasant wandering, a soulful stroll through beautiful places, a journey without destination.
            </blockquote>
            <p style={{ fontSize:15, color:'var(--text-muted)', lineHeight:1.9 }}>
              VIHARA exists to make this wandering intelligent — helping you find the valleys that don't have tourist signs, the dishes that only locals know, and the quiet mornings that peak crowds will never find.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
