'use client';
import { useState, useEffect } from 'react';

export default function SubmitPage() {
  const [form, setForm] = useState({ placeName:'', state:'', subZone:'', description:'', activity:'', duration:'', budget:'', transport:'', accommodation:'budget', emoji:'🌟', mapLink:'', imageLink:'', videoLink:'', submitterName:'', submitterEmail:'' });
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState<any[]>([]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/submissions?status=PENDING');
      const data = await res.json();
      setPending(data.submissions || []);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = ['placeName','state','subZone','description','activity','duration','budget','transport','submitterName','submitterEmail'];
    if (required.some(k => !(form as any)[k])) { alert('❌ Please fill all required fields!'); return; }
    setStatus('submitting');
    try {
      const res = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, budget: parseInt(form.budget) }) });
      if (res.ok) {
        setStatus('success');
        setForm({ placeName:'', state:'', subZone:'', description:'', activity:'', duration:'', budget:'', transport:'', accommodation:'budget', emoji:'🌟', mapLink:'', imageLink:'', videoLink:'', submitterName:'', submitterEmail:'' });
        fetchPending();
      } else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  return (
    <div>
      <div className="page-hero">
        <h1>✍️ Submit Your Hidden Gem</h1>
        <p className="tagline">Share your favourite offbeat location with the VIHARA community</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Location Details */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
          <div className="form-section-title">📍 Location Details</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="field-label">Place Name *</label>
              <input className="field-input" placeholder="e.g. Anamudi Peak" value={form.placeName} onChange={e => set('placeName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="field-label">State *</label>
              <select className="field-select" value={form.state} onChange={e => set('state', e.target.value)} required>
                <option value="">Select State</option>
                <option>Andhra Pradesh</option><option>Telangana</option><option>Rajasthan</option><option>Goa</option><option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="field-label">Sub-Zone / City *</label>
              <input className="field-input" placeholder="e.g. Vizag" value={form.subZone} onChange={e => set('subZone', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="field-label">Emoji / Icon</label>
              <input className="field-input" placeholder="e.g. 🏔️" value={form.emoji} onChange={e => set('emoji', e.target.value)} maxLength={2} />
            </div>
          </div>
        </div>

        {/* Description & Details */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
          <div className="form-section-title">📝 Description & Details</div>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="field-label">Description *</label>
              <textarea className="field-input" placeholder="Describe this hidden gem..." value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="field-label">Activity Type *</label>
              <select className="field-select" value={form.activity} onChange={e => set('activity', e.target.value)} required>
                <option value="">Select Activity</option>
                <option value="adventure">Adventure</option><option value="cultural">Cultural</option><option value="nature">Nature</option><option value="photography">Photography</option>
              </select>
            </div>
            <div className="form-group">
              <label className="field-label">Duration *</label>
              <select className="field-select" value={form.duration} onChange={e => set('duration', e.target.value)} required>
                <option value="">Select Duration</option>
                <option value="short">Short (1-2 days)</option><option value="medium">Medium (3-5 days)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="field-label">Budget (₹) *</label>
              <input type="number" className="field-input" placeholder="e.g. 1500" value={form.budget} onChange={e => set('budget', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="field-label">Transport Options *</label>
              <input className="field-input" placeholder="e.g. Bus/Train/Flight" value={form.transport} onChange={e => set('transport', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="field-label">Accommodation Type</label>
              <select className="field-select" value={form.accommodation} onChange={e => set('accommodation', e.target.value)}>
                <option value="budget">Budget</option><option value="midrange">Mid-range</option><option value="luxury">Luxury</option>
              </select>
            </div>
          </div>
        </div>

        {/* Links & Contact */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '28px' }}>
          <div className="form-section-title">🔗 Links & Contact</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="field-label">Google Maps Link</label>
              <input type="url" className="field-input" placeholder="https://maps.app.goo.gl/..." value={form.mapLink} onChange={e => set('mapLink', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="field-label">Photos Link</label>
              <input type="url" className="field-input" placeholder="https://..." value={form.imageLink} onChange={e => set('imageLink', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="field-label">Video Link</label>
              <input type="url" className="field-input" placeholder="https://youtube.com/..." value={form.videoLink} onChange={e => set('videoLink', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="field-label">Your Name *</label>
              <input className="field-input" placeholder="Your full name" value={form.submitterName} onChange={e => set('submitterName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="field-label">Your Email *</label>
              <input type="email" className="field-input" placeholder="your@email.com" value={form.submitterEmail} onChange={e => set('submitterEmail', e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: '15px' }} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : '🚀 Submit Hidden Gem'}
          </button>
          {status === 'success' && <p style={{ color: '#10b981', textAlign: 'center', marginTop: '12px', fontWeight: 600 }}>✅ Submitted! Waiting for admin approval.</p>}
          {status === 'error' && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '12px' }}>Something went wrong. Please try again.</p>}
        </div>
      </form>

      {/* Pending Submissions */}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-title" style={{ marginBottom: '20px' }}>📤 Pending Submissions</div>
        {pending.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)' }}>
            No pending submissions yet. Be the first to share! 🌟
          </div>
        ) : (
          <div className="destinations-grid">
            {pending.map((s: any) => (
              <div key={s.id} className="destination-card" style={{ borderStyle: 'dashed' }}>
                <div className="card-image">{s.emoji}</div>
                <div className="card-body">
                  <div className="pending-badge">⏳ Pending Approval</div>
                  <div className="card-name">{s.placeName}</div>
                  <div className="card-desc">{s.description}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    <strong>By:</strong> {s.submitterName}<br />
                    <strong>Submitted:</strong> {new Date(s.createdAt).toLocaleDateString()}
                  </div>
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
    </div>
  );
}
