import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    isNegotiable: false,
    category: 'other',
    condition: 'good',
    images: []
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, images: [reader.result] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      return;
    }
    if (!form.title || !form.price) {
      toast.error('Title and price are required');
      return;
    }
    if (!user.upiId) {
      toast.error('A UPI ID is mandatory for selling. Please add it in your Dashboard Settings.');
      return;
    }
    try {
      await createProduct({ ...form, price: Number(form.price) });
      toast.success('Product added successfully!');
      navigate('/marketplace');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '12px', minHeight: '100px' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        />
        <div 
          onClick={() => setForm(p => ({ ...p, isNegotiable: !p.isNegotiable }))}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 12, 
            padding: '12px 16px', 
            background: form.isNegotiable ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${form.isNegotiable ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: '8px', cursor: 'pointer', marginBottom: '16px',
            transition: 'all 0.2s ease'
          }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, 
            border: `2px solid ${form.isNegotiable ? 'var(--primary)' : 'var(--muted)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: form.isNegotiable ? 'var(--primary)' : 'transparent',
            transition: 'all 0.2s ease'
          }}>
            {form.isNegotiable && <span style={{ color: '#0f172a', fontSize: 14, fontWeight: 800 }}>✓</span>}
          </div>
          <span style={{ fontWeight: 500, fontSize: 14, color: form.isNegotiable ? '#fff' : 'var(--muted)' }}>
            Price is negotiable
          </span>
        </div>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        >
          <option value="books">Books</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="hostel">Hostel</option>
          <option value="other">Other</option>
        </select>
        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
        >
          <option value="new">New</option>
          <option value="like new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ width: '100%', marginBottom: '12px' }}
        />
        {form.images[0] && (
          <img src={form.images[0]} alt="preview" style={{ width: '100%', maxHeight: '200px', marginBottom: '12px', borderRadius: '4px' }} />
        )}
        <button type="submit" style={{ width: '100%' }}>Add Product</button>
      </form>
    </div>
  );
}
