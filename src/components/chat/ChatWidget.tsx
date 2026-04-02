'use client';

import { useState, useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
import './chat-widget.css';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Verificar el entorno solo en el cliente para evitar errores de hidratación
  useEffect(() => {
    // Solo renderizar el chat si estamos en entorno de desarrollo
    if (process.env.NEXT_PUBLIC_APP_ENV === 'dev') {
      setShouldRender(true);
    }
  }, []);

  // Si no estamos en desarrollo, no renderizar nada
  if (!shouldRender) {
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
