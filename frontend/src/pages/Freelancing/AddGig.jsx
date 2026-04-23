import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../../api/gigs';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Upload, PlusCircle, Trash2 } from 'lucide-react';

const CATEGORIES = ['coding','design','writing','tutoring','editing','photography','other'];

export default function AddGig() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', price:'', isNegotiable: false, deliveryDays:'', category:'coding' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImages = (e) => {
    Array.from(e.target.files).slice(0, 3).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(p => [...p, reader.result]);
        setPreviews(p => [...p, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addPortfolioItem = () => {
    if (portfolio.length >= 4) return toast.error('Max 4 portfolio items');
    setPortfolio(p => [...p, { title: '', description: '', imageUrl: '', preview: '' }]);
  };

  const removePortfolioItem = (idx) => {
    setPortfolio(p => p.filter((_, i) => i !== idx));
  };

  const updatePortfolioField = (idx, field, value) => {
    setPortfolio(p => p.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handlePortfolioImage = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPortfolio(p => p.map((item, i) =>
        i === idx ? { ...item, imageUrl: reader.result, preview: reader.result } : item
      ));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.upiId) {
      toast.error('A UPI ID is mandatory for freelancing. Please add it in your Dashboard Settings.');
      return;
    }
    setLoading(true);
    try {
      const portfolioPayload = portfolio.map(({ title, description, imageUrl }) => ({ title, description, imageUrl }));
      await createGig({ ...form, price: Number(form.price), deliveryDays: Number(form.deliveryDays), images, portfolio: portfolioPayload });
      toast.success('Service listed!');
      navigate('/gigs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1.25rem' }}>
      <h1 style={{ fontWeight: 700, fontSize: 22, marginBottom: '1.5rem' }}>Offer a service</h1>
      <div className="card">
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Service title *</label>
            <input name="title" value={form.title} onChange={handle} required
              placeholder="e.g. I will build your React landing page"/>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Description *</label>
            <textarea name="description" value={form.description} onChange={handle} rows={4} required
              placeholder="What do you offer? What's included? Your experience?" style={{ resize: 'vertical' }}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Price (₹) *</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handle} required placeholder="299"/>
              <div
                onClick={() => setForm(p => ({ ...p, isNegotiable: !p.isNegotiable }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', marginTop: 8,
                  background: form.isNegotiable ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${form.isNegotiable ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease'
                }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4,
                  border: `2px solid ${form.isNegotiable ? 'var(--primary)' : 'var(--muted)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: form.isNegotiable ? 'var(--primary)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                  {form.isNegotiable && <span style={{ color: '#0f172a', fontSize: 12, fontWeight: 800 }}>✓</span>}
                </div>
                <span style={{ fontWeight: 500, fontSize: 13, color: form.isNegotiable ? '#fff' : 'var(--muted)' }}>
                  Negotiable
                </span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Delivery (days) *</label>
              <input name="deliveryDays" type="number" min="1" value={form.deliveryDays} onChange={handle} required placeholder="3"/>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Category</label>
              <select name="category" value={form.category} onChange={handle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Cover Images */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Cover images (max 3)</label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              border: '2px dashed var(--border)', borderRadius: 10, padding: '1.5rem',
              cursor: 'pointer', color: 'var(--muted)', fontSize: 14 }}>
              <Upload size={18}/> Upload images
              <input type="file" accept="image/*" multiple hidden onChange={handleImages}/>
            </label>
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {previews.map((src, i) => (
                  <img key={i} src={src} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}/>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio Section */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>Portfolio / Previous Works</p>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  Showcase up to 4 past projects to build trust with customers
                </p>
              </div>
              <button type="button" onClick={addPortfolioItem}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                  background: 'rgba(0,240,255,0.08)', border: '1px solid var(--primary)',
                  borderRadius: 8, color: 'var(--primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                <PlusCircle size={15}/> Add Work
              </button>
            </div>

            {portfolio.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', border: '2px dashed var(--border)',
                borderRadius: 10, color: 'var(--muted)', fontSize: 13 }}>
                No portfolio items yet. Click "Add Work" to showcase your previous projects.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {portfolio.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '1rem', position: 'relative' }}>

                  {/* Remove button */}
                  <button type="button" onClick={() => removePortfolioItem(idx)}
                    style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '4px 8px',
                      color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <Trash2 size={12}/> Remove
                  </button>

                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 10 }}>
                    Work #{idx + 1}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: 12, display: 'block', marginBottom: 4, color: 'var(--muted)' }}>Project Title</label>
                      <input
                        value={item.title}
                        onChange={e => updatePortfolioField(idx, 'title', e.target.value)}
                        placeholder="e.g. E-commerce website for XYZ"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, display: 'block', marginBottom: 4, color: 'var(--muted)' }}>Project Image</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
                        border: '1px dashed var(--border)', borderRadius: 10, cursor: 'pointer',
                        color: 'var(--muted)', fontSize: 13 }}>
                        <Upload size={14}/>
                        {item.preview ? 'Change image' : 'Upload image'}
                        <input type="file" accept="image/*" hidden onChange={e => handlePortfolioImage(idx, e)}/>
                      </label>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ fontSize: 12, display: 'block', marginBottom: 4, color: 'var(--muted)' }}>Brief Description</label>
                    <textarea
                      value={item.description}
                      onChange={e => updatePortfolioField(idx, 'description', e.target.value)}
                      placeholder="What was this project about? What did you build?"
                      rows={2} style={{ resize: 'vertical' }}
                    />
                  </div>

                  {item.preview && (
                    <img src={item.preview} alt="preview"
                      style={{ marginTop: 10, width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8 }}/>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Publishing…' : 'Publish service'}
          </button>
        </form>
      </div>
    </div>
  );
}
