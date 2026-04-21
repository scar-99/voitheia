import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../../api/gigs';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

const CATEGORIES = ['coding','design','writing','tutoring','editing','photography','other'];

export default function AddGig() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', price:'', deliveryDays:'', category:'coding' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

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

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGig({ ...form, price: Number(form.price), deliveryDays: Number(form.deliveryDays), images });
      toast.success('Service listed!');
      navigate('/gigs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.25rem' }}>
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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Publishing…' : 'Publish service'}
          </button>
        </form>
      </div>
    </div>
  );
}
