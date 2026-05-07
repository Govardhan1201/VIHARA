'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { destinations, statesData, type Destination } from '@/lib/destinations';

const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => (
  <div style={{ height: 420, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border-card)' }}>
    🗺️ Loading Map...
  </div>
)});

export default function ExplorePage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedSubZone, setSelectedSubZone] = useState<string | null>(null);
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [transport, setTransport] = useState('');
  const [popup, setPopup] = useState<Destination | null>(null);
  const [filtered, setFiltered] = useState<Destination[]>(destinations);
  const [allDests, setAllDests] = useState<Destination[]>(destinations);

  // Load user-approved submissions from API
  useEffect(() => {
    fetch('/api/submissions?status=APPROVED').then(r => r.json()).then(data => {
      if (data.submissions?.length) {
        const extra: Destination[] = data.submissions.map((s: any) => ({
          name: s.placeName, state: s.state, subZone: s.subZone, desc: s.description,
          activity: s.activity, duration: s.duration, transport: s.transport, accommodation: s.accommodation,
          budget: s.budget, emoji: s.emoji || '🌟', mapLink: s.mapLink || '#', imageLink: s.imageLink || '#',
          videoLink: s.videoLink || '#', submittedBy: s.submitterName
        }));
        setAllDests([...destinations, ...extra]);
      }
    }).catch(() => {});
  }, []);

  const applyFilters = useCallback(() => {
    let result = allDests;
    if (selectedState) result = result.filter(d => d.state === selectedState);
    if (selectedSubZone) result = result.filter(d => d.subZone === selectedSubZone);
    if (activity) result = result.filter(d => d.activity === activity);
    if (duration) result = result.filter(d => d.duration === duration);
    if (budget) result = result.filter(d => d.budget <= parseInt(budget));
    if (transport) result = result.filter(d => d.transport.toLowerCase().includes(transport.toLowerCase()));
    setFiltered(result);
  }, [allDests, selectedState, selectedSubZone, activity, duration, budget, transport]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const selectState = (state: string) => {
    setSelectedState(prev => prev === state ? null : state);
    setSelectedSubZone(null);
  };

  const selectSubZone = (zone: string) => {
    setSelectedSubZone(prev => prev === zone ? null : zone);
  };

  const subZones = selectedState ? statesData[selectedState]?.subZones || [] : [];
  const mapCenter: [number, number] = selectedState
    ? [statesData[selectedState].coords[0][0], statesData[selectedState].coords[0][1]]
    : [20.5937, 78.9629];
  const mapZoom = selectedState ? 7 : 5;

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <h1>🌍 Explore Destinations</h1>
        <p className="tagline">Find your next off-beat adventure across India</p>
      </div>

      {/* State / Sub-zone Bubbles */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="section-title">📍 Step 1: Select State</div>
        <div className="bubble-container">
          {Object.keys(statesData).map(state => (
            <button key={state} className={`zone-bubble ${selectedState === state ? 'active' : ''}`} onClick={() => selectState(state)}>
              {state}
            </button>
          ))}
        </div>

        {selectedState && (
          <>
            <div className="section-title" style={{ marginTop: '20px' }}>📍 Step 2: Select Sub-Zone</div>
            <div className="bubble-container">
              {subZones.map(zone => (
                <button key={zone} className={`zone-bubble ${selectedSubZone === zone ? 'active' : ''}`} onClick={() => selectSubZone(zone)}>
                  {zone}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Map */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="section-title">📍 Interactive Map & Your Location</div>
        <div style={{ marginBottom: '16px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <Map destinations={filtered} center={mapCenter} zoom={mapZoom} statesData={statesData} />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-gold" style={{ fontSize: '12px' }} id="getLocationBtn"
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (p) => { (window as any).__viharaSetLocation?.([p.coords.latitude, p.coords.longitude]); },
                (e) => alert('Location error: ' + e.message)
              );
            }}>
            📍 Get My Location
          </button>
          <button className="btn-outline" style={{ fontSize: '12px' }}
            onClick={() => { (window as any).__viharaSetLocation?.(null); }}>
            🇮🇳 Recenter to India
          </button>
          <button className="btn-outline" style={{ fontSize: '12px', borderColor: 'var(--border-card)', color: 'var(--text-secondary)' }}
            onClick={() => { (window as any).__viharaClearLocation?.(); }}>
            Clear Location
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-panel">
        <div className="section-title">🔍 Smart Filters</div>
        <div className="filters-grid">
          <div>
            <label className="field-label">Activity Type</label>
            <select className="field-select" value={activity} onChange={e => setActivity(e.target.value)}>
              <option value="">All Activities</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="nature">Nature</option>
              <option value="photography">Photography</option>
            </select>
          </div>
          <div>
            <label className="field-label">Duration</label>
            <select className="field-select" value={duration} onChange={e => setDuration(e.target.value)}>
              <option value="">All Durations</option>
              <option value="short">Short (1-2 days)</option>
              <option value="medium">Medium (3-5 days)</option>
            </select>
          </div>
          <div>
            <label className="field-label">Max Budget (₹)</label>
            <input type="number" className="field-input" placeholder="e.g. 2000" value={budget} onChange={e => setBudget(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Transport</label>
            <select className="field-select" value={transport} onChange={e => setTransport(e.target.value)}>
              <option value="">All Types</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Flight">Flight</option>
              <option value="Local">Local</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn-gold" style={{ width: '100%' }} onClick={applyFilters}>Apply Filters</button>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="section-title">✨ Recommended Destinations ({filtered.length})</div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)' }}>
          No destinations match your filters. Try broadening your search.
        </div>
      ) : (
        <div className="destinations-grid">
          {filtered.map((dest, i) => (
            <div key={i} className="destination-card" onClick={() => setPopup(dest)}>
              <div className="card-image">{dest.emoji}</div>
              <div className="card-body">
                {dest.submittedBy && (
                  <div style={{ fontSize: '10px', color: 'var(--accent-teal)', marginBottom: '4px' }}>✅ Community Gem</div>
                )}
                <div className="card-name">{dest.name}</div>
                <div className="card-desc">{dest.desc}</div>
                <div className="card-tags">
                  <span className="card-tag">📍 {dest.state}</span>
                  <span className="card-tag">⏱ {dest.duration}</span>
                  <span className="card-tag">💰 ₹{dest.budget}</span>
                  <span className="card-tag">🏃 {dest.activity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Popup */}
      {popup && (
        <div className="popup-overlay" onClick={(e) => { if (e.target === e.currentTarget) setPopup(null); }}>
          <div className="popup-content">
            <button className="popup-close" onClick={() => setPopup(null)}>✕</button>
            <div style={{ paddingTop: '8px' }}>
              <h2 style={{ color: 'var(--accent-gold)', fontSize: '22px', marginBottom: '16px' }}>
                {popup.emoji} {popup.name}
              </h2>
              <div style={{ display: 'grid', gap: '8px' }}>
                {[
                  ['📍 State', popup.state],
                  ['🏘️ Zone', popup.subZone],
                  ['📝 Description', popup.desc],
                  ['🏃 Activity', popup.activity],
                  ['⏱ Duration', popup.duration],
                  ['🚌 Transport', popup.transport],
                  ['🏨 Accommodation', popup.accommodation],
                  ['💰 Budget', `₹${popup.budget}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)', minWidth: '140px' }}>{k}</span>
                    <span style={{ color: 'var(--text-primary)', flex: 1 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="popup-links">
                <a href={popup.mapLink} target="_blank" rel="noreferrer" className="popup-link">📍 View on Map</a>
                <a href={popup.imageLink} target="_blank" rel="noreferrer" className="popup-link">📷 View Photos</a>
                <a href={popup.videoLink} target="_blank" rel="noreferrer" className="popup-link">🎥 Watch Video</a>
              </div>
              {popup.submittedBy && (
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px' }}>
                  Submitted by: {popup.submittedBy}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
