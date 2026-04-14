import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  // Read from local storage (simplified auth state)
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login'; // hard reload to clear any memory state
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/feed" className="nav-brand">
          <LayoutDashboard size={24} color="var(--accent)" />
          <span>SocialSpace</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to={`/profile/${user.username}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>
                Hello, {user.username}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" title="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
