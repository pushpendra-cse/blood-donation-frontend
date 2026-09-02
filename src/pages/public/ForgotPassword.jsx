import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../../services/api';
import Alert from '../../components/Alert';
import { Mail, KeyRound, Lock, ShieldCheck } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setMessage('An OTP has been sent to your email!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword);
      setMessage('Password successfully reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. OTP may be invalid or expired.');
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
            {step === 1 ? <KeyRound size={28} fill="currentColor" /> : <ShieldCheck size={28} fill="currentColor" />}
          </div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--secondary)' }}>
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
            {step === 1 
              ? 'Enter your email to receive a secure OTP' 
              : `Enter the 6-digit OTP sent to ${email}`}
          </p>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
        {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px', padding: '12px' }}
              disabled={loading}
            >
              <Mail size={18} />
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndReset}>
            <div className="form-group">
              <label className="form-label required">6-Digit OTP</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  required
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.2rem' }}
                />
              </div>
            </div>

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
              <Lock size={18} />
              {loading ? 'Resetting...' : 'Verify & Reset Password'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn btn-text" 
                onClick={() => setStep(1)}
                style={{ fontSize: '0.9rem' }}
              >
                Use a different email
              </button>
            </div>
          </form>
        )}

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

export default ForgotPassword;
