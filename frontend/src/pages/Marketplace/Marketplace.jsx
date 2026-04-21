import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/products';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts({ keyword, category })
      .then(r => setProducts(r.data))
      .catch(err => toast.error('Failed to fetch products'))
      .finally(() => setLoading(false));
  }, [keyword, category]);

  return (
    <div className="page">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 24 }}>Marketplace</h1>
          <p className="text-muted">Buy and sell items on campus</p>
        </div>
        <Link to="/sell"><button className="btn-primary">+ List Item</button></Link>
      </div>
      
      <div style={{ margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: '8px', marginRight: '12px' }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px' }}>
          <option value="">All Categories</option>
          <option value="books">Books</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="hostel">Hostel</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading ? <Spinner/> : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>No products found</p>
      ) : (
        <div className="grid-3">
          {products.map(product => <ProductCard key={product._id} product={product}/>)}
        </div>
      )}
    </div>
  );
}
