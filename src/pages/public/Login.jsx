import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import { LogIn, Droplet, KeyRound, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      // Redirect based on user role
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'donor') {
        navigate('/donor/dashboard');
      } else if (loggedUser.role === 'receiver') {
        navigate('/receiver/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill credentials helper for college demonstration/viva
  const quickFill = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('');
      setPassword('');
    } else if (demoRole === 'donor') {
      setEmail('donor@blooddonation.com');
      setPassword('donor123');
    } else if (demoRole === 'receiver') {
      setEmail('receiver@blooddonation.com');
      setPassword('receiver123');
    }
    setError('');
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px', paddingTop: '40px' }}>
      <div className="card" style={{ padding: '32px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Droplet size={28} fill="currentColor" />
          </div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--secondary)' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Login to access your blood donation portal</p>
        </div>

        {location.search.includes('expired=true') && (
          <Alert type="warning" message="Your session has expired. Please login again." />
        )}

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        {/* Demo Quick-Fill Buttons for College Viva */}
        <div style={{
          background: 'var(--secondary-subtle)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--secondary)', marginBottom: '8px' }}>
            <Sparkles size={14} color="var(--primary)" /> Demo Test Logins (Click to Autofill):
          </div>
          {/* <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => quickFill('admin')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '4px 8px', background: '#ffffff' }}
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => quickFill('donor')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '4px 8px', background: '#ffffff' }}
            >
              🩸 Donor
            </button>
            <button
              type="button"
              onClick={() => quickFill('receiver')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '4px 8px', background: '#ffffff' }}
            >
              🏥 Receiver
            </button>
          </div> */}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label required" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              className="form-control"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
