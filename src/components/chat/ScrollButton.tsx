'use client';

import { useState, useEffect } from 'react';

interface ScrollButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function ScrollButton({ targetRef }: ScrollButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = targetRef.current;
    if (!container) return;

    const handleScroll = () => {
      // El botón se muestra cuando el usuario está scrolleado hacia arriba
      // y hay contenido abajo (más de 100px desde el fondo)
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Mostrar botón solo si hay scroll hacia arriba y no está cerca del fondo
      setIsVisible(scrollTop > 50 && !isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [targetRef]);

  const scrollToBottom = () => {
    const container = targetRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      className="scroll-button"
      onClick={scrollToBottom}
      aria-label="Ir al final del chat"
      title="Ir al final"
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </button>
  );
}