import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import { History, Calendar, CheckCircle, Hospital, MapPin, Droplet, Phone } from 'lucide-react';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchHistory = async () => {
    try {
      const res = await api.get('/donors/history');
      if (res.data.success) {
        setDonations(res.data.donations || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setAlert({ type: 'danger', message: 'Failed to load donation history.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleMarkCompleted = async (donationId) => {
    try {
      const res = await api.put(`/donations/${donationId}/status`, { status: 'Completed' });
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Donation marked as Completed! Thank you for saving a life.' });
        fetchHistory();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setAlert({ type: 'danger', message: 'Failed to update donation status.' });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <History color="var(--primary)" size={28} />
            My Blood Donation History
          </h1>
          <p className="page-subtitle">
            A comprehensive record of your past blood donations and scheduled appointments.
          </p>
        </div>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '2rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
          <p style={{ marginTop: '12px' }}>Loading donation history...</p>
        </div>
      ) : donations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <Droplet size={48} color="var(--text-light)" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '8px' }}>No Donations Recorded Yet</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            When you accept a blood request or complete a donation, the details will appear here.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Hospital / Camp</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Scheduled Date</th>
                  <th>Receiver Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong>{d.hospital_name || 'Central Blood Transfusion Center'}</strong>
                      {d.hospital_city && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          📍 {d.hospital_city}
                        </div>
                      )}
                    </td>
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
                    <td><strong>{d.units}</strong> Unit(s)</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        <span>{new Date(d.donation_date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      {d.receiver_name ? (
                        <div>
                          <div>{d.receiver_name}</div>
                          <small style={{ color: 'var(--text-muted)' }}>{d.receiver_phone}</small>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-light)' }}>Direct Bank</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={d.status} />
                    </td>
                    <td>
                      {d.status === 'Scheduled' && (
                        <button
                          onClick={() => handleMarkCompleted(d.id)}
                          className="btn btn-success btn-sm"
                          title="Mark this donation as completed"
                        >
                          <CheckCircle size={14} /> Mark Completed
                        </button>
                      )}
                      {d.status === 'Completed' && (
                        <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>
                          ✓ Fulfilled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationHistory;
