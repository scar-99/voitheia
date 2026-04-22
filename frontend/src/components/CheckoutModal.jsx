import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CheckoutModal({ isOpen, onClose, onConfirm, price, user }) {
  const [address, setAddress] = useState(user?.addresses?.[0]?.text || '');
  const [payment, setPayment] = useState('Cash');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address) {
      alert('Please provide a delivery address.');
      return;
    }
    onConfirm(address, payment);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card slide-up" style={{ width: '100%', maxWidth: 450, padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Checkout</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Delivery Address</label>
            {user?.addresses?.length > 0 ? (
              <select value={address} onChange={e => setAddress(e.target.value)} style={{ padding: '10px' }}>
                {user.addresses.map((a, i) => (
                  <option key={i} value={a.text}>{a.label}: {a.text}</option>
                ))}
              </select>
            ) : (
              <div>
                <p className="text-danger" style={{ marginBottom: 6 }}>No saved addresses found.</p>
                <textarea 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Enter your delivery address here..." 
                  rows={3} 
                  required
                />
                <p className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Tip: Save your address permanently in <Link to="/dashboard" style={{color: 'var(--primary)'}}>Settings</Link>.
                </p>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Payment Method</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" value="Cash" checked={payment === 'Cash'} onChange={e => setPayment(e.target.value)} />
                Cash
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" value="UPI" checked={payment === 'UPI'} onChange={e => setPayment(e.target.value)} />
                UPI
              </label>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 8, marginTop: 10 }}>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total to pay:</span>
              <span style={{ color: 'var(--primary)' }}>₹{price}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: '1rem' }}>
            <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirm Order</button>
          </div>

        </form>
      </div>
    </div>
  );
}
