'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

const TABS = ['currency','distance','weight','temperature','speed','time'] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab,string> = { currency:'💱 Currency', distance:'📏 Distance', weight:'⚖️ Weight', temperature:'🌡️ Temp', speed:'🚗 Speed', time:'⏰ Time Zone' };

const CURRENCIES = [
  { code:'USD', label:'🇺🇸 USD ($)',   decimals:2 },
  { code:'EUR', label:'🇪🇺 EUR (€)',   decimals:2 },
  { code:'GBP', label:'🇬🇧 GBP (£)',   decimals:2 },
  { code:'JPY', label:'🇯🇵 JPY (¥)',   decimals:0 },
  { code:'AED', label:'🇦🇪 AED (د.إ)', decimals:2 },
  { code:'SGD', label:'🇸🇬 SGD (S$)', decimals:2 },
  { code:'AUD', label:'🇦🇺 AUD (A$)', decimals:2 },
  { code:'CAD', label:'🇨🇦 CAD (C$)', decimals:2 },
];

interface RateData { rates: Record<string,number>; source: 'live'|'cache'|'fallback'; updatedAt?: string; note?: string; }

function Field({ label, value, readOnly, onChange }: { label:string; value:string|number; readOnly?:boolean; onChange?:(v:string)=>void }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input type={readOnly?'text':'number'} className="field-input" value={value} readOnly={readOnly}
        onChange={e=>onChange?.(e.target.value)} style={{ fontWeight:700, fontSize:'16px', letterSpacing:'0.3px' }} />
    </div>
  );
}

