'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Master Tabs
  const [view, setView] = useState<'submissions' | 'regions' | 'ai'>('submissions');
  
  // Submission Tabs
  const [tab, setTab] = useState<'pending'|'approved'|'rejected'>('pending');

  // Regions State
  const [regions, setRegions] = useState<any[]>([]);
  const [regName, setRegName] = useState('');
  const [regColor, setRegColor] = useState('#10b981');
  const [regSubZones, setRegSubZones] = useState('');
  const [regCoords, setRegCoords] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // AI State
  const [aiState, setAiState] = useState('');
  const [aiZone, setAiZone] = useState('');
  const [aiCount, setAiCount] = useState(3);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const login = async () => {
    if (!pw.trim()) return;
    setAuthLoading(true); setErr(false);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        sessionStorage.setItem('vihara_admin_token', pw);
        setAuth(true); fetchSubs(); fetchRegions();
      } else { setErr(true); setPw(''); }
    } catch { setErr(true); }
    finally { setAuthLoading(false); }
  };

  const logout = () => { setAuth(false); setPw(''); setSubs([]); sessionStorage.removeItem('vihara_admin_token'); };

  const fetchSubs = async () => {
    setLoading(true);
    const token = sessionStorage.getItem('vihara_admin_token') || '';
    try { const r = await fetch('/api/submissions', { headers: { 'x-admin-token': token } }); const d = await r.json(); setSubs(d.submissions||[]); }
    catch {} finally { setLoading(false); }
  };

  const fetchRegions = async () => {
    try { const r = await fetch('/api/admin/regions'); const d = await r.json(); setRegions(d.raw||[]); }
    catch {}
  };

  const updateStatus = async (id:string, status:string) => {
    const token = sessionStorage.getItem('vihara_admin_token') || '';
    try {
      await fetch(`/api/submissions/${id}`, {
        method:'PATCH',
        headers:{'Content-Type':'application/json', 'x-admin-token': token},
        body:JSON.stringify({ status })
      });
      fetchSubs();
    } catch {}
  };

  const saveRegion = async () => {
    if (!regName || !regSubZones || !regCoords) return alert("Fill all fields");
    setRegLoading(true);
    const token = sessionStorage.getItem('vihara_admin_token') || '';
    try {
      const coordsArr = JSON.parse(regCoords); // expects [[lat,lng],[lat,lng]]
      const szArr = regSubZones.split(',').map(s => s.trim());
      await fetch('/api/admin/regions', {
        method:'POST',
        headers:{'Content-Type':'application/json', 'x-admin-token': token},
        body:JSON.stringify({ name: regName, coords: coordsArr, color: regColor, subZones: szArr })
      });
      fetchRegions();
      alert("Region saved successfully!");
      setRegName(''); setRegSubZones(''); setRegCoords('');
    } catch { alert("Error saving region. Check coordinates format."); }
    finally { setRegLoading(false); }
  };

  const runAiDiscovery = async () => {
    if (!aiState || !aiZone) return alert("Enter State and Sub-Zone");
    setAiLoading(true); setAiResult(null);
    const token = sessionStorage.getItem('vihara_admin_token') || '';
    try {
      const res = await fetch('/api/admin/auto-discover', {
        method:'POST',
        headers:{'Content-Type':'application/json', 'x-admin-token': token},
        body:JSON.stringify({ state: aiState, subZone: aiZone, count: aiCount })
      });
      const data = await res.json();
      if (res.ok) {
        setAiResult(data);
        fetchSubs(); // refresh submissions
      } else { alert(data.error); }
    } catch { alert("Discovery failed"); }
    finally { setAiLoading(false); }
  };

  const pending = subs.filter(s=>s.status==='PENDING');
  const approved = subs.filter(s=>s.status==='APPROVED');
  const rejected = subs.filter(s=>s.status==='REJECTED');
  const shown = tab==='pending' ? pending : tab==='approved' ? approved : rejected;

  return (
    <div className="container" style={{ maxWidth: 1000, paddingBottom: 80 }}>
      <div className="page-hero">
        <h1>🔐 Admin HQ</h1>
        <p className="tagline">Review submissions, manage map regions, and run AI auto-discovery</p>
      </div>

      {!auth ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'45vh' }}>
          <div className="glass glass-gold" style={{ padding:'52px 44px', maxWidth:420, width:'100%', textAlign:'center', borderRadius:'var(--r-xl)' }}>
            <div style={{ fontSize:'52px', marginBottom:'16px' }}>🔐</div>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'26px', fontWeight:800, color:'var(--gold)', marginBottom:'8px' }}>Admin Login</h2>
            <div style={{ marginBottom:'16px' }}>
              <input type="password" className="field-input" placeholder="••••••••"
                value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}
                style={{ textAlign:'center', fontSize:'18px', letterSpacing:'4px' }} />
            </div>
            {err && <p style={{ color:'#ef4444', fontSize:'12px', marginBottom:'14px' }}>❌ Incorrect password.</p>}
            <button onClick={login} disabled={authLoading} className="btn btn-primary" style={{ width:'100%', padding:'14px', fontSize:'14px', justifyContent:'center', borderRadius:'var(--r-sm)' }}>
              {authLoading ? '⏳ Verifying…' : '🔓 Login'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'22px', fontWeight:800 }}>Vihara HQ</h2>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'6px', padding:'4px 12px', borderRadius:'20px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', fontSize:'11px', color:'#10b981', fontWeight:600 }}>
                Logged in as Admin
              </div>
            </div>
            <button onClick={logout} className="btn btn-danger" style={{ fontSize:'13px' }}>🚪 Logout</button>
          </div>

          {/* Master Tabs */}
          <div style={{ display:'flex', gap:'12px', marginBottom:'32px' }}>
            {['submissions', 'regions', 'ai'].map(v => (
              <button key={v} onClick={() => setView(v as any)} className={`btn ${view===v ? 'btn-primary' : ''}`} style={{ background: view!==v ? 'var(--surface)' : '', border: view!==v ? '1px solid var(--border)' : '', color: view!==v ? 'var(--text)' : '' }}>
                {v === 'submissions' ? '📝 Submissions' : v === 'regions' ? '🗺️ Map Regions' : '🤖 AI Auto-Discover'}
              </button>
            ))}
          </div>

          {/* VIEW: SUBMISSIONS */}
          {view === 'submissions' && (
            <>
              <div style={{ display:'flex', gap:'8px', marginBottom:'24px', borderBottom:'1px solid var(--border)', paddingBottom:'0' }}>
                {(['pending','approved','rejected'] as const).map(t=>(
                  <button key={t} onClick={()=>setTab(t)}
                    style={{ padding:'10px 20px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600, fontSize:'13px', color:tab===t?'var(--gold)':'var(--text-muted)', borderBottom:`2px solid ${tab===t?'var(--gold)':'transparent'}`, marginBottom:'-1px', textTransform:'capitalize' }}>
                    {t} ({t==='pending'?pending.length:t==='approved'?approved.length:rejected.length})
                  </button>
                ))}
              </div>

              {loading ? <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>Loading...</div> : shown.length===0 ? (
                <div className="glass" style={{ padding:'52px', textAlign:'center', borderRadius:'var(--r-lg)' }}>
                  <p style={{ color:'var(--text-muted)' }}>No {tab} submissions.</p>
                </div>
              ) : tab==='pending' ? (
                <div style={{ display:'grid', gap:'16px' }}>
                  {shown.map((s:any)=>(
                    <div key={s.id} className="submission-card">
                      <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'14px' }}>
                        <div style={{ flex:1 }}>
                          <div style={{ color:'var(--gold)', fontSize:'18px', fontWeight:700, marginBottom:'12px' }}>{s.emoji} {s.placeName}</div>
                          <div style={{ display:'grid', gap:'7px', fontSize:'13px' }}>
                            <div><strong>By:</strong> {s.submitterName} ({s.submitterEmail})</div>
                            <div><strong>Location:</strong> {s.subZone}, {s.state}</div>
                            <div><strong>Description:</strong> {s.description}</div>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:'8px' }}>
                          <button className="btn btn-success" onClick={()=>updateStatus(s.id,'APPROVED')}>✅ Approve</button>
                          <button className="btn btn-danger" onClick={()=>updateStatus(s.id,'REJECTED')}>❌ Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dest-grid">
                  {shown.map((s:any)=>(
                    <div key={s.id} className="dest-card" style={{ borderColor: tab==='approved'?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)' }}>
                      <div className="dest-card-img">{s.emoji}</div>
                      <div className="dest-card-body">
                        <div className="dest-card-name">{s.placeName}</div>
                        <div className="dest-tags"><span className="dest-tag">{s.state}</span></div>
                        {tab==='approved' && <button className="btn btn-danger" style={{ marginTop:'12px', width:'100%' }} onClick={()=>updateStatus(s.id,'REJECTED')}>Revoke</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* VIEW: REGIONS */}
          {view === 'regions' && (
            <div className="grid-2">
              <div className="glass" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: 16 }}>Add / Edit State Region</h3>
                <div className="form-group">
                  <label className="field-label">State Name</label>
                  <input className="field-input" value={regName} onChange={e=>setRegName(e.target.value)} placeholder="e.g. Kerala" />
                </div>
                <div className="form-group">
                  <label className="field-label">Map Color (Hex)</label>
                  <input type="color" className="field-input" value={regColor} onChange={e=>setRegColor(e.target.value)} style={{ padding: 4, height: 40 }} />
                </div>
                <div className="form-group">
                  <label className="field-label">Sub-Zones (comma separated)</label>
                  <input className="field-input" value={regSubZones} onChange={e=>setRegSubZones(e.target.value)} placeholder="Munnar, Alleppey, Wayanad" />
                </div>
                <div className="form-group">
                  <label className="field-label">Bounding Box Coords (JSON)</label>
                  <textarea className="field-input" value={regCoords} onChange={e=>setRegCoords(e.target.value)} placeholder="[[lat1, lng1], [lat2, lng2]]" style={{ minHeight: 80 }} />
                </div>
                <button onClick={saveRegion} disabled={regLoading} className="btn btn-primary" style={{ width: '100%' }}>
                  {regLoading ? 'Saving...' : 'Save Region'}
                </button>
              </div>
              <div className="glass" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: 16 }}>Existing Regions ({regions.length})</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {regions.map(r => (
                    <div key={r.name} style={{ padding: 12, background: 'var(--surface)', borderLeft: `4px solid ${r.color}` }}>
                      <strong>{r.name}</strong>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.subZones.length} Sub-zones: {r.subZones.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: AI AUTO-DISCOVER */}
          {view === 'ai' && (
            <div className="glass" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <span style={{ fontSize: 48 }}>🤖</span>
                <div>
                  <h2 style={{ margin: 0, color: 'var(--gold)' }}>Gemini Auto-Discovery</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Let AI scrape the web's knowledge and auto-populate hidden gems directly into your database.</p>
                </div>
              </div>

              <div className="grid-3" style={{ marginBottom: 24 }}>
                <div><label className="field-label">Target State</label><input className="field-input" value={aiState} onChange={e=>setAiState(e.target.value)} placeholder="e.g. Karnataka" /></div>
                <div><label className="field-label">Target Sub-Zone</label><input className="field-input" value={aiZone} onChange={e=>setAiZone(e.target.value)} placeholder="e.g. Coorg" /></div>
                <div><label className="field-label">Amount</label><input type="number" className="field-input" value={aiCount} onChange={e=>setAiCount(Number(e.target.value))} min={1} max={10} /></div>
              </div>
              
              <button onClick={runAiDiscovery} disabled={aiLoading} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                {aiLoading ? '⏳ Gemini is hunting for hidden gems...' : '✨ Run Auto-Discovery'}
              </button>

              {aiResult && (
                <div style={{ marginTop: 32, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
                  <h3 style={{ color: '#10b981', marginBottom: 16 }}>✅ Successfully Discovered & Approved {aiResult.added} Places!</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {aiResult.places.map((p: any) => (
                      <div key={p.id} style={{ padding: 12, background: 'var(--card)', borderRadius: 8 }}>
                        <strong>{p.emoji} {p.placeName}</strong>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
