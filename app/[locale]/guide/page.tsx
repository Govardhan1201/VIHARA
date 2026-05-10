'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GuidePage() {
  const t = useTranslations('guide');
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      id: 'itinerary',
      icon: '🗺️',
      title: t('f_itinerary_title'),
      description: t('f_itinerary_desc'),
      steps: [t('f_itinerary_s1'), t('f_itinerary_s2'), t('f_itinerary_s3'), t('f_itinerary_s4')]
    },
    {
      id: 'explore',
      icon: '🌍',
      title: t('f_explore_title'),
      description: t('f_explore_desc'),
      steps: [t('f_explore_s1'), t('f_explore_s2'), t('f_explore_s3'), t('f_explore_s4')]
    },
    {
      id: 'story',
      icon: '✨',
      title: t('f_story_title'),
      description: t('f_story_desc'),
      steps: [t('f_story_s1'), t('f_story_s2'), t('f_story_s3'), t('f_story_s4')]
    },
    {
      id: 'food',
      icon: '🍛',
      title: t('f_food_title'),
      description: t('f_food_desc'),
      steps: [t('f_food_s1'), t('f_food_s2'), t('f_food_s3')]
    },
    {
      id: 'crowd',
      icon: '🧭',
      title: t('f_crowd_title'),
      description: t('f_crowd_desc'),
      steps: [t('f_crowd_s1'), t('f_crowd_s2'), t('f_crowd_s3')]
    },
    {
      id: 'converters',
      icon: '💱',
      title: t('f_converters_title'),
      description: t('f_converters_desc'),
      steps: [t('f_converters_s1'), t('f_converters_s2'), t('f_converters_s3')]
    },
    {
      id: 'submit',
      icon: '✍️',
      title: t('f_submit_title'),
      description: t('f_submit_desc'),
      steps: [t('f_submit_s1'), t('f_submit_s2'), t('f_submit_s3'), t('f_submit_s4')]
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.guide-card');
    
    gsap.fromTo(cards, 
      { y: 50, opacity: 0 }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: 'power3.out',
        delay: 0.1
      }
    );
  }, []);

  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }} ref={containerRef}>
      <div className="page-hero">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>📖 {t('title')}</h1>
        <p className="sub">{t('sub')}</p>
      </div>

      <div style={{ display: 'grid', gap: 32 }}>
        {features.map((f, index) => (
          <div key={f.id} className="glass guide-card" style={{ padding: '32px', borderRadius: 'var(--r-lg)', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {f.icon}
              </div>
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--gold)', margin: 0 }}>{f.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '4px 0 0' }}>{f.description}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>{t('step_by_step')}</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {f.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, fontWeight: 700 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: 24 }}>
               <a href={`./${f.id}`} className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>{t('try_btn')} {f.title} →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
