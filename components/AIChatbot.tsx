'use client';
import { useState, useRef, useEffect } from 'react';

interface Msg { role: 'user'|'ai'; text: string; }

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'ai', text: '🌍 Namaste! I\'m your VIHARA AI Travel Assistant. Ask me anything — from destination recommendations to budget tips for hidden gems across India!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: q }) });
      const data = await res.json();
      setMsgs(m => [...m, { role: 'ai', text: data.reply || 'Let me think about that...' }]);
    } catch {
      setMsgs(m => [...m, { role: 'ai', text: '🔌 Connection issue. Please try again!' }]);
    } finally { setLoading(false); }
  };

  const suggestions = ['Suggest hidden gems in Goa', 'Best budget trip in AP', 'Adventure spots in Rajasthan'];

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1500,
          width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
          boxShadow: '0 8px 32px rgba(250,196,150,0.45)',
          fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 280ms cubic-bezier(0.16,1,0.3,1)',
          transform: open ? 'scale(0.9) rotate(20deg)' : 'scale(1)',
        }}
        aria-label="AI Travel Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 100, right: 28, zIndex: 1400,
          width: 360, height: 520, borderRadius: '22px',
          background: 'rgba(13,15,15,0.97)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(250,196,150,0.15)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', backdropFilter: 'blur(20px)',
          animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)'
        }}>
          <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0); } }`}</style>

          {/* Header */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),var(--teal))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🤖</div>
            <div>
              <div style={{ fontFamily:'var(--heading)', fontWeight:700, color:'var(--gold)', fontSize:'14px' }}>VIHARA AI</div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'5px' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', display:'inline-block' }} /> Live · Travel Expert
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'10px' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'85%', padding:'10px 14px', borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role==='user' ? 'linear-gradient(135deg,var(--gold),var(--gold-light))' : 'rgba(255,255,255,0.06)',
                  color: m.role==='user' ? '#0d0f0f' : 'var(--text)',
                  fontSize:'13px', lineHeight:1.6,
                  border: m.role==='ai' ? '1px solid var(--border)' : 'none',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:'flex', gap:'8px', alignItems:'center', color:'var(--text-muted)', fontSize:'12px' }}>
                <div style={{ display:'flex', gap:'3px' }}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{ width:6,height:6,borderRadius:'50%',background:'var(--gold)',animation:`bounce 1.2s ease ${i*0.2}s infinite` }} />
                  ))}
                </div>
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {msgs.length <= 1 && (
            <div style={{ padding:'0 16px 10px', display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); }} style={{ padding:'5px 10px', borderRadius:'20px', background:'var(--gold-dim)', border:'1px solid var(--border-gold)', color:'var(--gold)', fontSize:'11px', cursor:'pointer', fontFamily:'var(--font)' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border)', display:'flex', gap:'8px' }}>
            <input
              value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && send()}
              placeholder="Ask about destinations..."
              style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:'12px', padding:'10px 14px', color:'var(--text)', fontSize:'13px', outline:'none', fontFamily:'var(--font)' }}
            />
            <button onClick={send} disabled={loading || !input.trim()}
              style={{ width:40, height:40, borderRadius:'12px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', border:'none', cursor:'pointer', fontSize:'16px', flexShrink:0, opacity: (!input.trim()||loading)?0.5:1 }}>
              ↑
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
    </>
  );
}
