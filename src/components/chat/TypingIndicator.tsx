export function TypingIndicator() {
  return (
    <div className="message ai">
      <div className="message-avatar">
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
      </div>
      <div className="typing-indicator">
        <div className="typing-bubble">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
}