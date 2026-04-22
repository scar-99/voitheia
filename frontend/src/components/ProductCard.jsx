import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const img = product.images?.[0];
  return (
    <Link to={`/marketplace/${product._id}`}>
      <div className="card hoverable fade-in-scale" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Image */}
        <div style={{ height: 180, background: 'rgba(15, 23, 42, 0.5)', position: 'relative' }}>
          {img
            ? <img src={img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>No image</div>
          }
          <span className="badge badge-gray" style={{ position: 'absolute', top: 8, left: 8 }}>
            {product.condition}
          </span>
          {product.status === 'sold' && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 18
            }}>SOLD</div>
          )}
        </div>
        {/* Info */}
        <div style={{ padding: '0.85rem' }}>
          <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, 
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.title}
          </p>
          <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--primary)' }}>
            ₹{product.price.toLocaleString()}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12}/> {product.seller?.college || 'Campus'}
            </span>
            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={12} fill="gold" color="gold"/>
              {product.seller?.rating || '—'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
