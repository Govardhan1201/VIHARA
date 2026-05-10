'use client';
import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

const QUICK: Record<string, string[]> = {
  en: ['Best hidden gems in Araku?', 'Local food near Vizag?', 'Budget trek in Rajasthan?'],
  hi: ['अरकू में छुपे रत्न?', 'विजाग के पास स्थानीय खाना?', 'राजस्थान में बजट ट्रेक?'],
  te: ['అరకులో దాచిన రత్నాలు?', 'విజాగ్ దగ్గర స్థానిక ఆహారం?', 'రాజస్థాన్‌లో బడ్జెట్ ట్రెక్?'],
};

interface Msg { role: 'user' | 'ai'; text: string; }

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const t = useTranslations('chat');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: 'ai', text: t('greeting') }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const langNote = locale === 'hi' ? 'Please respond in Hindi.' : locale === 'te' ? 'Please respond in Telugu.' : 'Please respond in English.';
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${langNote}\n\n${userMsg}` }),
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: 'ai', text: data.reply || 'Sorry, I could not get a response.' }]);
    } catch {
      setMsgs(m => [...m, { role: 'ai', text: 'Connection error. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const quickReplies = QUICK[locale] || QUICK.en;

  return (
    <>
      {open && (
        <div className="chatbot-panel">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:16, color:'var(--text)' }}>{t('title')}</div>
                <div style={{ fontSize:11, color:'var(--gold)', marginTop:2 }}>{t('subtitle')}</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'50%', width:32, height:32, fontSize:14, color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            {/* Lang note */}
            <div style={{ marginTop:10, fontSize:11, color:'var(--teal)', fontStyle:'italic' }}>{t('lang_note')}</div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {msgs.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.role}`}>{m.text}</div>
            ))}
            {loading && (
              <div className="chatbot-msg ai" style={{ display:'flex', gap:5, alignItems:'center' }}>
                {[0,1,2].map(i => <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)', display:'inline-block', animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />)}
              </div>
            )}
            {msgs.length === 1 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:4 }}>
                {quickReplies.map(q => (
                  <button key={q} onClick={() => send(q)} style={{ padding:'5px 12px', background:'var(--card)', border:'1px solid var(--border)', borderRadius:50, fontSize:11, color:'var(--text-muted)', cursor:'pointer', transition:'all var(--dur)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--gold-border)'; (e.currentTarget as HTMLButtonElement).style.color='var(--gold)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor='var(--border)'; (e.currentTarget as HTMLButtonElement).style.color='var(--text-muted)'; }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-row">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder={t('placeholder')} />
            <button onClick={() => send(input)} className="btn btn-primary btn-sm" style={{ borderRadius:50, flexShrink:0 }}>
              {t('send')}
            </button>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button className="chatbot-bubble" onClick={() => setOpen(o => !o)} title={t('open')}>
        {open ? '✕' : '🤖'}
      </button>
      <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.4);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
    </>
  );
}
