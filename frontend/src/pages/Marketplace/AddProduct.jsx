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
    category: 'other',
    condition: 'good',
    images: []
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
