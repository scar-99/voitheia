import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';

export default function GigCard({ gig }) {
  const img = gig.images?.[0];
  return (
    <Link to={`/gigs/${gig._id}`}>
      <div className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
        <div style={{ height: 160, background: '#f0f0f8' }}>
          {img
            ? <img src={img} alt={gig.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>No image</div>
          }
        </div>
        <div style={{ padding: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600
            }}>{gig.freelancer?.name?.[0]}</div>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{gig.freelancer?.name}</span>
          </div>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {gig.title}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
              <Clock size={12}/> {gig.deliveryDays}d delivery
            </span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>From ₹{gig.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
