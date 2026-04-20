'use client';
import { useState, useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
// @ts-ignore - TypeScript no necesita tipos para archivo CSS global
import './chat-widget.css';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ Esperar hidratación completa del cliente antes de evaluar entorno
  // Esto soluciona el bug del parpadeo y desaparición
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Solo evaluar la condición DESPUES de estar hidratado en el cliente
  if (!isHydrated) {
    return null;
  }

  const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;
  
  // Mostrar chat en dev y stage, ocultar solo en producción
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
