const quickReplies = [
  { id: '1', label: 'Ver productos' },
  { id: '2', label: 'Estado de pedido' }
];

interface QuickRepliesProps {
  onSendMessage: (message: string) => void;
}

export function QuickReplies({ onSendMessage }: QuickRepliesProps) {
  const handleClick = (label: string) => {
    onSendMessage(label);
  };

  return (
    <div className="quick-replies">
      {quickReplies.map(reply => (
        <button 
          key={reply.id} 
          className="quick-reply"
          onClick={() => handleClick(reply.label)}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}
