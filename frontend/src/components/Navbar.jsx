import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Briefcase, MessageSquare, User, LogOut, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 1.25rem', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: 'var(--primary)' }}>
          voitheia
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <NavLink to="/marketplace" icon={<ShoppingBag size={16}/>} label="Marketplace" />
          <NavLink to="/gigs"        icon={<Briefcase size={16}/>}    label="Freelancing" />
          {user && <NavLink to="/dashboard"  icon={<MessageSquare size={16}/>} label="Messages" />}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/sell" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: 'var(--primary)' }}>
                <PlusCircle size={16}/> Sell
              </Link>
              <Link to="/dashboard">
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600
                }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
              </Link>
              <button className="btn-outline" onClick={handleLogout}
                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <LogOut size={14}/> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-outline" style={{ padding: '7px 16px' }}>Login</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '7px 16px' }}>Sign up</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--muted)' }}>
      {icon} {label}
    </Link>
  );
}
