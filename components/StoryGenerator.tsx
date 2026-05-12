'use client';
import { useState, useCallback } from 'react';

interface PhotoLayout { index: number; type: string; caption: string; }
interface Section { heading: string; body: string; photoIndices: number[]; }
interface StoryOutput {
  title: string; mood: string; caption: string;
  photoLayout: PhotoLayout[]; sections: Section[];
}

const TYPE_ICON: Record<string, string> = {
  landscape: '🏔', portrait: '👤', food: '🍲',
  architecture: '🏛', activity: '🎯', other: '📷',
};

function SocialShare({ title, caption }: { title: string; caption: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${title}\n\n${caption}`;
  const encoded = encodeURIComponent(text);
  const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://vihara.app');

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: caption, url: window.location.href }); return; } catch {}
    }
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const btn = (label: string, href: string, color: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
      borderRadius: 50, border: `1px solid ${color}30`, background: `${color}12`,
      color, fontSize: 12, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
      transition: 'all 0.2s',
    }}>{label}</a>
  );

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 14 }}>🔗 Share Your Story</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {btn('𝕏 Twitter / X', `https://twitter.com/intent/tweet?text=${encoded}&url=${url}`, '#1d9bf0')}
        {btn('💬 WhatsApp', `https://wa.me/?text=${encoded}`, '#25d366')}
        <button onClick={shareNative} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          borderRadius: 50, border: '1px solid rgba(200,100,255,0.3)', background: 'rgba(200,100,255,0.1)',
          color: '#c864ff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>
          {copied ? '✅ Copied!' : '📋 Instagram (Copy)'}
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, marginBottom: 0 }}>
        Instagram tip: copy the text above, then paste it as your caption when you post your photo.
      </p>
    </div>
  );
}

