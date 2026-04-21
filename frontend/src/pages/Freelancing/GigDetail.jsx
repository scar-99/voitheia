import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGig } from '../../api/gigs';
import { createOrder } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function GigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGig(id)
      .then(r => setGig(r.data))
      .catch(err => toast.error('Gig not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await createOrder({
        type: 'gig',
        gigId: gig._id,
        sellerId: gig.freelancer._id,
        price: gig.price
      });
      toast.success('Order placed! Check your dashboard');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!gig) return <div style={{ padding: '2rem', textAlign: 'center' }}>Gig not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1>{gig.title}</h1>
      {gig.images && gig.images[0] && (
        <img src={gig.images[0]} alt={gig.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <p><strong>Price:</strong> ₹{gig.price}</p>
          <p><strong>Category:</strong> {gig.category}</p>
          <p><strong>Delivery Days:</strong> {gig.deliveryDays} days</p>
          <p><strong>Description:</strong></p>
          <p>{gig.description}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h3>{gig.freelancer.name}</h3>
          <p>Rating: {gig.freelancer.rating} ⭐</p>
          <p>College: {gig.freelancer.college}</p>
          {gig.isActive && (
            <button className="btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleOrder}>
              Place Order
            </button>
          )}
          {!gig.isActive && (
            <div style={{ padding: '10px', background: '#fee', color: '#933', borderRadius: '6px', textAlign: 'center', marginTop: '8px' }}
            >Not Available</div>
          )}
        </div>
      </div>
    </div>
  );
}
