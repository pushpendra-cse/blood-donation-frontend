import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import { 
  Droplet, 
  HeartHandshake, 
  Clock, 
  Calendar, 
  FileText, 
  User, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Phone
} from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState({ type: '', message: '' });

  const loadDonorData = async () => {
    try {
      const [profRes, reqRes, histRes] = await Promise.all([
        api.get('/donors/profile'),
        api.get('/donors/requests'),
        api.get('/donors/history')
      ]);

      if (profRes.data.success) setProfile(profRes.data.donor);
      if (reqRes.data.success) setRequests(reqRes.data.requests || []);
      if (histRes.data.success) setHistory(histRes.data.donations || []);
    } catch (err) {
      console.error('Error loading donor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonorData();
  }, []);

  const handleToggleAvailability = async () => {
    try {
      const newStatus = profile?.availability === 'Available' ? 'Not Available' : 'Available';
      const res = await api.put('/donors/availability', { availability: newStatus });
      if (res.data.success) {
        setProfile(prev => ({ ...prev, availability: newStatus }));
        setAlertMsg({ type: 'success', message: `Your status is now set to ${newStatus}` });
      }
    } catch (err) {
      setAlertMsg({ type: 'danger', message: 'Failed to update availability.' });
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const res = await api.post('/donors/accept-request', { requestId });
      if (res.data.success) {
        setAlertMsg({ type: 'success', message: res.data.message });
        loadDonorData();
      }
    } catch (err) {
      setAlertMsg({ type: 'danger', message: err.response?.data?.message || 'Failed to accept request.' });
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '2rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
        <p style={{ marginTop: '12px' }}>Loading Donor Dashboard...</p>
      </div>
    );
  }

  const completedCount = profile?.completed_donations_count || 0;
  const pendingCount = profile?.pending_donations_count || 0;

  return (
    <div className="page-container">
      {/* Donor Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-subtle) 100%)',
        borderColor: 'var(--primary-light)',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif'
          }}>
            {profile?.blood_group || 'O+'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '4px' }}>
              Welcome, {user?.name}!
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Blood Group: <strong>{profile?.blood_group}</strong> • Location: <strong>{profile?.city}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Donation Availability</div>
            <StatusBadge status={profile?.availability || 'Available'} type="availability" />
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`btn ${profile?.availability === 'Available' ? 'btn-outline-primary' : 'btn-success'} btn-sm`}
          >
            Switch to {profile?.availability === 'Available' ? 'Not Available' : 'Available'}
          </button>
        </div>
      </div>

      {alertMsg.message && (
        <Alert
          type={alertMsg.type}
          message={alertMsg.message}
          onClose={() => setAlertMsg({ type: '', message: '' })}
        />
      )}

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard
          label="Completed Donations"
          value={completedCount}
          icon={<HeartHandshake size={24} />}
          color="green"
          subtitle="Total successful units given"
        />
        <StatCard
          label="Scheduled Donations"
          value={pendingCount}
          icon={<Clock size={24} />}
          color="blue"
          subtitle="Upcoming commitments"
        />
        <StatCard
          label="Urgent Blood Requests"
          value={requests.length}
          icon={<Droplet size={24} />}
          color="red"
          subtitle="Patients awaiting matching blood"
        />
        <StatCard
          label="Last Donated"
          value={profile?.last_donation_date ? new Date(profile.last_donation_date).toLocaleDateString() : 'None Yet'}
          icon={<Calendar size={24} />}
          color="purple"
          subtitle="Eligible to donate again"
        />
      </div>

      {/* Requests Preview & History Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Urgent Requests Panel */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Available Blood Requests</h2>
            <Link to="/donor/requests" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              View All ({requests.length}) <ArrowRight size={14} style={{ display: 'inline' }} />
            </Link>
          </div>

          {requests.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
              🎉 No pending blood requests at this moment. Thank you!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {requests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    background: req.urgency === 'Emergency' ? 'var(--primary-subtle)' : '#ffffff'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        padding: '2px 8px',
                        background: 'var(--primary)',
                        color: '#ffffff',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}>
                        {req.blood_group}
                      </span>
                      <strong style={{ fontSize: '0.95rem' }}>{req.hospital_name}</strong>
                      <StatusBadge status={req.urgency} type="urgency" />
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      📍 {req.city} • Units Needed: <strong>{req.units_required}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAcceptRequest(req.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Donation History */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Donations</h2>
            <Link to="/donor/history" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Full History <ArrowRight size={14} style={{ display: 'inline' }} />
            </Link>
          </div>

          {history.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
              You have not made any donations yet. Click "Blood Requests" to pledge blood!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.slice(0, 4).map((hist) => (
                <div
                  key={hist.id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                      {hist.hospital_name || 'Direct Blood Bank Donation'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      📅 {new Date(hist.donation_date).toLocaleDateString()} • {hist.units} Unit(s)
                    </div>
                  </div>
                  <StatusBadge status={hist.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
