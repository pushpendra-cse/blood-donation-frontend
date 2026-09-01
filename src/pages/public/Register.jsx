import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import { UserPlus, Droplet, HeartHandshake, ShieldCheck } from 'lucide-react';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('donor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    address: '',
    blood_group: 'O+',
    age: '24',
    gender: 'Male'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedRole = params.get('role');
    if (requestedRole && ['donor', 'receiver'].includes(requestedRole)) {
      setRole(requestedRole);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        role
      };

      const newUser = await register(payload);
      if (newUser.role === 'donor') {
        navigate('/donor/dashboard');
      } else if (newUser.role === 'receiver') {
        navigate('/receiver/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '640px', paddingTop: '32px' }}>
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Droplet color="var(--primary)" fill="var(--primary)" size={24} />
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
            Join the LifeBlood network to donate or request blood in real-time
          </p>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`btn ${role === 'donor' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '12px', justifyContent: 'center' }}
          >
            <HeartHandshake size={18} />
            I want to Donate Blood (Donor)
          </button>
          <button
            type="button"
            onClick={() => setRole('receiver')}
            className={`btn ${role === 'receiver' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '12px', justifyContent: 'center' }}
          >
            <UserPlus size={18} />
            I Need Blood (Receiver)
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                required
                placeholder="e.g. Ramesh Verma"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                required
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                required
                placeholder="e.g. Mumbai, Delhi"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                required
                placeholder="Area, Street, Landmark"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Additional Fields for Donor */}
          {role === 'donor' && (
            <div style={{
              background: 'var(--primary-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              border: '1px solid var(--primary-light)'
            }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>
                🩸 Donor Medical Profile
              </h4>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label required">Blood Group</label>
                  <select
                    name="blood_group"
                    className="form-select"
                    value={formData.blood_group}
                    onChange={handleChange}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label required">Age</label>
                  <input
                    type="number"
                    name="age"
                    min="18"
                    max="65"
                    className="form-control"
                    required
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label required">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            {loading ? 'Creating Account...' : `Register as ${role === 'donor' ? 'Blood Donor' : 'Receiver'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
