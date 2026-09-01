import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import { Search, MapPin, Phone, User, PlusCircle, AlertCircle } from 'lucide-react';

const SearchBlood = () => {
  const [bloodGroup, setBloodGroup] = useState('All');
  const [city, setCity] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDonors = async (bg = bloodGroup, searchCity = city) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (bg && bg !== 'All') params.blood_group = bg;
      if (searchCity && searchCity.trim() !== '') params.city = searchCity.trim();

      const res = await api.get('/donors/search', { params });
      if (res.data.success) {
        setDonors(res.data.donors || []);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search blood donors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors('All', '');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors(bloodGroup, city);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Search color="var(--primary)" size={28} />
            Search Blood Donors Directory
          </h1>
          <p className="page-subtitle">
            Find and directly contact available blood donors across cities.
          </p>
        </div>
        <Link to="/receiver/create-request" className="btn btn-primary">
          <PlusCircle size={18} /> Request Blood from Bank
        </Link>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Filter Card */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) 140px',
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
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai, Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '45px' }} disabled={loading}>
              <Search size={18} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Available Donors ({donors.length})</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '1.8rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
            <p style={{ marginTop: '8px' }}>Searching registered donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <AlertCircle size={40} color="var(--text-light)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--secondary)', marginBottom: '6px' }}>No Donors Found</h3>
            <p style={{ maxWidth: '440px', margin: '0 auto 20px' }}>
              No registered donors matched your search criteria. Try a different city or create a blood request.
            </p>
            <Link to="/receiver/create-request" className="btn btn-primary">
              <PlusCircle size={18} /> Create Blood Request
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Donor Name</th>
                  <th>Blood Group</th>
                  <th>City</th>
                  <th>Phone Number</th>
                  <th>Gender</th>
                  <th>Availability</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{donor.donor_name}</strong>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {donor.blood_group}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} color="var(--text-muted)" />
                        <span>{donor.city}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`tel:${donor.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Phone size={14} />
                        {donor.phone}
                      </a>
                    </td>
                    <td>{donor.gender || 'N/A'}</td>
                    <td>
                      <StatusBadge status={donor.availability} type="availability" />
                    </td>
                    <td>
                      <a
                        href={`tel:${donor.phone}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <Phone size={14} /> Call Donor
                      </a>
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

export default SearchBlood;
