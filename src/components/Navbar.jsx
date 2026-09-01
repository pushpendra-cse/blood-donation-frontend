import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartHandshake, 
  Droplet, 
  Search, 
  User, 
  FileText, 
  History, 
  PlusCircle, 
  Users, 
  Layers, 
  Boxes, 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <Droplet className="blood-icon" fill="currentColor" size={28} />
          <span>LifeBlood <small style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Portal</small></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          {/* Public Links */}
          {!isAuthenticated && (
            <>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
              <NavLink to="/find-blood" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Search size={16} /> Find Blood
              </NavLink>
              <NavLink to="/become-donor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <HeartHandshake size={16} /> Become a Donor
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About Us</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
            </>
          )}

          {/* Donor Links */}
          {isAuthenticated && user?.role === 'donor' && (
            <>
              <NavLink to="/donor/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink to="/donor/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FileText size={16} /> Blood Requests
              </NavLink>
              <NavLink to="/donor/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <History size={16} /> My Donations
              </NavLink>
              <NavLink to="/donor/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <User size={16} /> Profile
              </NavLink>
            </>
          )}

          {/* Receiver Links */}
          {isAuthenticated && user?.role === 'receiver' && (
            <>
              <NavLink to="/receiver/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink to="/receiver/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Search size={16} /> Search Blood
              </NavLink>
              <NavLink to="/receiver/create-request" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <PlusCircle size={16} /> Request Blood
              </NavLink>
              <NavLink to="/receiver/my-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FileText size={16} /> My Requests
              </NavLink>
            </>
          )}

          {/* Admin Links */}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Users size={16} /> Users
              </NavLink>
              <NavLink to="/admin/donors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <HeartHandshake size={16} /> Donors
              </NavLink>
              <NavLink to="/admin/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FileText size={16} /> Requests
              </NavLink>
              <NavLink to="/admin/donations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={16} /> Donations
              </NavLink>
              <NavLink to="/admin/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Boxes size={16} /> Inventory
              </NavLink>
            </>
          )}
        </nav>

        {/* Auth Actions */}
        <div className="nav-auth-actions">
          {isAuthenticated ? (
            <>
              <div className="user-badge">
                <User size={15} />
                <span>{user?.name?.split(' ')[0]}</span>
                <span className="role-pill">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout">
                <LogOut size={16} />
                <span className="d-none-mobile">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--secondary)',
              cursor: 'pointer',
              padding: '6px'
            }}
            className="mobile-toggle-btn"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {!isAuthenticated ? (
            <>
              <Link to="/" onClick={closeMenu} className="nav-link">Home</Link>
              <Link to="/find-blood" onClick={closeMenu} className="nav-link">Find Blood</Link>
              <Link to="/become-donor" onClick={closeMenu} className="nav-link">Become a Donor</Link>
              <Link to="/about" onClick={closeMenu} className="nav-link">About Us</Link>
              <Link to="/contact" onClick={closeMenu} className="nav-link">Contact</Link>
            </>
          ) : user?.role === 'donor' ? (
            <>
              <Link to="/donor/dashboard" onClick={closeMenu} className="nav-link">Dashboard</Link>
              <Link to="/donor/requests" onClick={closeMenu} className="nav-link">Available Blood Requests</Link>
              <Link to="/donor/history" onClick={closeMenu} className="nav-link">My Donation History</Link>
              <Link to="/donor/profile" onClick={closeMenu} className="nav-link">My Profile</Link>
            </>
          ) : user?.role === 'receiver' ? (
            <>
              <Link to="/receiver/dashboard" onClick={closeMenu} className="nav-link">Dashboard</Link>
              <Link to="/receiver/search" onClick={closeMenu} className="nav-link">Search Blood</Link>
              <Link to="/receiver/create-request" onClick={closeMenu} className="nav-link">Request Blood</Link>
              <Link to="/receiver/my-requests" onClick={closeMenu} className="nav-link">My Requests</Link>
            </>
          ) : (
            <>
              <Link to="/admin/dashboard" onClick={closeMenu} className="nav-link">Admin Dashboard</Link>
              <Link to="/admin/users" onClick={closeMenu} className="nav-link">Manage Users</Link>
              <Link to="/admin/donors" onClick={closeMenu} className="nav-link">Manage Donors</Link>
              <Link to="/admin/requests" onClick={closeMenu} className="nav-link">Manage Requests</Link>
              <Link to="/admin/donations" onClick={closeMenu} className="nav-link">Manage Donations</Link>
              <Link to="/admin/inventory" onClick={closeMenu} className="nav-link">Blood Inventory</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
