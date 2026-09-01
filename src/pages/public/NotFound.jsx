import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '16px' }}>
        <Droplet size={64} style={{ display: 'inline-block', animation: 'pulse-slow 2s infinite' }} />
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--secondary)' }}>404 - Page Not Found</h1>
      <p style={{ maxWidth: '480px', margin: '0 auto 28px', color: 'var(--text-muted)' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Return Home
        </Link>
        <Link to="/find-blood" className="btn btn-outline">
          <Search size={18} /> Search Blood
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
