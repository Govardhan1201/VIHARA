import StoryGenerator from '@/components/StoryGenerator';
import { getTranslations } from 'next-intl/server';

export default async function StoryPage() {
  const t = await getTranslations('story');

  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <div className="page-hero" style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>{t('title')}</h1>
        <p className="sub">{t('sub')}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
          {[
            { icon: '📷', text: t('step1') },
            { icon: '✨', text: t('step2') },
            { icon: '📋', text: t('step3') }
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--gold)', fontWeight: 800 }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{step.text}</span>
              {i < 2 && <span style={{ color: 'var(--border)' }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      <StoryGenerator />

      <div className="glass" style={{ marginTop: 52, padding: '28px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.75 }}>
          {t('privacy')}
        </p>
      </div>
    </div>
  );
}
