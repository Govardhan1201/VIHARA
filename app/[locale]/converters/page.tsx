'use client';
import { useState, useEffect, useRef } from 'react';

const TABS = ['currency', 'distance', 'weight', 'temperature', 'speed', 'time'] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab, string> = { currency: '💱 Currency', distance: '📏 Distance', weight: '⚖️ Weight', temperature: '🌡️ Temperature', speed: '🚗 Speed', time: '⏰ Time Zone' };

function Field({ label, value, readOnly, onChange }: { label: string; value: string | number; readOnly?: boolean; onChange?: (v: string) => void }) {
  return (
    <div className="form-group">
      <label className="field-label">{label}</label>
      <input type={readOnly ? 'text' : 'number'} className="field-input" value={value} readOnly={readOnly} onChange={e => onChange?.(e.target.value)} style={{ fontWeight: 600, fontSize: '15px' }} />
    </div>
  );
}

export default function ConvertersPage() {
  const [tab, setTab] = useState<Tab>('currency');
  // Currency
  const [inr, setInr] = useState('1000');
  // Distance
  const [km, setKm] = useState('100');
  // Weight
  const [kg, setKg] = useState('70');
  // Temperature
  const [celsius, setCelsius] = useState('20');
  // Speed
  const [kmh, setKmh] = useState('100');
  // Time
  const [times, setTimes] = useState({ ist: '', utc: '', est: '', pst: '' });
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (tab === 'time') {
      const updateTime = () => {
        const now = new Date();
        setTimes({
          ist: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }),
          utc: now.toLocaleTimeString('en-GB', { timeZone: 'UTC' }),
          est: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
          pst: now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' }),
        });
      };
      updateTime();
      timerRef.current = setInterval(updateTime, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [tab]);

  const inrN = parseFloat(inr) || 0;
  const kmN = parseFloat(km) || 0;
  const kgN = parseFloat(kg) || 0;
  const celN = parseFloat(celsius) || 0;
  const kmhN = parseFloat(kmh) || 0;

  const tempFeeling = celN <= 0 ? '🥶 Freezing' : celN <= 10 ? '🌨️ Chilly' : celN <= 20 ? '🍃 Cool' : celN <= 30 ? '☀️ Warm' : '🔥 Hot';

  return (
    <div>
      <div className="page-hero">
        <h1>🔄 Universal Converter</h1>
        <p className="tagline">Global Currency Exchange & Unit Conversions for every traveler</p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Tabs */}
        <div className="converter-tabs">
          {TABS.map(t => (
            <button key={t} className={`converter-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="converter-body">
          {/* CURRENCY */}
          {tab === 'currency' && (
            <>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>💱 Global Currency Exchange</h3>
              <div className="converter-row single">
                <Field label="Amount (INR ₹)" value={inr} onChange={setInr} />
              </div>
              <div className="converter-row">
                <Field label="USD ($)" value={(inrN * 0.012).toFixed(2)} readOnly />
                <Field label="EUR (€)" value={(inrN * 0.011).toFixed(2)} readOnly />
              </div>
              <div className="converter-row">
                <Field label="GBP (£)" value={(inrN * 0.0095).toFixed(2)} readOnly />
                <Field label="JPY (¥)" value={(inrN * 1.85).toFixed(2)} readOnly />
              </div>
              <div className="converter-row">
                <Field label="AED (د.إ)" value={(inrN * 0.044).toFixed(2)} readOnly />
                <Field label="SGD (S$)" value={(inrN * 0.016).toFixed(2)} readOnly />
              </div>
              <div className="converter-note">📊 Approximate rates: 1 INR ≈ 0.012 USD · Rates for reference only.</div>
            </>
          )}

          {/* DISTANCE */}
          {tab === 'distance' && (
            <>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>📏 Distance & Length</h3>
              <div className="converter-row single">
                <Field label="Kilometers (km)" value={km} onChange={setKm} />
              </div>
              <div className="converter-row">
                <Field label="Miles (mi)" value={(kmN * 0.621371).toFixed(2)} readOnly />
                <Field label="Meters (m)" value={(kmN * 1000).toFixed(0)} readOnly />
              </div>
              <div className="converter-row">
                <Field label="Feet (ft)" value={(kmN * 3280.84).toFixed(2)} readOnly />
                <Field label="Nautical Miles (nm)" value={(kmN * 0.539957).toFixed(2)} readOnly />
              </div>
            </>
          )}

          {/* WEIGHT */}
          {tab === 'weight' && (
            <>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>⚖️ Weight & Mass</h3>
              <div className="converter-row single">
                <Field label="Kilograms (kg)" value={kg} onChange={setKg} />
              </div>
              <div className="converter-row">
                <Field label="Pounds (lbs)" value={(kgN * 2.20462).toFixed(2)} readOnly />
                <Field label="Grams (g)" value={(kgN * 1000).toFixed(0)} readOnly />
              </div>
              <div className="converter-row">
                <Field label="Ounces (oz)" value={(kgN * 35.274).toFixed(2)} readOnly />
                <Field label="Stones (st)" value={(kgN * 0.157473).toFixed(2)} readOnly />
              </div>
            </>
          )}

          {/* TEMPERATURE */}
          {tab === 'temperature' && (
            <>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>🌡️ Temperature Conversion</h3>
              <div className="converter-row single">
                <Field label="Celsius (°C)" value={celsius} onChange={setCelsius} />
              </div>
              <div className="converter-row">
                <Field label="Fahrenheit (°F)" value={(celN * 9 / 5 + 32).toFixed(1)} readOnly />
                <Field label="Kelvin (K)" value={(celN + 273.15).toFixed(2)} readOnly />
              </div>
              <div className="converter-row single">
                <Field label="Feeling" value={tempFeeling} readOnly />
              </div>
            </>
          )}

          {/* SPEED */}
          {tab === 'speed' && (
            <>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>🚗 Speed Conversion</h3>
              <div className="converter-row single">
                <Field label="Kilometers/hour (km/h)" value={kmh} onChange={setKmh} />
              </div>
              <div className="converter-row">
                <Field label="Miles/hour (mph)" value={(kmhN * 0.621371).toFixed(2)} readOnly />
                <Field label="Meters/second (m/s)" value={(kmhN * 0.277778).toFixed(2)} readOnly />
              </div>
              <div className="converter-row single">
                <Field label="Knots" value={(kmhN * 0.539957).toFixed(2)} readOnly />
              </div>
            </>
          )}

          {/* TIME ZONES */}
          {tab === 'time' && (
            <>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>⏰ Live Time Zone Converter</h3>
              <div className="converter-row">
                <Field label="🇮🇳 IST (India)" value={times.ist} readOnly />
                <Field label="🇬🇧 UTC (London)" value={times.utc} readOnly />
              </div>
              <div className="converter-row">
                <Field label="🇺🇸 EST (New York)" value={times.est} readOnly />
                <Field label="🌅 PST (California)" value={times.pst} readOnly />
              </div>
              <div className="converter-note">🔄 Live times — updating every second.</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