function ReelCaption({ destination, title }: { destination: string; title: string }) {
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Reel caption for travel video about "${destination || title}". Max 12 words, punchy and emotional. Then 5 hashtags like #HiddenIndia #TravelIndia #OffbeatIndia #Vihara. Output ONLY the caption and hashtags, nothing else.` }),
      });
      const data = await res.json();
      setCaption(data.reply || 'Could not generate. Try again.');
    } catch { setCaption('Could not generate. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: 'rgba(255,100,150,0.05)', border: '1px solid rgba(255,100,150,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: caption ? 12 : 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#f472b6', letterSpacing: '0.8px', textTransform: 'uppercase' }}>🎬 Reel Caption AI</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {caption && <button onClick={() => { navigator.clipboard.writeText(caption); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 50, border: '1px solid rgba(244,114,182,0.3)', color: '#f472b6', background: 'none', cursor: 'pointer' }}>{copied ? '✅ Copied!' : '📋 Copy'}</button>}
          <button onClick={generate} disabled={loading} style={{ fontSize: 11, padding: '4px 14px', borderRadius: 50, border: '1px solid rgba(244,114,182,0.4)', background: 'rgba(244,114,182,0.1)', color: '#f472b6', cursor: 'pointer', fontWeight: 700 }}>
            {loading ? '⏳…' : caption ? '🔄 Regenerate' : '✨ Generate Reel Caption'}
          </button>
        </div>
      </div>
      {caption && <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{caption}</p>}
    </div>
  );
}

function JournalOutput({ story, previews, destination, onReset }: {
  story: StoryOutput; previews: string[]; destination: string; onReset: () => void;
}) {
  const getPhotosByType = (type: string) =>
    story.photoLayout?.filter(p => p.type === type && p.index < previews.length) || [];

  const heroPh = story.photoLayout?.find(p => (p.type === 'landscape' || p.type === 'architecture') && p.index < previews.length)
    || story.photoLayout?.find(p => p.index < previews.length);

  return (
    <div>
      {/* Mood + Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ padding: '5px 14px', borderRadius: 50, background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', color: 'var(--gold)', fontSize: 12, fontWeight: 700 }}>✨ {story.mood}</span>
        <button onClick={onReset} style={{ fontSize: 12, padding: '5px 14px', borderRadius: 50, border: '1px solid var(--border)', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>+ New Story</button>
      </div>

      {/* Hero Cover */}
      {heroPh && previews[heroPh.index] && (
        <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 0, aspectRatio: '16/7' }}>
          <img src={previews[heroPh.index]} alt={heroPh.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 32px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '2px' }}>{story.mood}</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px,4vw,36px)', color: '#fff', margin: 0, lineHeight: 1.2, fontWeight: 900 }}>{story.title}</h2>
          </div>
        </div>
      )}

      {/* Journal Body */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-gold)', borderRadius: heroPh ? '0 0 20px 20px' : 20, padding: '36px', marginBottom: 20, borderTop: heroPh ? 'none' : undefined }}>
        {!heroPh && (
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(22px,4vw,32px)', color: 'var(--gold)', marginBottom: 28, lineHeight: 1.2 }}>{story.title}</h2>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--teal))' }} />

        {(story.sections || []).map((section, si) => {
          const sectionPhotos = (section.photoIndices || []).filter(i => i < previews.length && (!heroPh || i !== heroPh.index));
          return (
            <div key={si} style={{ marginBottom: 36 }}>
              {section.heading && (
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--gold)', marginBottom: 14, fontStyle: 'italic', fontWeight: 600 }}>
                  {section.heading}
                </h3>
              )}
              <div style={{ display: sectionPhotos.length > 0 ? 'grid' : 'block', gridTemplateColumns: sectionPhotos.length > 0 ? '1fr 1fr' : undefined, gap: 20, alignItems: 'start' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.9, margin: 0 }}>{section.body}</p>
                {sectionPhotos.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sectionPhotos.map(idx => {
                      const ph = story.photoLayout?.find(p => p.index === idx);
                      return (
                        <div key={idx} style={{ borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                          <img src={previews[idx]} alt={ph?.caption || ''} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                          {ph && (
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: 10 }}>{TYPE_ICON[ph.type] || '📷'}</span>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>{ph.caption}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Photo Gallery by Type */}
        {['portrait', 'food', 'activity'].map(type => {
          const typed = getPhotosByType(type);
          if (!typed.length) return null;
          return (
            <div key={type} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>
                {TYPE_ICON[type]} {type === 'portrait' ? 'People & Faces' : type === 'food' ? 'Food & Flavours' : 'Adventures'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(typed.length, 3)}, 1fr)`, gap: 8 }}>
                {typed.map(ph => (
                  <div key={ph.index} style={{ borderRadius: 10, overflow: 'hidden', aspectRatio: '1', position: 'relative' }}>
                    <img src={previews[ph.index]} alt={ph.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Caption */}
      <div style={{ background: 'rgba(50,184,198,0.06)', border: '1px solid rgba(50,184,198,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Social Caption</span>
          <button onClick={() => navigator.clipboard.writeText(story.caption)} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 50, border: '1px solid rgba(50,184,198,0.3)', color: 'var(--teal)', background: 'none', cursor: 'pointer' }}>📋 Copy</button>
        </div>
        <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{story.caption}</p>
      </div>

      <SocialShare title={story.title} caption={story.caption} />
      <ReelCaption destination={destination} title={story.title} />
    </div>
  );
}

export default function StoryGenerator({ compact = false }: { compact?: boolean }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [destination, setDestination] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<StoryOutput | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback((selected: File[]) => {
    const valid = selected.filter(f => f.type.startsWith('image/')).slice(0, 6);
    setFiles(prev => [...prev, ...valid].slice(0, 6));
    valid.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPreviews(prev => [...prev, e.target?.result as string].slice(0, 6));
      reader.readAsDataURL(f);
    });
  }, []);

  const removeImage = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const compress = (file: File): Promise<File> =>
    new Promise(resolve => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1024;
        let w = img.width, h = img.height;
        if (w > h && w > MAX) { h *= MAX / w; w = MAX; }
        else if (h > MAX) { w *= MAX / h; h = MAX; }
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d')?.drawImage(img, 0, 0, w, h);
        c.toBlob(b => resolve(b ? new File([b], file.name, { type: 'image/jpeg' }) : file), 'image/jpeg', 0.82);
      };
      img.onerror = () => resolve(file);
    });

  const generate = async () => {
    if (!files.length) { setError('Upload at least one travel photo to begin.'); return; }
    setError(''); setLoading(true); setStory(null);
    try {
      const fd = new FormData();
      for (const f of files) fd.append('images', await compress(f));
      if (destination) fd.append('destination', destination);
      if (mood) fd.append('mood', mood);

      const res = await fetch('/api/story', { method: 'POST', body: fd });
      if (res.status === 413) throw new Error('Images too large. Please use fewer photos.');
      if (res.status === 429) throw new Error('Too many requests. Please wait a minute.');
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setStory(data.story);
    } catch (e: any) { setError(e.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const reset = () => { setFiles([]); setPreviews([]); setStory(null); setError(''); setDestination(''); setMood(''); };

  if (compact) return (
    <a href="/en/story" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(250,196,150,0.07), rgba(50,184,198,0.05))', border: '1px solid var(--border-gold)', borderRadius: 'var(--r-xl)', padding: '36px 32px', cursor: 'pointer' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>✨</div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--gold)', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>AI Travel Story Generator</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>Upload your travel photos and let VIHARA AI craft a cinematic journal — with magazine layout, photo captions, and social sharing.</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>Turn memories into stories →</div>
      </div>
    </a>
  );

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      {!story && (
        <>
          <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(Array.from(e.dataTransfer.files)); }}
            onClick={() => document.getElementById('story-file-input')?.click()}
            style={{ border: `2px dashed ${dragging ? 'var(--gold)' : 'rgba(250,196,150,0.3)'}`, borderRadius: 20, padding: '52px 32px', textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(250,196,150,0.05)' : 'rgba(255,255,255,0.02)', marginBottom: 24 }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>📷</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Drop your travel photos here</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Or click to pick from your device · Up to 6 images · JPG, PNG, WEBP</p>
            <div style={{ display: 'inline-flex', padding: '10px 24px', borderRadius: 50, border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13 }}>Browse Photos</div>
            <input id="story-file-input" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(Array.from(e.target.files || []))} />
          </div>

          {previews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 12, marginBottom: 24 }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '1', border: '1px solid var(--border-gold)' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={e => { e.stopPropagation(); removeImage(i); }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Destination (optional)</label>
              <input style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontSize: 14, boxSizing: 'border-box' }} placeholder="e.g. Araku, Goa, Hampi…" value={destination} onChange={e => setDestination(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Story Mood (optional)</label>
              <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(30,30,40,0.9)', color: 'var(--text)', fontSize: 14 }} value={mood} onChange={e => setMood(e.target.value)}>
                <option value="">Auto-detect from photos</option>
                <option>Golden Hour Memoir</option>
                <option>Monsoon Wanderer</option>
                <option>Tribal Heartland Diary</option>
                <option>Coastal Reverie</option>
                <option>Mountain Silence Log</option>
                <option>Hidden Valley Chronicle</option>
                <option>Desert Wanderer</option>
                <option>City Pulse Diaries</option>
              </select>
            </div>
          </div>

          {error && <div style={{ padding: '12px 18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#ef4444', fontSize: 13, marginBottom: 20 }}>⚠️ {error}</div>}

          <button onClick={generate} disabled={loading || !files.length}
            style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: files.length ? 'linear-gradient(135deg,#f5c682,#e6a940)' : 'rgba(255,255,255,0.1)', color: files.length ? '#1a1008' : 'var(--text-muted)', fontSize: 15, fontWeight: 800, cursor: files.length ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
            {loading ? '✨ Crafting your journal…' : `✨ Generate My Travel Journal${files.length ? ` (${files.length} photo${files.length > 1 ? 's' : ''})` : ''}`}
          </button>
        </>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>✍️</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>Weaving your journey into words…</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Analysing photos · Classifying scenes · Writing your journal</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', animation: `pulse 1.4s ease ${i*0.2}s infinite` }} />)}
          </div>
          <style>{`@keyframes pulse{0%,80%,100%{transform:scale(0.3);opacity:0.3}40%{transform:scale(1);opacity:1}}`}</style>
        </div>
      )}

      {story && !loading && (
        <JournalOutput story={story} previews={previews} destination={destination} onReset={reset} />
      )}
    </div>
  );
}
