import React, { useState } from 'react';

export default function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(rating, comment);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card slide-up" style={{ width: '100%', maxWidth: 450, padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Leave a Review</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <p style={{ marginBottom: 10, fontWeight: 600 }}>Rate your experience</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  onClick={() => setRating(star)}
                  style={{ 
                    cursor: 'pointer', 
                    fontSize: 32, 
                    color: star <= rating ? '#ffc107' : 'var(--border)',
                    transition: 'color 0.2s'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Comment (optional)</label>
            <textarea 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              placeholder="How was the product/service?" 
              rows={3} 
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: '1rem' }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Submit Review</button>
          </div>

        </form>
      </div>
    </div>
  );
}
