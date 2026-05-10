'use client';
import { useState } from 'react';
import { MONTH_NAMES, MAJOR_FESTIVALS } from '@/lib/crowdPrediction';
import type { CrowdAIResponse } from '@/app/api/crowd/route';

type CrowdLevel = 'Low' | 'Moderate' | 'High';

const LEVEL_CONFIG: Record<CrowdLevel, { color: string; bg: string; icon: string }> = {
  Low:      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  icon: '🌿' },
  Moderate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: '🌤' },
  High:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: '🔴' },
};

interface Props {
  compact?: boolean;
  defaultDestination?: string;
}

export default function CrowdPredictor({ compact = false, defaultDestination = '' }: Props) {
  const currentMonth = new Date().getMonth() + 1;
  const [destination, setDestination] = useState(defaultDestination);
  const [month, setMonth] = useState(currentMonth);
  const [isWeekend, setIsWeekend] = useState(false);
  const [isFestival, setIsFestival] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'early-morning' | 'morning' | 'afternoon' | 'evening'>('morning');
  const [result, setResult] = useState<CrowdAIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const festivals = MAJOR_FESTIVALS[month] || [];

  const predict = async () => {
    if (!destination.trim()) { alert('Please enter a destination.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/crowd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, month, isWeekend, isFestival, timeOfDay }),
      });
      const data: CrowdAIResponse = await res.json();
      setResult(data);
    } catch {
      alert('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? LEVEL_CONFIG[result.level] : null;

  if (compact) {
    return (
      <div style={{ background: 'linear-gradient(135deg, rgba(50,184,198,0.05), rgba(250,196,150,0.05))', border: '1px solid rgba(50,184,198,0.2)', borderRadius: 'var(--r-xl)', padding: '36px 32px' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🧭</div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--teal)', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Crowd Prediction AI</h3>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginBottom:12, padding:'3px 10px', borderRadius:20, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', fontSize:11, color:'#10b981', fontWeight:600 }}>
          ✦ Powered by Gemini AI
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>
          Know before you go. Get AI-powered crowd analysis for any Indian destination — based on real seasonal patterns, festivals, and local travel trends.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['🌿 Low Season', '🌤 Moderate', '🔴 Peak Crowd'].map(l => (
            <span key={l} style={{ padding: '4px 12px', borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>{l}</span>
          ))}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--teal)', fontSize: 13, fontWeight: 600 }}>
          Try it on any destination ↓
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Inputs */}
      <div className="glass" style={{ padding: '24px 28px', borderRadius: 'var(--r-lg)', marginBottom: 24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
          <div className="section-title" style={{ margin:0 }}>🧭 Set Your Travel Plan</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'3px 10px', borderRadius:20, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', fontSize:11, color:'#10b981', fontWeight:600 }}>
            ✦ Gemini AI
          </div>
        </div>
        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div>
            <label className="field-label">Destination</label>
            <input className="field-input" placeholder="e.g. Araku, Goa, Vizag, Hampi…" value={destination}
              onChange={e => setDestination(e.target.value)} disabled={!!defaultDestination} />
          </div>
          <div>
            <label className="field-label">Month of Visit</label>
            <select className="field-select" value={month} onChange={e => setMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Time of Day</label>
            <select className="field-select" value={timeOfDay} onChange={e => setTimeOfDay(e.target.value as any)}>
              <option value="early-morning">🌅 Early Morning (5–8am)</option>
              <option value="morning">☀️ Morning (8am–12pm)</option>
              <option value="afternoon">🌤 Afternoon (12–5pm)</option>
              <option value="evening">🌆 Evening (5–8pm)</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          {[
            { label: '📅 Weekend / Holiday', value: isWeekend, setter: setIsWeekend },
            { label: `🎉 Festival Period${festivals.length ? ` (${festivals[0]})` : ''}`, value: isFestival, setter: setIsFestival },
          ].map(({ label, value, setter }) => (
            <button key={label} onClick={() => setter(!value)} style={{
              padding: '9px 18px', borderRadius: 50, border: `1px solid ${value ? 'var(--gold)' : 'var(--border)'}`,
              background: value ? 'var(--gold-dim)' : 'var(--surface)', color: value ? 'var(--gold)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all var(--dur)', fontFamily: 'Inter, sans-serif',
            }}>
              {value ? '✓ ' : ''}{label}
            </button>
          ))}
        </div>

        {festivals.length > 0 && (
          <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 16, fontStyle: 'italic' }}>
            🎊 {MONTH_NAMES[month - 1]} festivals: {festivals.join(' · ')}
          </div>
        )}

        <button onClick={predict} disabled={loading} className="btn btn-primary" style={{ borderRadius: 'var(--r-sm)', padding: '12px 28px', fontSize: 14, opacity: loading ? 0.7 : 1 }}>
          {loading ? '🤖 Analyzing with Gemini AI…' : '🔮 Predict Crowd Level'}
        </button>
      </div>

      {/* Result */}
      {result && cfg && (
        <div style={{ border: `1px solid ${cfg.color}30`, background: cfg.bg, borderRadius: 'var(--r-xl)', padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
          {/* Source badge */}
          <div style={{ position:'absolute', top:16, right:16, fontSize:10, padding:'3px 10px', borderRadius:20, background: result.source === 'gemini' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: result.source === 'gemini' ? '#10b981' : 'var(--text-dim)', border: `1px solid ${result.source === 'gemini' ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, fontWeight:600 }}>
            {result.source === 'gemini' ? '✦ Gemini AI' : '📊 Algorithmic'}
          </div>

          {/* Level Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${cfg.color}20`, border: `2px solid ${cfg.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
              {cfg.icon}
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 28, color: cfg.color }}>
                {result.level} Crowd
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{result.summary}</div>
            </div>
          </div>

          {/* Visual Bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ height: 10, borderRadius: 10, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${result.score}%`, background: `linear-gradient(90deg, #10b981, ${cfg.color})`, borderRadius: 10, transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-dim)', marginTop: 6 }}>
              <span>🌿 Quiet</span><span>🌤 Moderate</span><span>🔴 Peak</span>
            </div>
          </div>

          {/* Tip */}
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.75, marginBottom: 20 }}>{result.tip}</p>

          {/* Best / Avoid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: result.alternatives ? 14 : 20 }}>
            {[
              { label: '✅ Best Window', value: result.bestWindow, color: '#10b981' },
              { label: '⚠️ Avoid', value: result.avoidWindow, color: '#f59e0b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: '14px 16px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 'var(--r-md)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Alternatives (Gemini only) */}
          {result.alternatives && (
            <div style={{ padding: '14px 16px', background: 'rgba(201,150,90,0.06)', border: '1px solid rgba(201,150,90,0.2)', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 Quieter Alternatives</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{result.alternatives}</div>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, fontSize: 11, color: 'rgba(200,202,202,0.4)', fontStyle: 'italic' }}>
            ℹ️ {result.source === 'gemini' ? 'AI predictions are based on real travel patterns and local knowledge. Actual conditions may vary.' : 'Predictions based on seasonal patterns and travel trends. Add GEMINI_API_KEY for smarter predictions.'}
          </div>
        </div>
      )}
    </div>
  );
}
