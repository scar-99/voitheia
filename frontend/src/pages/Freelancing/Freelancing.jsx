import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGigs } from '../../api/gigs';
import GigCard from '../../components/GigCard';
import Spinner from '../../components/Spinner';
import { Search } from 'lucide-react';

const CATEGORIES = ['all','coding','design','writing','tutoring','editing','photography','other'];

export default function Freelancing() {
  const [gigs, setGigs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: '', category: '', sort: 'newest' });

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    params.sort = filters.sort;
    getGigs(params).then(r => setGigs(r.data)).finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="page">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 24 }}>Student Services</h1>
          <p className="text-muted">Hire skills from your campus peers</p>
        </div>
        <Link to="/gigs/add"><button className="btn-primary">+ Offer a service</button></Link>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}/>
          <input placeholder="Search services…" style={{ paddingLeft: 38 }}
            value={filters.keyword} onChange={e => setFilters(p => ({ ...p, keyword: e.target.value }))}/>
        </div>
        <select value={filters.category} style={{ width: 160 }}
          onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <select value={filters.sort} style={{ width: 160 }}
          onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))}>
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>

      {loading ? <Spinner/> : gigs.length === 0
        ? <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>No services found</p>
        : <div className="grid-3">{gigs.map(g => <GigCard key={g._id} gig={g}/>)}</div>
      }
    </div>
  );
}
