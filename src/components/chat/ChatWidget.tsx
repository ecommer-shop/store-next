'use client';
import { useState, useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
import './chat-widget.css';

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Solo mostrar en entorno dev
  if (APP_ENV !== 'dev') {
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