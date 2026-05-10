'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { destinations, statesData, type Destination } from '@/lib/destinations';
import FoodExplorer from '@/components/FoodExplorer';
import CrowdPredictor from '@/components/CrowdPredictor';
import { useTranslations } from 'next-intl';

const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => (
  <div style={{ height: 420, background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
    🗺️ Loading Map...
  </div>
)});

type PopupTab = 'info' | 'food' | 'crowd';

interface WeatherData { temp: number; condition: string; icon: string; city: string; humidity: number; }

export default function ExplorePage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedSubZone, setSelectedSubZone] = useState<string | null>(null);
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [transport, setTransport] = useState('');
  const [popup, setPopup] = useState<Destination | null>(null);
  const [popupTab, setPopupTab] = useState<PopupTab>('info');
  const [filtered, setFiltered] = useState<Destination[]>(destinations);
  const t = useTranslations('explore');
  const [allDests, setAllDests] = useState<Destination[]>(destinations);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');




  useEffect(() => {
    fetch('/api/submissions?status=APPROVED').then(r => r.json()).then(data => {
      if (data.submissions?.length) {
        const extra: Destination[] = data.submissions.map((s: any) => ({
          name: s.placeName, state: s.state, subZone: s.subZone, desc: s.description,
          activity: s.activity, duration: s.duration, transport: s.transport,
          accommodation: s.accommodation, budget: s.budget, emoji: s.emoji || '🌟',
          mapLink: s.mapLink || '#', imageLink: s.imageLink || '#', videoLink: s.videoLink || '#',
          submittedBy: s.submitterName,
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
    setAiLoading(true); setAiResult('');
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: aiQuery }) });
      const data = await res.json();
      setAiResult(data.reply);
    } catch { setAiResult('Could not get AI response. Try again!'); }
    finally { setAiLoading(false); }
  };

  const openPopup = (dest: Destination) => {
    setPopup(dest); setPopupTab('info'); setWeather(null);
    // Track analytics
    fetch('/api/analytics', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ destination: dest.name }) }).catch(() => {});
    // Fetch weather
    const city = dest.subZone || dest.state;
    setWeatherLoading(true);
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then(r => r.json()).then(d => { if (!d.error) setWeather(d); })
      .catch(() => {})
      .finally(() => setWeatherLoading(false));
  };

  const shareDestination = (dest: Destination) => {
    const url = `${window.location.origin}${window.location.pathname}?dest=${encodeURIComponent(dest.name)}`;
    navigator.clipboard.writeText(url).then(() => { setShareMsg('Link copied!'); setTimeout(() => setShareMsg(''), 2000); });
  };

  // Auto-open destination from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const destName = params.get('dest');
    if (destName) {
      const found = allDests.find(d => d.name.toLowerCase() === destName.toLowerCase());
      if (found) openPopup(found);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDests]);

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-hero">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>🌍 {t('title')}</h1>
        <p className="sub">{t('sub')}</p>
      </div>

      {/* AI Finder */}
      <div className="glass glass-gold" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--gold)' }}>{t('ai_label')}</span>
          <span className="badge badge-teal">Gemini Powered</span>
        </div>
        <div className="ai-bar">
          <input value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()}
            placeholder={t('ai_placeholder')} />
          <button onClick={askAI} disabled={aiLoading} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
            {aiLoading ? '…' : `✨ ${t('ask')}`}
          </button>
        </div>
        {aiResult && <div className="ai-result">{aiResult}</div>}
      </div>

      {/* State Bubbles */}
      <div className="glass" style={{ padding: '24px 28px', marginBottom: 20 }}>
        <div className="form-section-label">📍 Step 1: {t('state')}</div>
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
            <div className="form-section-label" style={{ marginTop: 22 }}>📍 Step 2: {t('zone')}</div>
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
      <div className="glass" style={{ padding: '24px 28px', marginBottom: 20, borderRadius: 'var(--r-lg)' }}>
        <div className="section-title">🗺️ Interactive Map</div>
        <div style={{ marginBottom: 16, borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
          <Map destinations={filtered} center={mapCenter} zoom={selectedState ? 7 : 5} statesData={statesData} selectedState={selectedState} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ fontSize: 12 }}
            onClick={() => navigator.geolocation.getCurrentPosition(p => (window as any).__viharaSetLocation?.([p.coords.latitude, p.coords.longitude]), e => alert('Location error: ' + e.message))}>
            📍 Get My Location
          </button>
          <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => (window as any).__viharaSetLocation?.(null)}>🇮🇳 Recenter</button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div className="form-section-label">🔍 {t('filters')}</div>
        <div className="form-grid">
          <div><label className="field-label">Activity</label>
            <select className="field-select" value={activity} onChange={e => setActivity(e.target.value)}>
              <option value="">All</option><option value="adventure">Adventure</option><option value="cultural">Cultural</option><option value="nature">Nature</option><option value="photography">Photography</option>
            </select>
          </div>
          <div><label className="field-label">Duration</label>
            <select className="field-select" value={duration} onChange={e => setDuration(e.target.value)}>
              <option value="">All</option><option value="short">Short (1-2 days)</option><option value="medium">Medium (3-5 days)</option>
            </select>
          </div>
          <div><label className="field-label">Max Budget (₹)</label>
            <input type="number" className="field-input" placeholder="e.g. 2000" value={budget} onChange={e => setBudget(e.target.value)} />
          </div>
          <div><label className="field-label">Transport</label>
            <select className="field-select" value={transport} onChange={e => setTransport(e.target.value)}>
              <option value="">All</option><option value="Bus">Bus</option><option value="Train">Train</option><option value="Flight">Flight</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={applyFilters}>Apply Filters</button>
          </div>
        </div>
      </div>

      {/* Destinations */}
      <div className="form-section-label">✨ Destinations <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>({filtered.length} {t('found')})</span></div>
      {filtered.length === 0 ? (
        <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <p style={{ color: 'var(--text-muted)' }}>{t('no_results')}</p>
        </div>
      ) : (
        <div className="dest-grid">
          {filtered.map((dest, i) => (
            <div key={i} className="dest-card" onClick={() => openPopup(dest)}>
              <div className="dest-card-img">{dest.emoji}</div>
              <div className="dest-card-body">
                {dest.submittedBy && <div style={{ fontSize: 10, color: 'var(--teal)', marginBottom: 4, fontWeight: 600 }}>✅ Community Gem</div>}
                <div className="dest-card-name">{dest.name}</div>
                <div className="dest-card-desc">{dest.desc}</div>
                <div className="dest-tags">
                  <span className="dest-tag">📍 {dest.state}</span>
                  <span className="dest-tag">⏱ {dest.duration}</span>
                  <span className="dest-tag gold">₹{dest.budget}</span>
                </div>
                {/* Mini feature pills */}
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(250,196,150,0.08)', color: 'rgba(250,196,150,0.7)', border: '1px solid rgba(250,196,150,0.15)' }}>🍛 Local Food</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(50,184,198,0.08)', color: 'rgba(50,184,198,0.7)', border: '1px solid rgba(50,184,198,0.15)' }}>🧭 Crowd AI</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POPUP with tabs */}
      {popup && (
        <div className="popup-overlay" onClick={e => { if (e.target === e.currentTarget) setPopup(null); }}>
          <div className="popup-box" style={{ maxWidth: 640 }}>
            <button className="popup-close" onClick={() => setPopup(null)}>✕</button>

            <h2 style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 20, paddingRight: 32 }}>
              {popup.emoji} {popup.name}
            </h2>

            {/* Popup Tabs */}
            <div className="conv-tabs">
              {([
                { key: 'info', label: `📋 ${t('tab_info')}` },
                { key: 'food', label: `🍛 ${t('tab_food')}` },
                { key: 'crowd', label: `🧭 ${t('tab_crowd')}` },
              ] as { key: PopupTab; label: string }[]).map(tab => (
                <button key={tab.key} onClick={() => setPopupTab(tab.key)} className={`conv-tab ${popupTab === tab.key ? 'active' : ''}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Info */}
            {popupTab === 'info' && (
              <>
                {/* Weather Widget */}
                {(weather || weatherLoading) && (
                  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'rgba(50,184,198,0.06)', border:'1px solid rgba(50,184,198,0.15)', borderRadius:'var(--r-md)', marginBottom:16 }}>
                    {weatherLoading ? (
                      <span style={{ fontSize:12, color:'var(--text-muted)' }}>🌤 Loading weather…</span>
                    ) : weather ? (
                      <>
                        <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt={weather.condition} style={{ width:32, height:32 }} />
                        <div>
                          <div style={{ fontSize:16, fontWeight:800, color:'var(--teal)' }}>{weather.temp}°C</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'capitalize' }}>{weather.condition} · 💧 {weather.humidity}% humidity</div>
                        </div>
                        <span style={{ fontSize:10, color:'var(--text-dim)', marginLeft:'auto' }}>Live weather</span>
                      </>
                    ) : null}
                  </div>
                )}
                {[['📍 State', popup.state], ['🏘️ Zone', popup.subZone], ['📝 About', popup.desc], ['🏃 Activity', popup.activity], ['⏱ Duration', popup.duration], ['🚌 Transport', popup.transport], ['🏨 Stay', popup.accommodation], ['💰 Budget', `₹${popup.budget}`]].map(([k, v]) => (
                  <div key={k} className="popup-detail-row"><span className="popup-detail-label">{k}</span><span className="popup-detail-value">{v}</span></div>
                ))}
                <div className="popup-links">
                  <a href={popup.mapLink} target="_blank" rel="noreferrer" className="popup-link">📍 Map</a>
                  <a href={popup.imageLink} target="_blank" rel="noreferrer" className="popup-link">📷 Photos</a>
                  <a href={popup.videoLink} target="_blank" rel="noreferrer" className="popup-link">🎥 Video</a>
                  <button onClick={() => shareDestination(popup)} className="popup-link" style={{ border:'none', cursor:'pointer', background:'none' }}>📎 {shareMsg || 'Share'}</button>
                </div>
              </>
            )}

            {/* Tab: Local Food */}
            {popupTab === 'food' && (
              <FoodExplorer filterDestination={popup.subZone || popup.state} />
            )}

            {/* Tab: Crowd AI */}
            {popupTab === 'crowd' && (
              <CrowdPredictor defaultDestination={popup.name} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
