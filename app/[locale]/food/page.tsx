import FoodExplorer from '@/components/FoodExplorer';
import { getTranslations } from 'next-intl/server';

export default async function FoodPage() {
  const t = await getTranslations('food');

  return (
    <div className="container" style={{ maxWidth: 1100, paddingBottom: 80 }}>
      <div className="page-hero" style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍛</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>{t('title')}</h1>
        <p className="sub">{t('sub')}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
          {['🌿 Tribal', '🌊 Coastal', '🛺 Street Food', '🌱 Vegetarian', '🍮 Dessert', '☕ Beverage'].map(cat => (
            <span key={cat} style={{ padding: '5px 14px', borderRadius: 50, background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', fontSize: 12, color: 'var(--gold)' }}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Cultural intro */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { icon: '🎋', dest: 'Araku', hero: 'Bamboo Chicken', sub: 'A slow-fire tribal tradition' },
          { icon: '🦐', dest: 'Vizag', hero: 'Royyala Vepudu', sub: 'Coastal spice at its peak' },
          { icon: '🐟', dest: 'Goa', hero: 'Fish Curry Rice', sub: 'The soul of the coast' },
          { icon: '🫙', dest: 'Rajasthan', hero: 'Dal Baati Churma', sub: 'A desert warrior feast' },
        ].map(({ icon, dest, hero, sub }) => (
          <div key={dest} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: 'var(--gold)', fontSize: 16, marginBottom: 4 }}>{dest}</div>
            <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, marginBottom: 4 }}>{hero}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      <FoodExplorer />
    </div>
  );
}
