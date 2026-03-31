import { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { QuickReplies } from './QuickReplies';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage } from '@/lib/chat/types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage?: (message: string) => void;
}

export function ChatMessages({ messages, isTyping, onSendMessage }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showQuickReplies = messages.length === 1 && messages[0].role === 'assistant';

  return (
    <div className="chat-messages">
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
