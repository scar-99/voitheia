import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyChats } from '../../api/messages';
import Spinner from '../../components/Spinner';

export default function ChatInbox() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyChats()
      .then(r => setChats(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page fade-in-scale" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <h1 style={{ fontWeight: 700, fontSize: 24, marginBottom: '1.5rem' }}>Messages</h1>
      
      {loading ? <Spinner /> : chats.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          No conversations yet. Go to the Marketplace or Freelancing tab to start a chat!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {chats.map((chat) => (
            <Link key={chat._id} to={`/chat/${chat._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card hoverable" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--primary)', color: '#0f172a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, flexShrink: 0
                }}>
                  {chat.otherUser?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{chat.otherUser?.name || 'Unknown User'}</h3>
                  <p className="text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>
                    {chat.lastMessage?.text}
                  </p>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                  {new Date(chat.lastMessage?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
