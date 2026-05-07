'use client';
import { useEffect, useState } from 'react';

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary-500 pointer-events-none z-[100] transition-transform duration-100 ease-out hidden md:block mix-blend-difference"
        style={{ 
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})`,
        }}
      />
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-primary-500 rounded-full pointer-events-none z-[100] hidden md:block mix-blend-difference"
        style={{ 
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)` 
        }}
      />
    </>
  );
}
