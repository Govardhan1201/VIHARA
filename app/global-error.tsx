'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <html>
      <body style={{ margin: 0, background: '#080C0C', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '48px 32px', maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>⚠️</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 900, color: '#C9965A', marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            An unexpected error occurred. Our team has been notified. Please try again.
          </p>
          <button onClick={reset} style={{ padding: '12px 32px', borderRadius: 50, background: 'linear-gradient(135deg,#C9965A,#e8b87a)', color: '#1a0f00', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
