import type { ChatMessage as ChatMessageType } from '@/lib/chat/types';
import { useFormattedTime } from '@/lib/chat/hooks';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { formatTime } = useFormattedTime();
  const isUser = message.role === 'user';

  // TEMPORALMENTE DESACTIVADO: El renderizado HTML está desactivado hasta que
  // el equipo de IA estandarice las respuestas con URLs de productos.
  // Cuando esté listo, descomentar la función createMarkup y usar dangerouslySetInnerHTML.
  //
  // const createMarkup = (html: string) => {
  //   if (!html) return { __html: '' };
  //   let sanitized = html;
  //   sanitized = sanitized.replace(/<a\s+(?!.*?(href=|target=|rel=))[^>]*>/gi, '');
  //   sanitized = sanitized.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  //   sanitized = sanitized.replace(/(?<!<[^>]*)\*([^*]+)\*(?![^<]*>)/g, '<strong>$1</strong>');
  //   sanitized = sanitized.replace(/\n/g, '<br>');
  //   return { __html: sanitized };
  // };

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
          <div className="message-text">{message.content}</div>
        </div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}