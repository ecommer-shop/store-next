import type { ChatMessage as ChatMessageType } from '@/lib/chat/types';
import { useFormattedTime } from '@/lib/chat/hooks';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { formatTime } = useFormattedTime();
  const isUser = message.role === 'user';

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
          <div className="message-text">{message.content}</div>
        </div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}