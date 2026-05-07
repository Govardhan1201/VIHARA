'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SmoothLoader() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold tracking-widest uppercase text-gradient animate-pulse">Vihara</h2>
    </div>
  );
}
