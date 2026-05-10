import FoodExplorer from '@/components/FoodExplorer';

export default function FoodPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="page-hero" style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍛</div>
        <h1>Local Food Explorer</h1>
        <p className="tagline">Taste the place, not just visit it — discover authentic dishes near every hidden gem</p>
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
          <div key={dest} style={{ textAlign: 'center', padding: '24px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', transition: 'all var(--dur)' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--gold)', fontSize: 14, marginBottom: 4 }}>{dest}</div>
            <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13, marginBottom: 4 }}>{hero}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>
          </div>
        ))}
      </div>

      <FoodExplorer />
    </div>
  );
}
