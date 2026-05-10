'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function SubmitPage() {
  const t = useTranslations('submit');
  const [form, setForm] = useState({ placeName:'', state:'', subZone:'', description:'', activity:'', duration:'', budget:'', transport:'', accommodation:'budget', emoji:'🌟', mapLink:'', imageLink:'', videoLink:'', submitterName:'', submitterEmail:'' });
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/submissions?status=PENDING');
      const data = await res.json();
      setPending(data.submissions || []);
    } catch {}
  };

  const aiAutofill = async () => {
    if (!form.placeName) { alert('Enter a place name first!'); return; }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `Give me brief details about "${form.placeName}" as a travel destination in India: what state is it in, what kind of activity (adventure/cultural/nature/photography), short 1-sentence description, approximate budget in INR, and best transport option. Reply in this exact JSON format: {"state":"...","description":"...","activity":"...","budget":1000,"transport":"..."}` }) });
      const data = await res.json();
      try {
        const match = data.reply.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          setForm(f => ({ ...f, state: parsed.state || f.state, description: parsed.description || f.description, activity: parsed.activity || f.activity, budget: parsed.budget?.toString() || f.budget, transport: parsed.transport || f.transport }));
        }
      } catch {}
    } catch {} finally { setAiLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = ['placeName','state','subZone','description','activity','duration','budget','transport','submitterName','submitterEmail'];
    if (required.some(k => !(form as any)[k])) { alert('❌ Please fill all required fields!'); return; }
    setStatus('submitting');
    try {
      const res = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, budget: parseInt(form.budget) }) });
      if (res.ok) { setStatus('success'); setForm({ placeName:'', state:'', subZone:'', description:'', activity:'', duration:'', budget:'', transport:'', accommodation:'budget', emoji:'🌟', mapLink:'', imageLink:'', videoLink:'', submitterName:'', submitterEmail:'' }); fetchPending(); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  const InputField = ({ label, name, type='text', placeholder='', required=false, options=null as null|string[], textarea=false }: any) => (
    <div className="form-group">
      <label className="field-label">{label}{required && <span style={{color:'var(--gold)'}}>*</span>}</label>
      {textarea ? (
        <textarea className="field-input" placeholder={placeholder} value={(form as any)[name]} onChange={e => set(name, e.target.value)} required={required} />
      ) : options ? (
        <select className="field-select" value={(form as any)[name]} onChange={e => set(name, e.target.value)} required={required}>
          {options.map((o:string) => <option key={o} value={o===options[0]?'':o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} className="field-input" placeholder={placeholder} value={(form as any)[name]} onChange={e => set(name, e.target.value)} required={required} />
      )}
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <div className="page-hero">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>✍️ {t('title')}</h1>
        <p className="sub">{t('sub')}</p>
      </div>

      {/* AI Autofill Banner */}
      <div className="card" style={{ display:'flex', alignItems:'center', gap:'14px', padding:'18px 22px', marginBottom:'24px', background:'var(--gold-dim)', borderColor:'var(--gold-border)' }}>
        <span style={{ fontSize:'28px' }}>🤖</span>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'DM Sans, sans-serif', fontWeight:700, color:'var(--gold)', fontSize:'14px', marginBottom:'2px' }}>{t('ai_fill')}</div>
          <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{t('ai_fill_desc')}</div>
        </div>
        <button onClick={aiAutofill} disabled={aiLoading} className="btn btn-primary btn-sm" style={{ flexShrink:0 }}>
          {aiLoading ? '⏳ ...' : `✨ ${t('ai_btn')}`}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Location Details */}
        <div className="glass" style={{ padding:'28px', marginBottom:'20px' }}>
          <div className="form-section-label">📍 Location Details</div>
          <div className="form-grid">
            <InputField label="Place Name" name="placeName" placeholder="e.g. Anamudi Peak" required />
            <InputField label="State" name="state" options={['Select State','Andhra Pradesh','Telangana','Rajasthan','Goa','Other']} required />
            <InputField label="Sub-Zone / City" name="subZone" placeholder="e.g. Vizag" required />
            <InputField label="Emoji / Icon" name="emoji" placeholder="e.g. 🏔️" />
          </div>
        </div>

        {/* Description & Details */}
        <div className="glass" style={{ padding:'28px', marginBottom:'20px' }}>
          <div className="form-section-label">📝 Description & Details</div>
          <div className="form-group" style={{ marginBottom:'20px' }}>
            <label className="field-label">Description <span style={{color:'var(--gold)'}}>*</span></label>
            <textarea className="field-input" placeholder="Describe this hidden gem..." value={form.description} onChange={e => set('description', e.target.value)} required />
          </div>
          <div className="form-grid">
            <InputField label="Activity Type" name="activity" options={['Select Activity','adventure','cultural','nature','photography']} required />
            <InputField label="Duration" name="duration" options={['Select Duration','short','medium']} required />
            <InputField label="Budget (₹)" name="budget" type="number" placeholder="e.g. 1500" required />
            <InputField label="Transport Options" name="transport" placeholder="e.g. Bus/Train/Flight" required />
            <InputField label="Accommodation" name="accommodation" options={['budget','midrange','luxury']} />
          </div>
        </div>

        {/* Links & Contact */}
        <div className="glass" style={{ padding:'28px', marginBottom:'28px' }}>
          <div className="form-section-label">🔗 Links & Contact</div>
          <div className="form-grid">
            <InputField label="Google Maps Link" name="mapLink" type="url" placeholder="https://maps.app.goo.gl/..." />
            <InputField label="Photos Link" name="imageLink" type="url" placeholder="https://..." />
            <InputField label="Video Link" name="videoLink" type="url" placeholder="https://youtube.com/..." />
            <InputField label="Your Name" name="submitterName" placeholder="Your full name" required />
            <InputField label="Your Email" name="submitterEmail" type="email" placeholder="your@email.com" required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width:'100%', padding:'16px', fontSize:'15px', borderRadius:'var(--r-sm)', justifyContent:'center' }} disabled={status==='submitting'}>
          {status==='submitting' ? '⏳ Submitting...' : '🚀 Submit Hidden Gem'}
        </button>
        {status==='success' && <p style={{ color:'#10b981', textAlign:'center', marginTop:'14px', fontWeight:600, fontSize:'14px' }}>✅ Gem submitted! Waiting for admin approval.</p>}
        {status==='error' && <p style={{ color:'#ef4444', textAlign:'center', marginTop:'14px', fontSize:'13px' }}>Something went wrong. Please try again.</p>}
      </form>

      {/* Pending Submissions */}
      <div style={{ marginTop:'52px' }}>
        <div className="form-section-label">📤 Pending Submissions <span style={{ fontSize:'13px', color:'var(--text-muted)', fontFamily:'Inter, sans-serif', fontWeight:400 }}>({pending.length})</span></div>
        {pending.length === 0 ? (
          <div className="glass" style={{ padding:'48px', textAlign:'center', borderRadius:'var(--r-lg)' }}>
            <div style={{ fontSize:'32px', marginBottom:'10px' }}>🌟</div>
            <p style={{ color:'var(--text-muted)' }}>No pending submissions yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="dest-grid">
            {pending.map((s:any) => (
              <div key={s.id} className="dest-card" style={{ borderStyle:'dashed' }}>
                <div className="dest-card-img">{s.emoji}</div>
                <div className="dest-card-body">
                  <div className="badge badge-pending" style={{ marginBottom:'8px' }}>⏳ Pending Approval</div>
                  <div className="dest-card-name">{s.placeName}</div>
                  <div className="dest-card-desc">{s.description}</div>
                  <div style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'10px' }}>
                    By: {s.submitterName} · {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                  <div className="dest-tags">
                    <span className="dest-tag">📍 {s.state}</span>
                    <span className="dest-tag">⏱ {s.duration}</span>
                    <span className="dest-tag gold">₹{s.budget}</span>
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
