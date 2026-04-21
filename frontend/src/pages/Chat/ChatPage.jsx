import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChatHistory } from '../../api/messages';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const { chatId }  = useParams();
  const { user }    = useAuth();
  const socketRef   = useSocket();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    getChatHistory(chatId).then(r => setMsgs(r.data));
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('joinRoom', chatId);
    socket.on('message', (msg) => setMsgs(p => [...p, msg]));
    return () => socket.off('message');
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = () => {
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit('sendMessage', { chatId, senderId: user._id, text });
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', maxWidth: 700, margin: '0 auto', padding: '1rem 1.25rem' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12 }}>
        {msgs.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '3rem' }}>No messages yet. Say hi!</p>
        )}
        {msgs.map((m, i) => {
          const mine = m.sender?._id === user._id || m.sender === user._id;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
              <div style={{
                background: mine ? 'var(--primary)' : '#fff',
                color: mine ? '#fff' : 'var(--text)',
                border: mine ? 'none' : '1px solid var(--border)',
                padding: '10px 16px', borderRadius: 18,
                maxWidth: '65%', fontSize: 14, lineHeight: 1.5
              }}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      <div style={{ display: 'flex', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message…" style={{ flex: 1 }}/>
        <button className="btn-primary" onClick={send}
          style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Send size={16}/> Send
        </button>
      </div>
    </div>
  );
}
