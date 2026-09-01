import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import { User, Save, Droplet, MapPin, Phone, Calendar, Heart } from 'lucide-react';

const DonorProfile = () => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    blood_group: 'O+',
    age: 24,
    gender: 'Male',
    last_donation_date: '',
    availability: 'Available'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/donors/profile');
        if (res.data.success && res.data.donor) {
          const d = res.data.donor;
          setFormData({
            name: d.name || '',
            phone: d.phone || '',
            city: d.city || '',
            address: d.address || '',
            blood_group: d.blood_group || 'O+',
            age: d.age || 24,
            gender: d.gender || 'Male',
            last_donation_date: d.last_donation_date ? d.last_donation_date.split('T')[0] : '',
            availability: d.availability || 'Available'
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setAlert({ type: 'danger', message: 'Failed to load profile details.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', message: '' });

    try {
      const res = await api.put('/donors/profile', formData);
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Your donor profile has been updated successfully!' });
        updateUser({ name: formData.name, phone: formData.phone, city: formData.city, address: formData.address });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '2rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
        <p style={{ marginTop: '12px' }}>Loading Donor Profile...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <User color="var(--primary)" size={28} />
            Donor Profile Settings
          </h1>
          <p className="page-subtitle">
            Update your personal contact details, blood type, and real-time availability.
          </p>
        </div>
        <StatusBadge status={formData.availability} type="availability" />
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Medical Information */}
          <div style={{
            background: 'var(--primary-subtle)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            border: '1px solid var(--primary-light)'
          }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplet size={18} /> Medical & Blood Details
            </h3>

            <div className="form-row">
              <div className="form-group">
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

              <div className="form-group">
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

              <div className="form-group">
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

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Last Donation Date</label>
                <input
                  type="date"
                  name="last_donation_date"
                  className="form-control"
                  value={formData.last_donation_date}
                  onChange={handleChange}
                />
                <small className="form-hint">Leave blank if this is your first donation</small>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label required">Current Availability</label>
                <select
                  name="availability"
                  className="form-select"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="Available">Available (Ready to donate)</option>
                  <option value="Not Available">Not Available (Temporarily paused)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personal & Contact Information */}
          <h3 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '16px' }}>
            Personal & Contact Information
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                required
                value={formData.name}
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
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Full Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ width: '100%', padding: '12px' }}
            >
              <Save size={18} />
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorProfile;
