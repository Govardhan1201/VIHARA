'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { destinations, statesData, type Destination } from '@/lib/destinations';

const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => (
  <div style={{ height: 420, background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '15px' }}>
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
  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

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

  const subZones = selectedState ? statesData[selectedState]?.subZones || [] : [];
  const mapCenter: [number, number] = selectedState
    ? [statesData[selectedState].coords[0][0], statesData[selectedState].coords[0][1]]
    : [20.5937, 78.9629];

  const askAI = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: aiQuery }) });
      const data = await res.json();
      setAiResult(data.reply);
    } catch { setAiResult('Could not get AI response. Try again!'); }
    finally { setAiLoading(false); }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Hero */}
      <div className="page-hero">
        <h1>🌍 Explore Destinations</h1>
        <p className="tagline">Find your next off-beat adventure across India</p>
      </div>

      {/* AI Search Bar */}
      <div className="glass glass-gold" style={{ padding: '24px 28px', marginBottom: '24px', borderRadius: 'var(--r-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>🤖</span>
          <span style={{ fontFamily: 'var(--heading)', fontSize: '14px', fontWeight: 700, color: 'var(--gold)' }}>AI Destination Finder</span>
          <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: 'var(--teal-dim)', color: 'var(--teal)', border: '1px solid rgba(50,184,198,0.2)' }}>Powered by Gemini</span>
        </div>
        <div className="ai-search-bar">
          <input value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()}
            placeholder="e.g. Best budget nature spots in Andhra Pradesh under ₹1000..." />
          <button onClick={askAI} disabled={aiLoading} className="btn btn-primary" style={{ borderRadius: '50px', padding: '10px 20px', fontSize: '13px', flexShrink: 0 }}>
            {aiLoading ? '...' : '✨ Ask AI'}
          </button>
        </div>
        {aiResult && (
          <div className="ai-result">{aiResult}</div>
        )}
      </div>

      {/* State Bubbles */}
      <div className="glass" style={{ padding: '24px 28px', marginBottom: '20px', borderRadius: 'var(--r-lg)' }}>
        <div className="section-title">📍 Step 1: Select State</div>
        <div className="bubble-wrap">
          {Object.keys(statesData).map(state => (
            <button key={state} className={`bubble ${selectedState === state ? 'active' : ''}`}
              onClick={() => { setSelectedState(s => s === state ? null : state); setSelectedSubZone(null); }}>
              {state}
            </button>
          ))}
        </div>

        {selectedState && (
          <>
            <div className="section-title" style={{ marginTop: '22px' }}>📍 Step 2: Select Sub-Zone</div>
            <div className="bubble-wrap">
              {subZones.map(zone => (
                <button key={zone} className={`bubble ${selectedSubZone === zone ? 'active' : ''}`}
                  onClick={() => setSelectedSubZone(z => z === zone ? null : zone)}>
                  {zone}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Map */}
      <div className="glass" style={{ padding: '24px 28px', marginBottom: '20px', borderRadius: 'var(--r-lg)' }}>
        <div className="section-title">🗺️ Interactive Map & Your Location</div>
        <div style={{ marginBottom: '16px', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          <Map destinations={filtered} center={mapCenter} zoom={selectedState ? 7 : 5} statesData={statesData} />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ fontSize: '12px' }}
            onClick={() => { navigator.geolocation.getCurrentPosition(p => { (window as any).__viharaSetLocation?.([p.coords.latitude, p.coords.longitude]); }, e => alert('Location error: ' + e.message)); }}>
            📍 Get My Location
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '12px' }}
            onClick={() => { (window as any).__viharaSetLocation?.(null); }}>
            🇮🇳 Recenter to India
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '12px', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            onClick={() => { (window as any).__viharaClearLocation?.(); }}>
            Clear Location
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: '24px 28px', marginBottom: '24px', borderRadius: 'var(--r-lg)' }}>
        <div className="section-title">🔍 Smart Filters</div>
        <div className="form-grid">
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
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={applyFilters}>Apply Filters</button>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="section-title">✨ Recommended Destinations <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font)', fontWeight: 400 }}>({filtered.length} found)</span></div>
      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
          <p style={{ color: 'var(--text-muted)' }}>No destinations match your filters. Try broadening your search.</p>
        </div>
      ) : (
        <div className="dest-grid">
          {filtered.map((dest, i) => (
            <div key={i} className="dest-card" onClick={() => setPopup(dest)}>
              <div className="dest-card-img">{dest.emoji}</div>
              <div className="dest-card-body">
                {dest.submittedBy && <div style={{ fontSize: '10px', color: 'var(--teal)', marginBottom: '4px', fontWeight: 600 }}>✅ Community Gem</div>}
                <div className="dest-card-name">{dest.name}</div>
                <div className="dest-card-desc">{dest.desc}</div>
                <div className="dest-tags">
                  <span className="dest-tag">📍 {dest.state}</span>
                  <span className="dest-tag">⏱ {dest.duration}</span>
                  <span className="dest-tag gold">💰 ₹{dest.budget}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {popup && (
        <div className="popup-overlay" onClick={e => { if (e.target === e.currentTarget) setPopup(null); }}>
          <div className="popup-box">
            <button className="popup-close" onClick={() => setPopup(null)}>✕</button>
            <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--heading)', fontSize: '22px', marginBottom: '20px', paddingRight: '32px' }}>
              {popup.emoji} {popup.name}
            </h2>
            <div>
              {[['📍 State', popup.state], ['🏘️ Zone', popup.subZone], ['📝 About', popup.desc], ['🏃 Activity', popup.activity], ['⏱ Duration', popup.duration], ['🚌 Transport', popup.transport], ['🏨 Accommodation', popup.accommodation], ['💰 Budget', `₹${popup.budget}`]].map(([k, v]) => (
                <div key={k} className="popup-detail-row">
                  <span className="popup-detail-label">{k}</span>
                  <span className="popup-detail-value">{v}</span>
                </div>
              ))}
            </div>
            <div className="popup-links">
              <a href={popup.mapLink} target="_blank" rel="noreferrer" className="popup-link">📍 View on Map</a>
              <a href={popup.imageLink} target="_blank" rel="noreferrer" className="popup-link">📷 Photos</a>
              <a href={popup.videoLink} target="_blank" rel="noreferrer" className="popup-link">🎥 Video</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
