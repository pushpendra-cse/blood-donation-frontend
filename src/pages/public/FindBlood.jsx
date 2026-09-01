import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import { Search, MapPin, Phone, Droplet, User, Filter, AlertCircle, PlusCircle } from 'lucide-react';

const FindBlood = () => {
  const [bloodGroup, setBloodGroup] = useState('All');
  const [city, setCity] = useState('');
  const [donors, setDonors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const fetchDonors = async (bg = bloodGroup, searchCity = city) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (bg && bg !== 'All') params.blood_group = bg;
      if (searchCity && searchCity.trim() !== '') params.city = searchCity.trim();

      const [donorsRes, invRes] = await Promise.all([
        api.get('/donors/search', { params }),
        api.get('/inventory')
      ]);

      if (donorsRes.data.success) {
        setDonors(donorsRes.data.donors || []);
      }
      if (invRes.data.success) {
        setInventory(invRes.data.inventory || []);
      }
      setSearched(true);
    } catch (err) {
      console.error('Error fetching donors:', err);
      setError('Failed to search blood donors. Please check connection.');
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

  // Find inventory stock for selected blood group
  const currentStock = inventory.find(i => i.blood_group === bloodGroup);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Search color="var(--primary)" size={28} />
            Find Blood & Donors
          </h1>
          <p className="page-subtitle">
            Search active volunteer blood donors and real-time blood bank inventory by blood group and city.
          </p>
        </div>
        <Link to="/receiver/create-request" className="btn btn-primary">
          <PlusCircle size={18} /> Create Blood Request
        </Link>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Search Filter Card */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <form onSubmit={handleSearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) 140px',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Blood Group</label>
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
              <label className="form-label">City / Location</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mumbai, Delhi, Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '45px' }} disabled={loading}>
              <Search size={18} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Inventory Stock Indicator if specific group selected */}
      {bloodGroup !== 'All' && currentStock && (
        <div style={{
          background: 'var(--primary-subtle)',
          border: '1px solid var(--primary-light)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Droplet color="var(--primary)" fill="var(--primary)" size={24} />
            <div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
                {bloodGroup} Central Blood Bank Inventory
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Verified in-stock units at authorized blood banks
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--primary-dark)',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {currentStock.available_units} Units Available
          </div>
        </div>
      )}

      {/* Donors Results Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Matching Available Donors ({donors.length})
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing verified volunteer donors
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '1.8rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
            <p style={{ marginTop: '8px' }}>Searching registered donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <AlertCircle size={40} color="var(--text-light)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--secondary)', marginBottom: '6px' }}>No Donors Found</h3>
            <p style={{ maxWidth: '440px', margin: '0 auto 20px' }}>
              No available donors currently match blood group <strong>{bloodGroup}</strong> in <strong>{city || 'all cities'}</strong>.
            </p>
            <Link to="/receiver/create-request" className="btn btn-primary">
              <PlusCircle size={18} /> Submit an Emergency Blood Request
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--secondary-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: 'var(--secondary)'
                        }}>
                          {donor.donor_name ? donor.donor_name[0].toUpperCase() : 'D'}
                        </div>
                        <strong>{donor.donor_name}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        {donor.blood_group}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={15} color="var(--text-muted)" />
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
                        title="Call Donor"
                      >
                        <Phone size={14} /> Call
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

export default FindBlood;
