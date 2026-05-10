'use client';
import { useState } from 'react';
import { predictCrowd, MONTH_NAMES, MAJOR_FESTIVALS, type CrowdLevel, type CrowdInput } from '@/lib/crowdPrediction';

const LEVEL_CONFIG: Record<CrowdLevel, { color: string; bg: string; icon: string; bar: number }> = {
  Low:      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  icon: '🌿', bar: 25 },
  Moderate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: '🌤', bar: 55 },
  High:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: '🔴', bar: 88 },
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
  const [timeOfDay, setTimeOfDay] = useState<CrowdInput['timeOfDay']>('morning');
  const [result, setResult] = useState<ReturnType<typeof predictCrowd> | null>(null);

  const festivals = MAJOR_FESTIVALS[month] || [];

  const predict = () => {
    if (!destination.trim()) { alert('Please enter a destination.'); return; }
    const r = predictCrowd({ destination, month, isWeekend, isFestival, timeOfDay });
    setResult(r);
  };

  const cfg = result ? LEVEL_CONFIG[result.level] : null;

  if (compact) {
    return (
      <div style={{ background: 'linear-gradient(135deg, rgba(50,184,198,0.05), rgba(250,196,150,0.05))', border: '1px solid rgba(50,184,198,0.2)', borderRadius: 'var(--r-xl)', padding: '36px 32px' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🧭</div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--teal)', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Crowd Prediction AI</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>
          Know before you go. Estimate crowd levels for any destination using season, festivals, and travel patterns — then plan for quieter, richer experiences.
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
        <div className="section-title" style={{ marginBottom: 20 }}>🧭 Set Your Travel Plan</div>
        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div>
            <label className="field-label">Destination</label>
            <input className="field-input" placeholder="e.g. Araku, Goa, Vizag…" value={destination}
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
            <select className="field-select" value={timeOfDay} onChange={e => setTimeOfDay(e.target.value as CrowdInput['timeOfDay'])}>
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

        <button onClick={predict} className="btn btn-primary" style={{ borderRadius: 'var(--r-sm)', padding: '12px 28px', fontSize: 14 }}>
          🔮 Predict Crowd Level
        </button>
      </div>

      {/* Result */}
      {result && cfg && (
        <div style={{ border: `1px solid ${cfg.color}30`, background: cfg.bg, borderRadius: 'var(--r-xl)', padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
          {/* Level Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${cfg.color}20`, border: `2px solid ${cfg.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
              {cfg.icon}
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 28, color: cfg.color }}>
                {result.level} Crowd
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {result.confidence} · Score: {result.score}/100
              </div>
            </div>
          </div>

          {/* Visual Bar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
              <span>🌿 Quiet</span><span>🌤 Moderate</span><span>🔴 Peak</span>
            </div>
            <div style={{ height: 10, borderRadius: 10, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${result.score}%`, background: `linear-gradient(90deg, #10b981, ${cfg.color})`, borderRadius: 10, transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {(['Low','Moderate','High'] as CrowdLevel[]).map(l => (
                <span key={l} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: result.level === l ? `${LEVEL_CONFIG[l].color}20` : 'transparent', color: result.level === l ? LEVEL_CONFIG[l].color : 'var(--text-muted)', border: `1px solid ${result.level === l ? LEVEL_CONFIG[l].color + '40' : 'transparent'}`, fontWeight: result.level === l ? 700 : 400 }}>
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Tip */}
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.75, marginBottom: 20 }}>{result.tip}</p>

          {/* Best / Avoid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
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

          {/* Disclaimer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, fontSize: 11, color: 'rgba(200,202,202,0.4)', fontStyle: 'italic' }}>
            ℹ️ Predictions are based on seasonal patterns, event calendars, and travel trends. Actual crowd conditions may vary.
          </div>
        </div>
      )}
    </div>
  );
}