export default function ConvertersPage() {
  const t = useTranslations('converters');
  const [tab, setTab] = useState<Tab>('currency');
  const [inr, setInr] = useState('1000');
  const [km, setKm] = useState('100');
  const [kg, setKg] = useState('70');
  const [celsius, setCelsius] = useState('20');
  const [kmh, setKmh] = useState('100');
  const [times, setTimes] = useState({ ist:'',utc:'',est:'',pst:'',dubai:'',singapore:'' });
  const [rateData, setRateData] = useState<RateData | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const timer = useRef<any>(null);

  // Fetch live exchange rates once on mount
  useEffect(() => {
    setRatesLoading(true);
    fetch('/api/exchange-rates')
      .then(r => r.json())
      .then((d: RateData) => setRateData(d))
      .catch(() => setRateData(null))
      .finally(() => setRatesLoading(false));
  }, []);

  useEffect(() => {
    if (tab==='time') {
      const tick = () => {
        const now = new Date();
        setTimes({
          ist: now.toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour12:true}),
          utc: now.toLocaleTimeString('en-GB',{timeZone:'UTC'}),
          est: now.toLocaleTimeString('en-US',{timeZone:'America/New_York'}),
          pst: now.toLocaleTimeString('en-US',{timeZone:'America/Los_Angeles'}),
          dubai: now.toLocaleTimeString('en-AE',{timeZone:'Asia/Dubai'}),
          singapore: now.toLocaleTimeString('en-SG',{timeZone:'Asia/Singapore'}),
        });
      };
      tick();
      timer.current = setInterval(tick,1000);
    } else { clearInterval(timer.current); }
    return ()=>clearInterval(timer.current);
  },[tab]);

  const n = (v:string) => parseFloat(v)||0;
  const fmt = (v:number,d=2) => isNaN(v)?'0':v.toFixed(d);
  const tempFeeling = n(celsius)<=0?'🥶 Freezing':n(celsius)<=10?'🌨️ Chilly':n(celsius)<=20?'🍃 Cool':n(celsius)<=30?'☀️ Warm':'🔥 Hot';

  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <div className="page-hero">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>🔄 {t('title')}</h1>
        <p className="sub">{t('sub')}</p>
      </div>

      {/* Tabs */}
      <div className="conv-tabs">
        {TABS.map(t=>(
          <button key={t} className={`conv-tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="conv-body">
        {tab==='currency' && (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:12 }}>
              <h3 style={{color:'var(--gold)',fontFamily:'var(--heading)',fontSize:'18px',margin:0}}>💱 Live Currency Exchange</h3>
              <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
                {ratesLoading ? (
                  <span style={{ color:'var(--text-muted)' }}>⏳ Fetching live rates…</span>
                ) : rateData ? (
                  <>
                    <span style={{ width:7, height:7, borderRadius:'50%', background: rateData.source==='live'||rateData.source==='cache' ? '#10b981' : '#f59e0b', display:'inline-block' }} />
                    <span style={{ color: rateData.source==='live'||rateData.source==='cache' ? 'var(--teal)' : '#f59e0b', fontWeight:600 }}>
                      {rateData.source === 'live' ? 'Live rates' : rateData.source === 'cache' ? 'Cached rates' : 'Approximate rates'}
                    </span>
                    {rateData.updatedAt && <span style={{ color:'var(--text-dim)' }}>· Updated {new Date(rateData.updatedAt).toLocaleTimeString()}</span>}
                  </>
                ) : null}
              </div>
            </div>
            <div className="conv-row single"><Field label="Amount (INR ₹)" value={inr} onChange={setInr}/></div>
            {ratesLoading ? (
              <div style={{ padding:'32px', textAlign:'center', color:'var(--text-muted)', fontSize:14 }}>⏳ Loading live exchange rates…</div>
            ) : (
              <>
                <div className="conv-row">
                  {CURRENCIES.slice(0,2).map(c => <Field key={c.code} label={c.label} value={rateData ? (n(inr)*(rateData.rates[c.code]??0)).toFixed(c.decimals) : '—'} readOnly/>)}
                </div>
                <div className="conv-row">
                  {CURRENCIES.slice(2,4).map(c => <Field key={c.code} label={c.label} value={rateData ? (n(inr)*(rateData.rates[c.code]??0)).toFixed(c.decimals) : '—'} readOnly/>)}
                </div>
                <div className="conv-row">
                  {CURRENCIES.slice(4,6).map(c => <Field key={c.code} label={c.label} value={rateData ? (n(inr)*(rateData.rates[c.code]??0)).toFixed(c.decimals) : '—'} readOnly/>)}
                </div>
                <div className="conv-row">
                  {CURRENCIES.slice(6,8).map(c => <Field key={c.code} label={c.label} value={rateData ? (n(inr)*(rateData.rates[c.code]??0)).toFixed(c.decimals) : '—'} readOnly/>)}
                </div>
                <div className="conv-note">
                  {rateData?.source === 'fallback'
                    ? `⚠️ ${rateData.note || 'Showing approximate rates. Add EXCHANGE_RATE_API_KEY for live data.'}`
                    : `📡 Live rates from ExchangeRate-API · 1 INR = ${rateData?.rates?.USD?.toFixed(5) ?? '…'} USD · Refreshes hourly`
                  }
                </div>
              </>
            )}
          </>
        )}

        {tab==='distance' && (
          <>
            <h3 style={{color:'var(--gold)',fontFamily:'var(--heading)',fontSize:'18px',marginBottom:'24px'}}>📏 Distance & Length</h3>
            <div className="conv-row single"><Field label="Kilometers (km)" value={km} onChange={setKm}/></div>
            <div className="conv-row">
              <Field label="Miles (mi)" value={fmt(n(km)*0.621371)} readOnly/>
              <Field label="Meters (m)" value={fmt(n(km)*1000,0)} readOnly/>
            </div>
            <div className="conv-row">
              <Field label="Feet (ft)" value={fmt(n(km)*3280.84)} readOnly/>
              <Field label="Nautical Miles (nm)" value={fmt(n(km)*0.539957)} readOnly/>
            </div>
            <div className="conv-row single">
              <Field label="Centimeters (cm)" value={fmt(n(km)*100000,0)} readOnly/>
            </div>
          </>
        )}

        {tab==='weight' && (
          <>
            <h3 style={{color:'var(--gold)',fontFamily:'var(--heading)',fontSize:'18px',marginBottom:'24px'}}>⚖️ Weight & Mass</h3>
            <div className="conv-row single"><Field label="Kilograms (kg)" value={kg} onChange={setKg}/></div>
            <div className="conv-row">
              <Field label="Pounds (lbs)" value={fmt(n(kg)*2.20462)} readOnly/>
              <Field label="Grams (g)" value={fmt(n(kg)*1000,0)} readOnly/>
            </div>
            <div className="conv-row">
              <Field label="Ounces (oz)" value={fmt(n(kg)*35.274)} readOnly/>
              <Field label="Stones (st)" value={fmt(n(kg)*0.157473)} readOnly/>
            </div>
          </>
        )}

        {tab==='temperature' && (
          <>
            <h3 style={{color:'var(--gold)',fontFamily:'var(--heading)',fontSize:'18px',marginBottom:'24px'}}>🌡️ Temperature Conversion</h3>
            <div className="conv-row single"><Field label="Celsius (°C)" value={celsius} onChange={setCelsius}/></div>
            <div className="conv-row">
              <Field label="Fahrenheit (°F)" value={fmt(n(celsius)*9/5+32,1)} readOnly/>
              <Field label="Kelvin (K)" value={fmt(n(celsius)+273.15,2)} readOnly/>
            </div>
            <div className="conv-row single">
              <div>
                <label className="field-label">Feels Like</label>
                <div style={{padding:'12px 16px',background:'var(--gold-dim)',border:'1px solid var(--border-gold)',borderRadius:'var(--r-sm)',fontSize:'16px',fontWeight:700,color:'var(--gold)'}}>
                  {tempFeeling}
                </div>
              </div>
            </div>
          </>
        )}

        {tab==='speed' && (
          <>
            <h3 style={{color:'var(--gold)',fontFamily:'var(--heading)',fontSize:'18px',marginBottom:'24px'}}>🚗 Speed Conversion</h3>
            <div className="conv-row single"><Field label="Kilometers/hour (km/h)" value={kmh} onChange={setKmh}/></div>
            <div className="conv-row">
              <Field label="Miles/hour (mph)" value={fmt(n(kmh)*0.621371)} readOnly/>
              <Field label="Meters/second (m/s)" value={fmt(n(kmh)*0.277778)} readOnly/>
            </div>
            <div className="conv-row">
              <Field label="Knots" value={fmt(n(kmh)*0.539957)} readOnly/>
              <Field label="Feet/second (fps)" value={fmt(n(kmh)*0.911344)} readOnly/>
            </div>
          </>
        )}

        {tab==='time' && (
          <>
            <h3 style={{color:'var(--gold)',fontFamily:'var(--heading)',fontSize:'18px',marginBottom:'8px'}}>⏰ Live Time Zone Converter</h3>
            <div style={{fontSize:'12px',color:'var(--teal)',marginBottom:'24px',display:'flex',alignItems:'center',gap:'6px'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:'#10b981',display:'inline-block',animation:'pulse 2s infinite'}}/>
              Live — updating every second
            </div>
            <div className="conv-row">
              <Field label="🇮🇳 IST — India" value={times.ist} readOnly/>
              <Field label="🌍 UTC — London" value={times.utc} readOnly/>
            </div>
            <div className="conv-row">
              <Field label="🇺🇸 EST — New York" value={times.est} readOnly/>
              <Field label="🌅 PST — California" value={times.pst} readOnly/>
            </div>
            <div className="conv-row">
              <Field label="🇦🇪 Dubai (GST)" value={times.dubai} readOnly/>
              <Field label="🇸🇬 Singapore (SGT)" value={times.singapore} readOnly/>
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          </>
        )}
      </div>
    </div>
  );
}
