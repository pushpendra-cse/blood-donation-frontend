import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Alert from '../../components/Alert';
import { PlusCircle, Hospital, Droplet, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    blood_group: 'O+',
    units_required: 1,
    hospital_name: '',
    hospital_address: '',
    city: '',
    reason: '',
    urgency: 'Normal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/requests', formData);
      if (res.data.success) {
        navigate('/receiver/my-requests?created=true');
      }
    } catch (err) {
      console.error('Error creating request:', err);
      setError(err.response?.data?.message || 'Failed to submit blood request. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <PlusCircle color="var(--primary)" size={28} />
            Create Blood Request
          </h1>
          <p className="page-subtitle">
            Submit an official request to notify matching donors and reserve blood inventory units.
          </p>
        </div>
        <Link to="/receiver/my-requests" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} /> Back to My Requests
        </Link>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Blood & Urgency Details */}
          <div style={{
            background: formData.urgency === 'Emergency' ? 'var(--danger-bg)' : formData.urgency === 'Urgent' ? 'var(--warning-bg)' : 'var(--secondary-subtle)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            border: formData.urgency === 'Emergency' ? '1px solid var(--danger-border)' : '1px solid var(--border-color)',
            transition: 'var(--transition)'
          }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplet color="var(--primary)" size={18} /> Blood Requirement Specifications
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Blood Group Needed</label>
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
                <label className="form-label required">Units Required (Bags)</label>
                <input
                  type="number"
                  name="units_required"
                  min="1"
                  max="20"
                  className="form-control"
                  required
                  value={formData.units_required}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Urgency Level</label>
                <select
                  name="urgency"
                  className="form-select"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  <option value="Normal">Normal (Within 24–48 hours)</option>
                  <option value="Urgent">Urgent (Within 6–12 hours)</option>
                  <option value="Emergency">🚨 Emergency (Immediate / ICU)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <h3 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hospital size={18} /> Hospital & Location Details
          </h3>

          <div className="form-group">
            <label className="form-label required">Hospital / Clinic Name</label>
            <input
              type="text"
              name="hospital_name"
              className="form-control"
              required
              placeholder="e.g. Lilavati Hospital & Research Centre"
              value={formData.hospital_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                required
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Hospital Full Address</label>
              <input
                type="text"
                name="hospital_address"
                className="form-control"
                required
                placeholder="Street address, landmark, ward number"
                value={formData.hospital_address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Medical Reason / Notes</label>
            <textarea
              name="reason"
              className="form-control"
              rows="3"
              placeholder="e.g. Bypass surgery scheduled for patient, accident trauma, anemia treatment..."
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}
          >
            <PlusCircle size={18} />
            {loading ? 'Submitting Request...' : 'Submit Blood Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
