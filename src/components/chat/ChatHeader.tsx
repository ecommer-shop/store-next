interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="chat-header">
      <div className="chat-avatar">
        <img 
          src="/tardi.webp" 
          alt="Tardígrado" 
          style={{ width: '70%', height: '70%', objectFit: 'contain' }}
        />
      </div>
      <div className="chat-info">
        <div className="chat-title">Chat Ecommer: SimetrIA</div>
        <div className="chat-subtitle">
          <span className="status-dot"></span>
          En línea
        </div>
      </div>
      <button className="chat-close" onClick={onClose} aria-label="Cerrar chat">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}