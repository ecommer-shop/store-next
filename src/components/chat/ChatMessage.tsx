import { useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from '@/lib/chat/types';
import { useFormattedTime } from '@/lib/chat/hooks';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { formatTime } = useFormattedTime();
  const isUser = message.role === 'user';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const links = containerRef.current.querySelectorAll('a');
    const isMobile = window.innerWidth < 768;
    links.forEach(link => {
      if (isMobile) {
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
    });
  }, [message.content]);
  
  return (
    <div className={`message ${message.role === 'assistant' ? 'ai' : 'user'}`}>
      <div className="message-avatar">
        {isUser ? (
          '👤'
        ) : (
          <div style={{ 
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6BB8FF 0%, #9969F8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/tardi.webp"
              alt="Tardígrado"
              style={{ width: '70%', height: '70%', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>
      <div className="message-content">
        <div className="message-bubble">
          {/* Renderizado como texto plano hasta que IA estandarice las respuestas */}
<div 
  ref={containerRef}
  className="message-text" 
  dangerouslySetInnerHTML={{ __html: message.content }} 
/>
        </div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}