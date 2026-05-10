'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<'pending'|'approved'|'rejected'>('pending');

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
        setAuth(true); fetchSubs();
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

  const pending = subs.filter(s=>s.status==='PENDING');
  const approved = subs.filter(s=>s.status==='APPROVED');
  const rejected = subs.filter(s=>s.status==='REJECTED');

  const stats = [
    { value:subs.length, label:'Total Submissions', color:'var(--gold)' },
    { value:pending.length, label:'Pending Review', color:'#f59e0b' },
    { value:approved.length, label:'Approved Gems', color:'#10b981' },
    { value:rejected.length, label:'Rejected', color:'#ef4444' },
  ];

  const shown = tab==='pending' ? pending : tab==='approved' ? approved : rejected;

  return (
    <div className="container" style={{ maxWidth: 1000, paddingBottom: 80 }}>
      <div className="page-hero">
        <h1>🔐 Admin Panel</h1>
        <p className="tagline">Review, approve and manage community destination submissions</p>
      </div>

      {!auth ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'45vh' }}>
          <div className="glass glass-gold" style={{ padding:'52px 44px', maxWidth:420, width:'100%', textAlign:'center', borderRadius:'var(--r-xl)' }}>
            <div style={{ fontSize:'52px', marginBottom:'16px' }}>🔐</div>
            <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'26px', fontWeight:800, color:'var(--gold)', marginBottom:'8px' }}>Admin Login</h2>
            <p style={{ color:'var(--text-muted)', marginBottom:'32px', fontSize:'13px' }}>Enter your password to access the admin dashboard</p>
            <div style={{ marginBottom:'16px' }}>
              <label className="field-label">Admin Password</label>
              <input type="password" className="field-input" placeholder="••••••••"
                value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}
                style={{ textAlign:'center', fontSize:'18px', letterSpacing:'4px' }} />
            </div>
            {err && <p style={{ color:'#ef4444', fontSize:'12px', marginBottom:'14px' }}>❌ Incorrect password. Please try again.</p>}
            <button onClick={login} disabled={authLoading} className="btn btn-primary" style={{ width:'100%', padding:'14px', fontSize:'14px', justifyContent:'center', borderRadius:'var(--r-sm)', opacity: authLoading ? 0.7 : 1 }}>
              {authLoading ? '⏳ Verifying…' : '🔓 Login to Dashboard'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'22px', fontWeight:800 }}>Admin Dashboard</h2>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'6px', padding:'4px 12px', borderRadius:'20px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', fontSize:'11px', color:'#10b981', fontWeight:600 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', display:'inline-block' }}/>
                Logged in as Admin
              </div>
            </div>
            <button onClick={logout} className="btn btn-danger" style={{ fontSize:'13px' }}>🚪 Logout</button>
          </div>

          {/* Stats Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'32px' }}>
            {stats.map(s=>(
              <div key={s.label} className="stat-card">
                <span className="stat-value" style={{ color:s.color }}>{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'24px', borderBottom:'1px solid var(--border)', paddingBottom:'0' }}>
            {(['pending','approved','rejected'] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{ padding:'10px 20px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font)', fontWeight:600, fontSize:'13px', color:tab===t?'var(--gold)':'var(--text-muted)', borderBottom:`2px solid ${tab===t?'var(--gold)':'transparent'}`, marginBottom:'-1px', transition:'all var(--dur)', textTransform:'capitalize' }}>
                {t} ({t==='pending'?pending.length:t==='approved'?approved.length:rejected.length})
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>Loading submissions...</div>
          ) : shown.length===0 ? (
            <div className="glass" style={{ padding:'52px', textAlign:'center', borderRadius:'var(--r-lg)' }}>
              <div style={{ fontSize:'36px', marginBottom:'10px' }}>{tab==='pending'?'✅':tab==='approved'?'🌟':'🚫'}</div>
              <p style={{ color:'var(--text-muted)' }}>No {tab} submissions.</p>
            </div>
          ) : tab==='pending' ? (
            <div style={{ display:'grid', gap:'16px' }}>
              {shown.map((s:any)=>(
                <div key={s.id} className="submission-card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'14px' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:'Playfair Display, serif', color:'var(--gold)', fontSize:'18px', fontWeight:700, marginBottom:'12px' }}>
                        {s.emoji} {s.placeName}
                      </div>
                      <div style={{ display:'grid', gap:'7px', fontSize:'13px' }}>
                        {[['Submitted by',`${s.submitterName} (${s.submitterEmail})`],['Date',new Date(s.createdAt).toLocaleDateString()],['Description',s.description],['Location',`${s.subZone}, ${s.state}`],['Details',`${s.activity} · ${s.duration} · ₹${s.budget} · ${s.transport}`]].map(([k,v])=>(
                          <div key={k} style={{ display:'flex', gap:'12px' }}>
                            <span style={{ color:'var(--text-muted)', minWidth:'110px', fontWeight:600, flexShrink:0 }}>{k}</span>
                            <span style={{ color:'var(--text)' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'8px', flexShrink:0, alignItems:'center' }}>
                      <button className="btn btn-success" onClick={()=>updateStatus(s.id,'APPROVED')} style={{ fontSize:'12px' }}>✅ Approve</button>
                      <button className="btn btn-danger" onClick={()=>updateStatus(s.id,'REJECTED')} style={{ fontSize:'12px' }}>❌ Reject</button>
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
                    <div style={{ marginBottom:'6px' }}>
                      {tab==='approved'
                        ? <span className="badge badge-approved">✅ Approved</span>
                        : <span className="badge" style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.25)' }}>❌ Rejected</span>}
                    </div>
                    <div className="dest-card-name">{s.placeName}</div>
                    <div className="dest-card-desc">{s.description}</div>
                    <p style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'10px' }}>By: {s.submitterName}</p>
                    <div className="dest-tags">
                      <span className="dest-tag">📍 {s.state}</span>
                      <span className="dest-tag gold">₹{s.budget}</span>
                    </div>
                    {tab==='approved' && (
                      <button className="btn btn-danger" style={{ marginTop:'12px', fontSize:'11px', width:'100%', justifyContent:'center' }} onClick={()=>updateStatus(s.id,'REJECTED')}>Revoke</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
