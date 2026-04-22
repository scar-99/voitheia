import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders, updateOrderStatus, addReview } from '../../api/orders';
import { updateProfile } from '../../api/auth';
import Spinner from '../../components/Spinner';
import StarRating from '../../components/StarRating';
import ReviewModal from '../../components/ReviewModal';
import toast from 'react-hot-toast';
import { Package, Briefcase, User, Settings } from 'lucide-react';

const STATUS_BADGE = {
  pending:     'badge-amber',
  accepted:    'badge-purple',
  in_progress: 'badge-purple',
  completed:   'badge-green',
  cancelled:   'badge-red',
};

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [tab, setTab]         = useState('buying');
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState(null);

  // Settings State
  const [phone, setPhone] = useState(user?.phone || '');
  const [upiId, setUpiId] = useState(user?.upiId || '');
  const [addressText, setAddressText] = useState(user?.addresses?.[0]?.text || '');

  useEffect(() => {
    if (tab === 'settings') {
      setLoading(false);
      return;
    }
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

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const addresses = [{ label: 'Home', text: addressText, isDefault: true }];
      const res = await updateProfile({ phone, upiId, addresses });
      setUser(res.data);
      toast.success('Settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  const handleReviewSubmit = async (rating, comment) => {
    if (!reviewOrder) return;
    const revieweeId = tab === 'buying' ? reviewOrder.seller._id : reviewOrder.buyer._id;
    try {
      await addReview({ orderId: reviewOrder._id, revieweeId, rating, comment });
      toast.success('Review submitted successfully!');
      setReviewOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="page fade-in-scale">
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)',
              color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, margin: '0 auto 10px', boxShadow: '0 0 15px var(--primary-glow)' }}>
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
              { id: 'settings', label: 'Settings',       icon: <Settings size={16}/> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                  borderRadius: 8, background: tab === t.id ? 'rgba(0,240,255,0.1)' : 'transparent',
                  color: tab === t.id ? 'var(--primary)' : 'var(--text)',
                  border: 'none', textAlign: 'left', fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer',
                  transition: 'all 0.2s' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: 20 }}>
              {tab === 'buying' ? 'My purchases' : tab === 'selling' ? 'My sales' : 'Settings'}
            </h2>
          </div>

          {tab === 'settings' ? (
            <div className="card slide-up">
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Phone Number</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +91 9876543210" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>UPI ID (Mandatory for sellers)</label>
                  <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="e.g. name@okhdfcbank" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Default Delivery Address</label>
                  <textarea value={addressText} onChange={e => setAddressText(e.target.value)} placeholder="Room 101, Boys Hostel C..." rows={3}></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Settings</button>
              </form>
            </div>
          ) : (
            <>
              {loading ? <Spinner/> : orders.length === 0 ? (
                <div className="card slide-up" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                  No orders yet. <Link to="/marketplace" style={{ color: 'var(--primary)' }}>Browse marketplace →</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map((order, i) => {
                    const counterparty = tab === 'buying' ? order.seller : order.buyer;
                    return (
                      <div key={order._id} className="card slide-up" style={{ animationDelay: `${i*0.05}s` }}>
                        <div className="flex-between" style={{ marginBottom: 10 }}>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 16 }}>
                              {order.product?.title || order.gig?.title || 'Order'}
                            </p>
                            <p className="text-muted" style={{ marginTop: 4 }}>
                              {tab === 'buying' ? `Seller: ${counterparty?.name}` : `Buyer: ${counterparty?.name}`}
                              {' · '} <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{order.price}</span>
                            </p>
                          </div>
                          <span className={`badge ${STATUS_BADGE[order.status]}`}>{order.status}</span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div>
                              <p className="text-muted" style={{ marginBottom: 2 }}>Contact Info</p>
                              <p>📧 {counterparty?.email || 'N/A'}</p>
                              <p>📞 {counterparty?.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted" style={{ marginBottom: 2 }}>Order Details</p>
                              <p>📍 {order.deliveryAddress || 'No address'}</p>
                              <p>💳 {order.paymentMethod || 'N/A'}</p>
                            </div>
                          </div>
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

                          {/* Review */}
                          {order.status === 'completed' && (
                            <button className="btn-outline" style={{ fontSize: 13, padding: '6px 14px', borderColor: '#ffc107', color: '#ffc107' }}
                              onClick={() => setReviewOrder(order)}>⭐ Leave Review</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ReviewModal 
        isOpen={!!reviewOrder} 
        onClose={() => setReviewOrder(null)} 
        onSubmit={handleReviewSubmit} 
      />
    </div>
  );
}
