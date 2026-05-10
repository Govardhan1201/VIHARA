'use client';
import { useState } from 'react';
import { statesData } from '@/lib/destinations';

const DAYS_OPTIONS = [2, 3, 5, 7];
const STYLE_OPTIONS = [
  { value: 'adventure', label: '🧗 Adventure', desc: 'Treks, thrills & outdoor experiences' },
  { value: 'cultural', label: '🏛️ Cultural', desc: 'History, heritage & local traditions' },
  { value: 'relaxed', label: '🌴 Relaxed', desc: 'Slow travel, scenic drives & leisure' },
  { value: 'photography', label: '📷 Photography', desc: 'Landscapes, golden hours & hidden shots' },
];

interface ItineraryDay { day: number; title: string; theme: string; destinations: string[]; activities: string[]; food: string; stay: string; tip: string; budget: string; }
interface Itinerary { title: string; tagline: string; days: ItineraryDay[]; totalBudget: string; bestTime: string; packingTips: string[]; }

export default function ItineraryPage() {
  const [state, setState] = useState('');
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState('relaxed');
  const [budget, setBudget] = useState('3000');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(1);

  const generate = async () => {
    if (!state) { setError('Please select a state.'); return; }
    setError(''); setLoading(true); setItinerary(null);
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, days, style, budget }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Generation failed.'); return; }
      setItinerary(data.itinerary);
      setActiveDay(1);
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const share = () => {
    const text = itinerary ? `Check out this ${days}-day ${state} itinerary from VIHARA!\n"${itinerary.title}"\n\n${window.location.origin}/en/itinerary` : '';
    navigator.clipboard.writeText(text).then(() => alert('Itinerary copied to clipboard!'));
  };

  return (
    <div className="container" style={{ maxWidth: 900, paddingBottom: 80 }}>
      <div className="page-hero">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>AI Trip Planner</h1>
        <p className="sub">Tell us where you want to go. Gemini will craft your perfect itinerary with hidden gems, local food, and insider tips.</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 14px', borderRadius:20, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', fontSize:11, color:'#10b981', fontWeight:600, marginTop:12 }}>
          ✦ Powered by Gemini AI
        </div>
      </div>

      {/* Planner Form */}
      <div className="glass" style={{ padding:'32px', marginBottom:32, borderRadius:'var(--r-xl)' }}>
        <div className="form-grid" style={{ marginBottom:24 }}>
          <div>
            <label className="field-label">Select State *</label>
            <select className="field-select" value={state} onChange={e => setState(e.target.value)}>
              <option value="">Choose a state…</option>
              {Object.keys(statesData).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Budget per day (₹)</label>
            <input type="number" className="field-input" value={budget} onChange={e => setBudget(e.target.value)} placeholder="3000" />
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <label className="field-label">Trip Duration</label>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {DAYS_OPTIONS.map(d => (
              <button key={d} type="button" onClick={() => setDays(d)} style={{ padding:'10px 24px', borderRadius:50, border:`1px solid ${days===d?'var(--gold)':'var(--border)'}`, background: days===d?'var(--gold-dim)':'var(--surface)', color: days===d?'var(--gold)':'var(--text-muted)', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
                {d} Days
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:28 }}>
          <label className="field-label">Travel Style</label>
          <div className="grid-2" style={{ gap:10 }}>
            {STYLE_OPTIONS.map(o => (
              <button key={o.value} type="button" onClick={() => setStyle(o.value)} style={{ padding:'14px 16px', borderRadius:'var(--r-md)', border:`1px solid ${style===o.value?'var(--gold)':'var(--border)'}`, background: style===o.value?'var(--gold-dim)':'var(--surface)', textAlign:'left', cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ fontWeight:700, fontSize:14, color: style===o.value?'var(--gold)':'var(--text)', marginBottom:4 }}>{o.label}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{o.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color:'#ef4444', fontSize:13, marginBottom:16 }}>❌ {error}</p>}

        <button onClick={generate} disabled={loading} className="btn btn-primary" style={{ width:'100%', padding:'15px', fontSize:15, justifyContent:'center', borderRadius:'var(--r-sm)', opacity: loading?0.8:1 }}>
          {loading ? '🤖 Gemini is crafting your journey…' : '✨ Generate My Itinerary'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign:'center', padding:'48px', color:'var(--text-muted)' }}>
          <div style={{ fontSize:48, marginBottom:16, animation:'float 2s ease infinite' }}>🗺️</div>
          <p style={{ fontSize:15 }}>Planning your {days}-day journey through {state}…</p>
          <p style={{ fontSize:12, marginTop:8 }}>Gemini is discovering hidden gems, local food spots, and insider tips for you.</p>
        </div>
      )}

      {/* Itinerary Result */}
      {itinerary && !loading && (
        <div>
          {/* Header */}
          <div style={{ marginBottom:32, textAlign:'center' }}>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'clamp(24px,5vw,38px)', fontWeight:900, color:'var(--gold)', marginBottom:8 }}>{itinerary.title}</h2>
            <p style={{ color:'var(--text-muted)', fontSize:15, fontStyle:'italic' }}>{itinerary.tagline}</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginTop:16 }}>
              <span style={{ padding:'4px 12px', borderRadius:20, background:'var(--gold-dim)', color:'var(--gold)', fontSize:12, fontWeight:600 }}>💰 {itinerary.totalBudget}</span>
              <span style={{ padding:'4px 12px', borderRadius:20, background:'rgba(50,184,198,0.1)', color:'var(--teal)', fontSize:12, fontWeight:600 }}>📅 {itinerary.bestTime}</span>
              <button onClick={share} style={{ padding:'4px 14px', borderRadius:20, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text-muted)', fontSize:12, cursor:'pointer' }}>📎 Share</button>
            </div>
          </div>

          {/* Day Tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
            {itinerary.days.map(d => (
              <button key={d.day} onClick={() => setActiveDay(d.day)} style={{ padding:'8px 18px', borderRadius:50, border:`1px solid ${activeDay===d.day?'var(--gold)':'var(--border)'}`, background: activeDay===d.day?'var(--gold-dim)':'var(--surface)', color: activeDay===d.day?'var(--gold)':'var(--text-muted)', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                Day {d.day}
              </button>
            ))}
          </div>

          {/* Active Day Detail */}
          {itinerary.days.filter(d => d.day === activeDay).map(day => (
            <div key={day.day} className="glass" style={{ padding:'32px', borderRadius:'var(--r-xl)', marginBottom:24 }}>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, color:'var(--teal)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Day {day.day} · {day.theme}</div>
                <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:24, color:'var(--text)', margin:0 }}>{day.title}</h3>
              </div>

              <div className="grid-2" style={{ gap:16, marginBottom:20 }}>
                <div style={{ padding:'16px', background:'rgba(50,184,198,0.06)', border:'1px solid rgba(50,184,198,0.15)', borderRadius:'var(--r-md)' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--teal)', marginBottom:8, textTransform:'uppercase' }}>📍 Places to Visit</div>
                  {day.destinations.map((d,i) => <div key={i} style={{ fontSize:13, color:'var(--text)', marginBottom:4 }}>• {d}</div>)}
                </div>
                <div style={{ padding:'16px', background:'rgba(201,150,90,0.06)', border:'1px solid rgba(201,150,90,0.15)', borderRadius:'var(--r-md)' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--gold)', marginBottom:8, textTransform:'uppercase' }}>🎯 Activities</div>
                  {day.activities.map((a,i) => <div key={i} style={{ fontSize:13, color:'var(--text)', marginBottom:4 }}>• {a}</div>)}
                </div>
              </div>

              <div className="grid-3" style={{ gap:12 }}>
                {[{ icon:'🍛', label:'Local Food', val: day.food }, { icon:'🏨', label:'Stay', val: day.stay }, { icon:'💰', label:'Day Budget', val: day.budget }].map(item => (
                  <div key={item.label} style={{ padding:'14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-md)' }}>
                    <div style={{ fontSize:18, marginBottom:6 }}>{item.icon}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:12, color:'var(--text)', lineHeight:1.5 }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {day.tip && (
                <div style={{ marginTop:16, padding:'14px 16px', background:'rgba(201,150,90,0.08)', border:'1px solid rgba(201,150,90,0.2)', borderRadius:'var(--r-md)', display:'flex', gap:10 }}>
                  <span style={{ fontSize:16 }}>💡</span>
                  <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}><strong style={{color:'var(--gold)'}}>Insider tip:</strong> {day.tip}</div>
                </div>
              )}
            </div>
          ))}

          {/* Packing Tips */}
          {itinerary.packingTips?.length > 0 && (
            <div className="glass" style={{ padding:'24px 28px', borderRadius:'var(--r-xl)' }}>
              <div style={{ fontWeight:700, color:'var(--text)', marginBottom:16, fontSize:15 }}>🎒 Packing Tips</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {itinerary.packingTips.map((tip, i) => (
                  <span key={i} style={{ padding:'6px 14px', borderRadius:20, background:'var(--surface)', border:'1px solid var(--border)', fontSize:12, color:'var(--text-muted)' }}>✓ {tip}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
