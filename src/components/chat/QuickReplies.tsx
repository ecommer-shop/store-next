const quickReplies = [
  { id: '1', label: 'Ver productos' },
  { id: '2', label: 'Estado de pedido' }
];

export function QuickReplies() {
  return (
    <div className="quick-replies">
      {quickReplies.map(reply => (
        <button key={reply.id} className="quick-reply">
          {reply.label}
        </button>
      ))}
    </div>
  );
}