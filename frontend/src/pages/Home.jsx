import { Link } from 'react-router-dom';
import { ShoppingBag, Briefcase, Shield, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #7F77DD 0%, #534AB7 100%)', color: '#fff', padding: '5rem 1.25rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>voitheia</h1>
        <p style={{ fontSize: 18, opacity: 0.9, marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
          Your campus marketplace and freelance hub — buy, sell, and hire within your college community.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/marketplace"><button style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 15 }}>Browse marketplace</button></Link>
          <Link to="/gigs"><button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, padding: '12px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 15 }}>Find services</button></Link>
        </div>
      </div>

      {/* Features */}
      <div className="page" style={{ textAlign: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: '2rem' }}>Everything your campus needs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: <ShoppingBag size={28} color="var(--primary)"/>, title: 'Second-hand marketplace', desc: 'Buy and sell books, electronics, and hostel essentials at fair prices.' },
            { icon: <Briefcase  size={28} color="var(--primary)"/>, title: 'Student freelancing',    desc: 'Hire peers for coding, design, tutoring, and more. Pay what fits your budget.' },
            { icon: <MessageSquare size={28} color="var(--primary)"/>, title: 'Direct chat',         desc: 'Connect directly with sellers and freelancers — no middlemen.' },
            { icon: <Shield     size={28} color="var(--primary)"/>, title: 'Trusted reviews',        desc: 'Build trust through verified campus ratings and reviews.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div style={{ marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
              <p className="text-muted" style={{ lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
