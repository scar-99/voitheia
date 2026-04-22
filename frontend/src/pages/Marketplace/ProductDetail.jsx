import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, deleteProduct } from '../../api/products';
import { createOrder } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import CheckoutModal from '../../components/CheckoutModal';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(r => setProduct(r.data))
      .catch(err => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleConfirmOrder = async (deliveryAddress, paymentMethod) => {
    try {
      await createOrder({
        type: 'product',
        productId: product._id,
        sellerId: product.seller._id,
        price: product.price,
        deliveryAddress,
        paymentMethod
      });
      toast.success('Order placed! Check your dashboard');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteProduct(id);
      toast.success('Listing deleted successfully');
      navigate('/marketplace');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '2rem', textAlign: 'center' }}>Product not found</div>;

  const isOwner = user?.name === product.seller.name;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1>{product.title}</h1>
      {product.images && product.images[0] && (
        <img src={product.images[0]} alt={product.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Condition:</strong> {product.condition}</p>
          <p><strong>Description:</strong></p>
          <p>{product.description}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h3>{product.seller.name}</h3>
          <p>Rating: {product.seller.rating} ⭐</p>
          <p>College: {product.seller.college}</p>
          {isOwner ? (
            <>
              <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem' }}>Your Listing</p>
              <button 
                className="btn-danger" 
                style={{ width: '100%', background: '#ff4444', color: '#fff', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                onClick={handleDelete}
              >
                Delete Listing
              </button>
            </>
          ) : product.status === 'available' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <button className="btn-primary" style={{ width: '100%' }} onClick={handleBuyClick}>
                Buy Now
              </button>
              {product.isNegotiable && (
                <button className="btn-outline" style={{ width: '100%' }} onClick={() => {
                  if (!user) return navigate('/login');
                  navigate('/chat/' + [user._id, product.seller._id].sort().join('_'));
                }}>
                  Negotiate price
                </button>
              )}
            </div>
          )}
          {product.status === 'sold' && (
            <div style={{ padding: '10px', background: '#fee', color: '#933', borderRadius: '6px', textAlign: 'center', marginTop: '8px' }}>Sold Out</div>
          )}
        </div>
      </div>
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setCheckoutOpen(false)} 
        onConfirm={handleConfirmOrder} 
        price={product.price} 
        user={user} 
      />
    </div>
  );
}
