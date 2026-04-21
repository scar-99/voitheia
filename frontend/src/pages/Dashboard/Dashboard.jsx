import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders, updateOrderStatus } from '../../api/orders';
import Spinner from '../../components/Spinner';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';
import { Package, Briefcase, User } from 'lucide-react';

const STATUS_BADGE = {
  pending:     'badge-amber',
  accepted:    'badge-purple',
  in_progress: 'badge-purple',
  completed:   'badge-green',
  cancelled:   'badge-red',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab]         = useState('buying');
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyOrders(tab === 'buying' ? 'buyer' : 'seller')
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, [tab]);

  const changeStatus = async (orderId, status) => {
    try {
      const { data } = await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === data._id ? data : o));
      toast.success(`Order marked as ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="page">
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, margin: '0 auto 10px' }}>
              {user?.name?.[0]}
            </div>
            <p style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</p>
            <p className="text-muted">{user?.college}</p>
            <div style={{ marginTop: 8 }}>
              <StarRating value={Math.round(user?.rating || 0)} size={16}/>
              <span className="text-muted" style={{ fontSize: 12 }}>({user?.reviewCount || 0} reviews)</span>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { id: 'buying',  label: 'My purchases',   icon: <Package size={16}/> },
              { id: 'selling', label: 'My sales',        icon: <Briefcase size={16}/> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                  borderRadius: 8, background: tab === t.id ? '#EEEDFE' : 'transparent',
                  color: tab === t.id ? 'var(--primary)' : 'var(--text)',
                  border: 'none', textAlign: 'left', fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: 20 }}>
              {tab === 'buying' ? 'My purchases' : 'My sales'}
            </h2>
          </div>

          {loading ? <Spinner/> : orders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
              No orders yet. <Link to="/marketplace" style={{ color: 'var(--primary)' }}>Browse marketplace →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(order => (
                <div key={order._id} className="card">
                  <div className="flex-between" style={{ marginBottom: 10 }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>
                        {order.product?.title || order.gig?.title || 'Order'}
                      </p>
                      <p className="text-muted">
                        {tab === 'buying' ? `Seller: ${order.seller?.name}` : `Buyer: ${order.buyer?.name}`}
                        {' · '} ₹{order.price}
                      </p>
                    </div>
                    <span className={`badge ${STATUS_BADGE[order.status]}`}>{order.status}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {/* Chat button */}
                    {(() => {
                      const otherId = tab === 'buying' ? order.seller?._id : order.buyer?._id;
                      const chatId  = [user._id, otherId].sort().join('_');
                      return (
                        <Link to={`/chat/${chatId}`}>
                          <button className="btn-outline" style={{ fontSize: 13, padding: '6px 14px' }}>Chat</button>
                        </Link>
                      );
                    })()}

                    {/* Seller actions */}
                    {tab === 'selling' && order.status === 'pending' && (
                      <button className="btn-primary" style={{ fontSize: 13, padding: '6px 14px' }}
                        onClick={() => changeStatus(order._id, 'accepted')}>Accept</button>
                    )}
                    {tab === 'selling' && order.status === 'accepted' && (
                      <button className="btn-primary" style={{ fontSize: 13, padding: '6px 14px' }}
                        onClick={() => changeStatus(order._id, 'in_progress')}>Start work</button>
                    )}

                    {/* Buyer: mark complete */}
                    {tab === 'buying' && order.status === 'in_progress' && (
                      <button className="btn-primary" style={{ fontSize: 13, padding: '6px 14px' }}
                        onClick={() => changeStatus(order._id, 'completed')}>Mark complete</button>
                    )}

                    {/* Cancel */}
                    {['pending','accepted'].includes(order.status) && (
                      <button className="btn-danger" style={{ fontSize: 13, padding: '6px 14px' }}
                        onClick={() => changeStatus(order._id, 'cancelled')}>Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
