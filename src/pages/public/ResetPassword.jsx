import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import Alert from '../../components/Alert';
import { KeyRound, Lock } from 'lucide-react';

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await resetPassword(id, token, newPassword);
      setMessage('Password successfully reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setLoading(false);
    }
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
            <Lock size={28} fill="currentColor" />
          </div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--secondary)' }}>Reset Password</h1>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Create a new password for your account</p>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
        {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-control"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            disabled={loading}
          >
            <KeyRound size={18} />
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
