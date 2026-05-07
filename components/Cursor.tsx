'use client';
import { useEffect, useState } from 'react';

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setHov((e.target as HTMLElement)?.closest('a,button,[role=button]') !== null);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999,
        width: hov ? 40 : 28, height: hov ? 40 : 28,
        border: '2px solid rgba(250,196,150,0.7)',
        borderRadius: '50%', mixBlendMode: 'difference',
        transform: `translate(${pos.x - (hov?20:14)}px, ${pos.y - (hov?20:14)}px)`,
        transition: 'width 0.2s, height 0.2s, transform 0.08s linear',
      }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999,
        width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%',
        transform: `translate(${pos.x - 3}px, ${pos.y - 3}px)`,
        transition: 'transform 0.04s linear',
      }} />
    </>
  );
}
