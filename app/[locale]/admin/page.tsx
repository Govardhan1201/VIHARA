'use client';
import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'vihara123';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (password === ADMIN_PASSWORD) { setAuthenticated(true); setLoginError(false); fetchSubmissions(); }
    else { setLoginError(true); setPassword(''); }
  };

  const logout = () => { setAuthenticated(false); setPassword(''); setSubmissions([]); };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch {} finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (res.ok) fetchSubmissions();
    } catch {}
  };

  const pending = submissions.filter(s => s.status === 'PENDING');
  const approved = submissions.filter(s => s.status === 'APPROVED');

  return (
    <div>
      <div className="page-hero">
        <h1>🔐 Admin Panel</h1>
        <p className="tagline">Review and approve community submissions</p>
      </div>

      {!authenticated ? (
        /* Login Screen */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div className="glass-card" style={{ padding: '48px', maxWidth: 400, width: '100%', textAlign: 'center', border: '1px solid rgba(250,196,150,0.3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)', fontSize: '24px', marginBottom: '8px' }}>Admin Login</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '13px' }}>Enter password to access admin controls</p>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="field-label">Password</label>
              <input
                type="password"
                className="field-input"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                style={{ textAlign: 'center', fontSize: '16px' }}
              />
            </div>
            {loginError && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>❌ Incorrect password. Try again.</p>}
            <button className="btn-gold" onClick={login} style={{ width: '100%', padding: '13px', fontSize: '14px' }}>🔓 Login</button>
          </div>
        </div>
      ) : (
        /* Admin Dashboard */
        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '22px' }}>🎯 Admin Dashboard</h2>
              <div className="admin-badge" style={{ marginTop: '8px', marginBottom: 0 }}>✅ Logged in as Admin</div>
            </div>
            <button onClick={logout} style={{ padding: '10px 20px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              🚪 Logout
            </button>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Submissions', value: submissions.length, color: 'var(--accent-gold)' },
              { label: 'Pending Review', value: pending.length, color: '#f59e0b' },
              { label: 'Approved Gems', value: approved.length, color: '#10b981' },
              { label: 'Rejected', value: submissions.filter(s => s.status === 'REJECTED').length, color: '#ef4444' },
            ].map(stat => (
              <div key={stat.label} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Pending Approvals */}
          <div className="section-title" style={{ marginBottom: '16px' }}>⏳ Pending Approvals ({pending.length})</div>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)', padding: '20px' }}>Loading...</p>
          ) : pending.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '32px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No pending submissions at the moment. Check back soon! ✨</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
              {pending.map((s: any) => (
                <div key={s.id} className="glass-card" style={{ padding: '24px', borderLeft: '3px solid var(--accent-gold)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)', fontSize: '17px', marginBottom: '10px' }}>
                        {s.emoji} {s.placeName}
                      </h3>
                      <div style={{ display: 'grid', gap: '5px', fontSize: '13px' }}>
                        {[
                          ['Submitted by', `${s.submitterName} (${s.submitterEmail})`],
                          ['Date', new Date(s.createdAt).toLocaleDateString()],
                          ['Description', s.description],
                          ['Location', `${s.subZone}, ${s.state}`],
                          ['Details', `${s.activity} • ${s.duration} • ₹${s.budget} • ${s.transport}`],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)', minWidth: '110px', fontWeight: 500 }}>{k}</span>
                            <span style={{ color: 'var(--text-primary)', flex: 1 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button className="approve-btn" onClick={() => updateStatus(s.id, 'APPROVED')}>✅ Approve</button>
                      <button className="reject-btn" onClick={() => updateStatus(s.id, 'REJECTED')}>❌ Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Approved Gems */}
          <div className="section-title" style={{ marginBottom: '16px' }}>✅ Approved Gems ({approved.length})</div>
          {approved.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No approved submissions yet.</p>
            </div>
          ) : (
            <div className="destinations-grid">
              {approved.map((s: any) => (
                <div key={s.id} className="destination-card">
                  <div className="card-image">{s.emoji}</div>
                  <div className="card-body">
                    <div className="card-name">{s.placeName}</div>
                    <div className="card-desc">{s.description}</div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      By: {s.submitterName}
                    </p>
                    <div className="card-tags">
                      <span className="card-tag">📍 {s.state}</span>
                      <span className="card-tag">⏱ {s.duration}</span>
                      <span className="card-tag">💰 ₹{s.budget}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
