import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/',             icon: '◈',  label: 'Dashboard'    },
  { path: '/books',        icon: '📚', label: 'Books'        },
  { path: '/members',      icon: '👥', label: 'Members'      },
  { path: '/transactions', icon: '↕️', label: 'Transactions' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <span className="brand-icon">📖</span>
        <div>
          <div className="brand-name">Grantha</div>
          <div className="brand-sub">Library System</div>
        </div>
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <div className="sidebar-meta">
          <span className="dot dot-green" />
          <span>System Active</span>
        </div>
      </div>
    </aside>
  );
}
