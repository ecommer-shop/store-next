'use client';

import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import './chat-widget.css';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

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
