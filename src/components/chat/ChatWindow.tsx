'use client';

import { useState, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageType } from './ChatMessage';
import type { ChatMessage } from '@/lib/chat/types';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Detectar tema de la página web (no del sistema)
    if (typeof window !== 'undefined') {
      // Intentar detectar el tema actual de la página
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(currentTheme);

      // Observar cambios en el tema de la página
      const observer = new MutationObserver(() => {
        const newTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        if (newTheme !== theme) {
          setTheme(newTheme);
        }
      });

      observer.observe(htmlElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      return () => observer.disconnect();
    }
  }, [theme]);

  useEffect(() => {
    // Mensaje de bienvenida al abrir
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: '¡Hola! Soy el asistente de Ecommer. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const handleSendMessage = async (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // Mostrar typing indicator
    setIsTyping(true);
    
    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch(process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation SendChatMessage($message: String!, $history: [ChatHistoryInput!]) {
              sendChatMessage(message: $message, history: $history) {
                response
                error
              }
            }
          `,
          variables: {
            message: content,
            history
          }
        })
      });

      const data = await res.json();
      const aiResponse = data?.data?.sendChatMessage?.response;
      const aiError = data?.data?.sendChatMessage?.error;

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || aiError || 'No se pudo obtener respuesta.',
        timestamp: new Date()
      }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Hubo un error al conectar con el asistente. Intenta de nuevo.',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className={`chat-window ${theme}-theme ${isOpen ? 'open' : ''}`}>
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} isTyping={isTyping} onSendMessage={handleSendMessage} />
      <ChatInput onSendMessage={handleSendMessage} />
      <div className="powered-by">Powered by SimetrIA</div>
    </div>
  );
}