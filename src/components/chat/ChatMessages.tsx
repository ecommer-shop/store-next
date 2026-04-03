import { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { QuickReplies } from './QuickReplies';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage } from '@/lib/chat/types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage?: (message: string) => void;
  shouldScroll?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ messages, isTyping, onSendMessage, shouldScroll, containerRef }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo hacer scroll automático si shouldScroll es true (cuando el usuario envía mensaje)
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldScroll]);

  const showQuickReplies = messages.length === 1 && messages[0].role === 'assistant';

  return (
    <div className="chat-messages" ref={containerRef || null}>
      {messages.map((message, index) => (
        <div key={message.id}>
          <ChatMessageComponent message={message} />
          {/* Quick replies solo después del primer mensaje del bot */}
          {index === 0 && showQuickReplies && onSendMessage && <QuickReplies onSendMessage={onSendMessage} />}
        </div>
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
