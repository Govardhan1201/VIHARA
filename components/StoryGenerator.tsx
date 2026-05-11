'use client';
import { useState, useCallback } from 'react';

interface StoryOutput {
  title: string;
  mood: string;
  story: string;
  caption: string;
}

function ReelCaptionGenerator({ destination, storyTitle }: { destination: string; storyTitle: string }) {
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a punchy Instagram Reels / YouTube Shorts caption for a travel video about "${destination || storyTitle}". Requirements: max 15 words, evocative and emotional, end with 5 relevant trending hashtags like #HiddenIndia #TravelIndia etc. Format: [caption text] [hashtags]. Output ONLY the caption, nothing else.`
        }),
      });
      const data = await res.json();
      setCaption(data.reply || '');
    } catch { setCaption('Could not generate caption. Please try again.'); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(caption); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ background: 'rgba(255,100,150,0.05)', border: '1px solid rgba(255,100,150,0.2)', borderRadius: 'var(--r-lg)', padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: caption ? 12 : 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#f472b6', letterSpacing: '0.8px', textTransform: 'uppercase' }}>🎬 Reel Caption AI</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {caption && <button onClick={copy} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 50, border: '1px solid rgba(244,114,182,0.3)', color: '#f472b6', background: 'none', cursor: 'pointer' }}>{copied ? '✅ Copied!' : '📋 Copy'}</button>}
          <button onClick={generate} disabled={loading} style={{ fontSize: 11, padding: '4px 14px', borderRadius: 50, border: '1px solid rgba(244,114,182,0.4)', background: 'rgba(244,114,182,0.1)', color: '#f472b6', cursor: 'pointer', fontWeight: 700 }}>
            {loading ? '⏳ Generating…' : caption ? '🔄 Regenerate' : '✨ Generate Reel Caption'}
          </button>
        </div>
      </div>
      {caption && <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{caption}</p>}
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
  const [copied, setCopied] = useState(false);
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

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }, [handleFiles]);

  const removeImage = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const generate = async () => {
    if (!files.length) { setError('Upload at least one travel photo to begin.'); return; }
    setError(''); setLoading(true); setStory(null);
    try {
      const fd = new FormData();
      
      // Compress images before sending to avoid Vercel 4.5MB payload limit
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedFile = await new Promise<File>((resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 1024;
            let width = img.width;
            let height = img.height;
            if (width > height && width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
              } else {
                resolve(file); // fallback
              }
            }, 'image/jpeg', 0.8);
          };
          img.onerror = () => resolve(file);
        });
        fd.append('images', compressedFile);
      }
      if (destination) fd.append('destination', destination);
      if (mood) fd.append('mood', mood);
      const res = await fetch('/api/story', { method: 'POST', body: fd });
      if (!res.ok) {
        // Handle HTTP errors like 413 Payload Too Large explicitly
        if (res.status === 413) throw new Error('Images are too large. Please try with fewer or smaller photos.');
        if (res.status === 429) throw new Error('Too many requests. Please try again in a minute.');
      }
      
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Server returned an invalid response. Please try again.');
      }
      
      if (data.error) { setError(data.error); return; }
      setStory(data.story);
    } catch (e: any) { setError(e.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const copyCaption = () => {
    if (story?.caption) { navigator.clipboard.writeText(story.caption); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const reset = () => { setFiles([]); setPreviews([]); setStory(null); setError(''); setDestination(''); setMood(''); };

  if (compact) {
    return (
      <a href="/en/story" style={{ display: 'block', textDecoration: 'none' }}>
        <div className="feature-teaser" style={{ background: 'linear-gradient(135deg, rgba(250,196,150,0.07), rgba(50,184,198,0.05))', border: '1px solid var(--border-gold)', borderRadius: 'var(--r-xl)', padding: '36px 32px', cursor: 'pointer', transition: 'all var(--dur) var(--ease)' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>✨</div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--gold)', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>AI Travel Story Generator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>
            Upload your travel photos and let VIHARA AI turn them into a cinematic travel journal — soulful, specific, and yours to keep.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>Turn memories into stories →</div>
        </div>
      </a>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Upload Zone */}
      {!story && (
        <>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('story-file-input')?.click()}
            style={{
              border: `2px dashed ${dragging ? 'var(--gold)' : 'rgba(250,196,150,0.3)'}`,
              borderRadius: 'var(--r-xl)', padding: '52px 32px', textAlign: 'center',
              cursor: 'pointer', transition: 'all var(--dur)',
              background: dragging ? 'rgba(250,196,150,0.05)' : 'rgba(255,255,255,0.02)',
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 16 }}>📷</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Drop your travel photos here
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
              Or click to pick from your device · Up to 6 images · JPG, PNG, WEBP
            </p>
            <div className="btn btn-secondary" style={{ display: 'inline-flex', borderRadius: 50, padding: '10px 24px', fontSize: 13 }}>
              Browse Photos
            </div>
            <input id="story-file-input" type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => handleFiles(Array.from(e.target.files || []))} />
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: 12, marginBottom: 24 }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative', borderRadius: 'var(--r-md)', overflow: 'hidden', aspectRatio: '1', border: '1px solid var(--border-gold)' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <button onClick={e => { e.stopPropagation(); removeImage(i); }} style={{
                    position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Optional fields */}
          <div className="form-grid" style={{ marginBottom: 24 }}>
            <div>
              <label className="field-label">Destination (optional)</label>
              <input className="field-input" placeholder="e.g. Araku, Goa, Hampi…" value={destination} onChange={e => setDestination(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Story Mood (optional)</label>
              <select className="field-select" value={mood} onChange={e => setMood(e.target.value)}>
                <option value="">Auto-detect from photos</option>
                <option value="Golden Hour Memoir">Golden Hour Memoir</option>
                <option value="Monsoon Wanderer">Monsoon Wanderer</option>
                <option value="Tribal Heartland Diary">Tribal Heartland Diary</option>
                <option value="Coastal Reverie">Coastal Reverie</option>
                <option value="Mountain Silence Log">Mountain Silence Log</option>
                <option value="Hidden Valley Chronicle">Hidden Valley Chronicle</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{ padding: '12px 18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--r-sm)', color: '#ef4444', fontSize: 13, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={generate} disabled={loading || !files.length} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 15, borderRadius: 'var(--r-sm)', opacity: !files.length ? 0.5 : 1 }}>
            {loading ? '✨ Crafting your story…' : `✨ Generate My Travel Story${files.length ? ` (${files.length} photo${files.length > 1 ? 's' : ''})` : ''}`}
          </button>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 44, marginBottom: 20, animation: 'float 2s ease-in-out infinite' }}>✍️</div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>
            Weaving your journey into words…
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Finding the right light, the right language, the right moment.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', animation: `pulse 1.4s ease ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes pulse{0%,80%,100%{transform:scale(0.3);opacity:0.3}40%{transform:scale(1);opacity:1}}`}</style>
        </div>
      )}

      {/* Story Output */}
      {story && !loading && (
        <div>
          {/* Mood tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ padding: '5px 14px', borderRadius: 50, background: 'var(--gold-dim)', border: '1px solid var(--border-gold)', color: 'var(--gold)', fontSize: 12, fontWeight: 700, letterSpacing: '0.5px' }}>
              ✨ {story.mood}
            </span>
            <button onClick={reset} className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 14px', borderRadius: 50 }}>
              + New Story
            </button>
          </div>

          {/* Story Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', borderRadius: 'var(--r-xl)', padding: '40px 36px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--teal))' }} />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 900, color: 'var(--gold)', marginBottom: 28, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              {story.title}
            </h2>
            {story.story.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.9, marginBottom: i < story.story.split('\n\n').length - 2 ? 22 : 0 }}>
                {para.trim()}
              </p>
            ))}
          </div>

          {/* Social Caption */}
          <div style={{ background: 'rgba(50,184,198,0.06)', border: '1px solid rgba(50,184,198,0.2)', borderRadius: 'var(--r-lg)', padding: '20px 24px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Social Caption</span>
              <button onClick={copyCaption} className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 12px', borderRadius: 50, borderColor: 'rgba(50,184,198,0.3)', color: 'var(--teal)' }}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
            <p style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.7 }}>{story.caption}</p>
          </div>

          {/* AI Reel Caption Generator */}
          <ReelCaptionGenerator destination={destination} storyTitle={story.title} />

          {/* Preview thumbnails */}
          {previews.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              {previews.map((src, i) => (
                <img key={i} src={src} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-gold)' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
