'use client';
import { useState } from 'react';
import { destinationFood, getAllDestinations, type Dish } from '@/lib/foodData';

const CATEGORY_LABELS: Record<string, string> = {
  tribal: '🌿 Tribal', coastal: '🌊 Coastal', 'street-food': '🛺 Street Food',
  vegetarian: '🌱 Vegetarian', 'non-vegetarian': '🍖 Non-Veg', dessert: '🍮 Dessert',
  beverage: '☕ Beverage', traditional: '🏺 Traditional',
};

const CATEGORY_COLORS: Record<string, string> = {
  tribal: '#6EE7B7', coastal: '#38BDF8', 'street-food': '#FCD34D',
  vegetarian: '#86EFAC', 'non-vegetarian': '#FCA5A5', dessert: '#F9A8D4',
  beverage: '#BAE6FD', traditional: '#FDBA74',
};

interface Props {
  compact?: boolean;
  filterDestination?: string; // lock to one destination
}

export default function FoodExplorer({ compact = false, filterDestination }: Props) {
  const [selectedDest, setSelectedDest] = useState(filterDestination || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const destinations = getAllDestinations();

  const allCategories = Array.from(
    new Set(Object.values(destinationFood).flatMap(d => d.map(dish => dish.category)))
  );

  const getVisible = (): { dest: string; dish: Dish }[] => {
    const results: { dest: string; dish: Dish }[] = [];
    const destList = filterDestination ? [filterDestination] : (selectedDest ? [selectedDest] : destinations);
    destList.forEach(dest => {
      (destinationFood[dest] || []).forEach(dish => {
        if (selectedCategory && dish.category !== selectedCategory) return;
        if (search && !dish.name.toLowerCase().includes(search.toLowerCase()) && !dish.description.toLowerCase().includes(search.toLowerCase())) return;
        results.push({ dest, dish });
      });
    });
    return results;
  };

  const visible = getVisible();

  if (compact) {
    // Homepage teaser — shows 3 featured dishes
    const featured = [
      { dest: 'Araku', dish: destinationFood['Araku'][0] },
      { dest: 'Vizag', dish: destinationFood['Vizag'][0] },
      { dest: 'Goa', dish: destinationFood['Goa'][0] },
    ];
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
          {featured.map(({ dest, dish }) => (
            <DishCard key={dish.name} dish={dish} dest={dest} compact />
          ))}
        </div>
        <a href="/en/food" className="btn btn-secondary" style={{ borderRadius: 50, fontSize: 13, display: 'inline-flex' }}>
          Explore All Local Foods →
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      {!filterDestination && (
        <div className="glass" style={{ padding: '20px 24px', marginBottom: 24, borderRadius: 'var(--r-lg)' }}>
          <div className="form-grid">
            <div>
              <label className="field-label">Destination</label>
              <select className="field-select" value={selectedDest} onChange={e => setSelectedDest(e.target.value)}>
                <option value="">All Destinations</option>
                {destinations.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Food Type</label>
              <select className="field-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="">All Types</option>
                {allCategories.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Search</label>
              <input className="field-input" placeholder="Search dishes…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Destination grouping when no filter selected */}
      {!filterDestination && !selectedDest && !selectedCategory && !search ? (
        destinations.map(dest => (
          <div key={dest} style={{ marginBottom: 40 }}>
            <div className="section-title">
              🗺️ {dest}
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', fontWeight: 400, marginLeft: 6 }}>
                {destinationFood[dest]?.length} dishes
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
              {(destinationFood[dest] || []).map(dish => (
                <DishCard key={dish.name} dish={dish} dest={dest} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <>
          <div style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: 13 }}>
            {visible.length} dish{visible.length !== 1 ? 'es' : ''} found
          </div>
          {visible.length === 0 ? (
            <div className="glass" style={{ padding: 48, textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🍽️</div>
              <p style={{ color: 'var(--text-muted)' }}>No dishes match your filters. Try broadening your search.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
              {visible.map(({ dest, dish }) => (
                <DishCard key={`${dest}-${dish.name}`} dish={dish} dest={dest} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DishCard({ dish, dest, compact = false }: { dish: Dish; dest: string; compact?: boolean }) {
  const catColor = CATEGORY_COLORS[dish.category] || '#FAC496';
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)', padding: compact ? '18px' : '22px',
      transition: 'all var(--dur) var(--ease)', cursor: 'default',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-gold)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${catColor}18`, border: `1px solid ${catColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
          {dish.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text)', fontSize: 15, marginBottom: 3 }}>{dish.name}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}25`, fontWeight: 600 }}>
              {CATEGORY_LABELS[dish.category] || dish.category}
            </span>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {dish.flavour}
            </span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: dish.culturalNote || dish.bestTime || dish.localArea ? 12 : 0 }}>
        {dish.description}
      </p>
      {dish.culturalNote && (
        <div style={{ fontSize: 11, color: 'var(--gold)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
          💡 {dish.culturalNote}
        </div>
      )}
      {(dish.bestTime || dish.localArea) && !compact && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {dish.bestTime && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⏰ {dish.bestTime}</span>}
          {dish.localArea && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {dish.localArea}</span>}
        </div>
      )}
    </div>
  );
}
