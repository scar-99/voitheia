import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../api/products';
import { createOrder } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then(r => setProduct(r.data))
      .catch(err => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const order = await createOrder({
        type: 'product',
        productId: product._id,
        sellerId: product.seller._id,
        price: product.price
      });
      toast.success('Order placed! Check your dashboard');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '2rem', textAlign: 'center' }}>Product not found</div>;

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
          {product.status === 'available' && (
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleBuy}>
              {user?.name === product.seller.name ? 'Your Listing' : 'Buy Now'}
            </button>
          )}
          {product.status === 'sold' && (
            <div style={{ padding: '10px', background: '#fee', color: '#933', borderRadius: '6px', textAlign: 'center', marginTop: '8px' }}
            >Sold Out</div>
          )}
        </div>
      </div>
    </div>
  );
}
