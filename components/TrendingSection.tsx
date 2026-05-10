'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TrendingItem { name: string; views: number; }

const DEST_EMOJIS: Record<string, string> = {
  'Araku Valley': '🏔️', 'Gandikota Canyon': '⛰️', 'Bheemunipatnam Beach': '🏖️',
  'Papikondalu': '⛰️', 'Qutb Shahi Tombs': '🪦', 'Mallela Theertham Waterfalls': '🤽',
  'Kumbhalgarh Fort': '🌵', 'Chorao Island': '🏝️',
};

export default function TrendingSection() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setTrending(d.trending || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ height:80, borderRadius:'var(--r-md)', background:'var(--surface)', animation:'pulse 1.5s infinite', opacity:0.5 }} />
        ))}
      </div>
    );
  }

  if (!trending.length) {
    return (
      <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:14 }}>
        <div style={{ fontSize:32, marginBottom:12 }}>📊</div>
        <p>No trending data yet — start exploring destinations to see what's popular!</p>
        <Link href="/en/explore" className="btn btn-primary" style={{ marginTop:16, display:'inline-flex', padding:'10px 24px', fontSize:13 }}>
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
      {trending.map((item, i) => (
        <Link key={item.name} href={`/en/explore?dest=${encodeURIComponent(item.name)}`} style={{ textDecoration:'none' }}>
          <div style={{
            padding:'16px', borderRadius:'var(--r-md)', background:'var(--card)',
            border:`1px solid ${i === 0 ? 'rgba(201,150,90,0.3)' : 'var(--border)'}`,
            cursor:'pointer', transition:'all 0.2s', position:'relative', overflow:'hidden',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold-border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--gold-dim)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = i === 0 ? 'rgba(201,150,90,0.3)' : 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--card)'; }}
          >
            {i === 0 && <div style={{ position:'absolute', top:8, right:8, fontSize:9, padding:'2px 6px', borderRadius:20, background:'rgba(201,150,90,0.2)', color:'var(--gold)', fontWeight:700 }}>🏆 #1</div>}
            <div style={{ fontSize:28, marginBottom:8 }}>{DEST_EMOJIS[item.name] || '🌟'}</div>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:4, lineHeight:1.3 }}>{item.name}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>👁 {item.views} view{item.views !== 1 ? 's' : ''} today</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
