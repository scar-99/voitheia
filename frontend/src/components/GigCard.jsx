import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import './GigCard.css';

export default function GigCard({ gig }) {
  const img = gig.images?.[0];
  return (
    <Link to={`/gigs/${gig._id}`}>
      <div className="card hoverable fade-in-scale gig-card-override" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="gig-image-container">
          {img
            ? <img src={img} alt={gig.title} className="gig-image"/>
            : <div className="gig-image-placeholder">No image</div>
          }
        </div>
        <div className="gig-info">
          <div className="gig-freelancer">
            <div className="freelancer-avatar">{gig.freelancer?.name?.[0]}</div>
            <span className="freelancer-name">{gig.freelancer?.name}</span>
          </div>
          <p className="gig-title">
            {gig.title}
          </p>
          <div className="gig-footer">
            <span className="gig-delivery">
              <Clock size={12}/> {gig.deliveryDays}d
            </span>
            <span className="gig-price">From ₹{gig.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
