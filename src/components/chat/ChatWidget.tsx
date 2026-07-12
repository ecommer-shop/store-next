'use client';
import { useState, useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
// @ts-ignore - TypeScript no necesita tipos para archivo CSS global
import './chat-widget.css';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Escuchar el evento global para abrir el chat desde cualquier parte (ej: navbar)
  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    const toggleHandler = () => setIsOpen((prev) => !prev);
    
    window.addEventListener('open-simetria-chat', openHandler);
    window.addEventListener('toggle-simetria-chat', toggleHandler);
    
    return () => {
      window.removeEventListener('open-simetria-chat', openHandler);
      window.removeEventListener('toggle-simetria-chat', toggleHandler);
    };
  }, []);

  if (!isHydrated) {
    return null;
  }

  const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;
  
  if (APP_ENV === 'prod') {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <button 
        className={`chat-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir chat"
      >
        <img 
          src="/tardi.webp" 
          alt="Chat" 
          style={{ width: '70%', height: '70%', objectFit: 'contain' }}
        />
      </button>
      {/* Ventana del chat */}
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
