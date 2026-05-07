const tips = [
  { icon: '📋', title: 'Packing Tips', desc: 'Pack light and layer your clothes for changing climates. Bring a good camera, a portable charger, and don\'t forget comprehensive travel insurance for peace of mind.' },
  { icon: '💳', title: 'Money Matters', desc: 'Carry some cash alongside your cards, as remote destinations may lack card terminals. Inform your bank of travel dates and research local ATM locations in advance.' },
  { icon: '🏨', title: 'Accommodation', desc: 'Book stays in advance for popular hidden gems that tend to fill up fast. Always read recent reviews and verify authenticity before committing.' },
  { icon: '🚗', title: 'Transportation', desc: 'Use trusted local transport apps like Ola or Rapido. Negotiate taxi fares beforehand and prefer daytime travel for unfamiliar routes and mountain roads.' },
  { icon: '🍽️', title: 'Food Safety', desc: 'Eat where locals eat — that\'s usually the freshest and most authentic food. Stay well-hydrated, especially in hot climates, and carry water purification tablets.' },
  { icon: '📱', title: 'Connectivity', desc: 'Get a local SIM card for data. Download offline maps on Google Maps before you leave. Always share your daily itinerary with a trusted family member or friend.' },
  { icon: '🌿', title: 'Eco Travel', desc: 'Leave no trace. Carry a reusable water bottle, say no to single-use plastics, and respect local wildlife and ecosystems for future generations to enjoy.' },
  { icon: '🏥', title: 'Health & Safety', desc: 'Carry a basic first-aid kit with medicines for common ailments. Check if any vaccinations are needed and keep emergency numbers — local police and hospital — saved on your phone.' },
  { icon: '🌦️', title: 'Weather & Seasons', desc: 'Research the best season to visit each destination. Monsoons can make some areas inaccessible, while winter reveals snow-capped beauty in hill stations.' },
];

export default function TipsPage() {
  return (
    <div>
      <div className="page-hero">
        <h1>💡 Travel Tips</h1>
        <p className="tagline">Helpful advice for every kind of traveler</p>
      </div>

      <div className="tips-grid">
        {tips.map((tip, i) => (
          <div key={i} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <div className="tip-title">{tip.title}</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Reference */}
      <div style={{ marginTop: '40px', padding: '28px', background: 'rgba(250,196,150,0.04)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)', marginBottom: '16px', fontSize: '18px' }}>
          🆘 Emergency Numbers in India
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[['🚓 Police', '100'], ['🚑 Ambulance', '108'], ['🔥 Fire', '101'], ['👩‍⚕️ Women Helpline', '1091'], ['☎️ Emergency', '112']].map(([label, num]) => (
            <div key={label} style={{ background: 'var(--bg-card)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--accent-gold)', fontSize: '18px' }}>{num}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
