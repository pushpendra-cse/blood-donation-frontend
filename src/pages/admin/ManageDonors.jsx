import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import { HeartHandshake, Search, Phone, Mail, MapPin, Calendar, Droplet } from 'lucide-react';

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);
  const [bloodGroup, setBloodGroup] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchDonors = async () => {
    try {
      const params = {};
      if (bloodGroup !== 'All') params.blood_group = bloodGroup;
      if (availability !== 'All') params.availability = availability;
      if (city.trim() !== '') params.city = city.trim();

      const res = await api.get('/admin/donors', { params });
      if (res.data.success) {
        setDonors(res.data.donors || []);
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
      setAlert({ type: 'danger', message: 'Failed to load donors directory.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, availability]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <HeartHandshake color="var(--primary)" size={28} />
            Manage Donors Registry
          </h1>
          <p className="page-subtitle">
            Complete database of voluntary blood donors, medical profile, and donation histories.
          </p>
        </div>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {/* Filter Row */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 120px',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Blood Group</label>
              <select
                className="form-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="All">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Availability</label>
              <select
                className="form-select"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available Only</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Filter by city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '45px' }} disabled={loading}>
              <Search size={16} /> Filter
            </button>
          </div>
        </form>
      </div>

      {/* Donors Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Registered Donors ({donors.length})</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '1.8rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
            <p style={{ marginTop: '8px' }}>Loading donors database...</p>
          </div>
        ) : donors.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No donors found matching the filters.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Donor Name</th>
                  <th>Blood Group</th>
                  <th>Age / Gender</th>
                  <th>Phone & Email</th>
                  <th>City / Address</th>
                  <th>Last Donated</th>
                  <th>Total Donations</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d) => (
                  <tr key={d.donor_id}>
                    <td><strong>{d.name}</strong></td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {d.blood_group}
                      </span>
                    </td>
                    <td>{d.age} Yrs • {d.gender}</td>
                    <td>
                      <div>
                        <a href={`tel:${d.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={13} /> {d.phone}
                        </a>
                      </div>
                      <small style={{ color: 'var(--text-muted)' }}>{d.email}</small>
                    </td>
                    <td>
                      <div>{d.city}</div>
                      <small style={{ color: 'var(--text-muted)' }}>{d.address}</small>
                    </td>
                    <td>
                      {d.last_donation_date ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                          <Calendar size={13} color="var(--text-muted)" />
                          {new Date(d.last_donation_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-light)' }}>First Time</span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: 'var(--success)' }}>{d.total_donations} Unit(s)</strong>
                    </td>
                    <td>
                      <StatusBadge status={d.availability} type="availability" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDonors;
