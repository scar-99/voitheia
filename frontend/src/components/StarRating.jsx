import { Star } from 'lucide-react';

export default function StarRating({ value, onChange, size = 20 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={size}
          fill={n <= value ? 'gold' : 'none'}
          color={n <= value ? 'gold' : '#ccc'}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
          onClick={() => onChange?.(n)}
        />
      ))}
    </div>
  );
}
