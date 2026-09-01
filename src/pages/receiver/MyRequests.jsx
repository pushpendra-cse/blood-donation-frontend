import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { FileText, PlusCircle, Calendar, Hospital, MapPin, XCircle, Eye, AlertCircle } from 'lucide-react';

const MyRequests = () => {
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Cancel Request Modal
  const [cancellingId, setCancellingId] = useState(null);
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/my-requests');
      if (res.data.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('Error loading requests:', err);
      setAlert({ type: 'danger', message: 'Failed to load your blood requests.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    if (location.search.includes('created=true')) {
      setAlert({ type: 'success', message: 'Blood request submitted successfully! Donors and admin are notified.' });
    }
  }, [location]);

  const handleCancelRequest = async () => {
    if (!cancellingId) return;
    setSubmittingCancel(true);
    try {
      const res = await api.put(`/requests/${cancellingId}/cancel`);
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Blood request has been cancelled.' });
        setCancellingId(null);
        fetchRequests();
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to cancel request.' });
    } finally {
      setSubmittingCancel(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText color="var(--primary)" size={28} />
            My Blood Requests
          </h1>
          <p className="page-subtitle">
            Track real-time status and donor pledges for all your submitted blood requests.
          </p>
        </div>
        <Link to="/receiver/create-request" className="btn btn-primary">
          <PlusCircle size={18} /> New Blood Request
        </Link>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '2rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
          <p style={{ marginTop: '12px' }}>Loading your requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <FileText size={48} color="var(--text-light)" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '8px' }}>No Blood Requests Found</h2>
          <p style={{ maxWidth: '440px', margin: '0 auto 20px', color: 'var(--text-muted)' }}>
            You haven't submitted any blood requests yet.
          </p>
          <Link to="/receiver/create-request" className="btn btn-primary">
            <PlusCircle size={18} /> Create Blood Request
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Hospital Name</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Donors Pledged</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td><strong>#{req.id}</strong></td>
                    <td>
                      <strong>{req.hospital_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {req.city}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {req.blood_group}
                      </span>
                    </td>
                    <td><strong>{req.units_required}</strong> Unit(s)</td>
                    <td><StatusBadge status={req.urgency} type="urgency" /></td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>
                      {req.committed_donors_count > 0 ? (
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                          ✓ {req.committed_donors_count} Donor(s)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>None yet</span>
                      )}
                    </td>
                    <td>
                      <small style={{ color: 'var(--text-muted)' }}>
                        {new Date(req.created_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/receiver/requests/${req.id}`} className="btn btn-outline-primary btn-sm" title="View Details">
                          <Eye size={14} /> View
                        </Link>
                        {req.status === 'Pending' && (
                          <button
                            onClick={() => setCancellingId(req.id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                            title="Cancel Request"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancellingId}
        onClose={() => setCancellingId(null)}
        title="Cancel Blood Request"
        footer={
          <>
            <button onClick={() => setCancellingId(null)} className="btn btn-outline" disabled={submittingCancel}>
              No, Keep Active
            </button>
            <button onClick={handleCancelRequest} className="btn btn-danger" disabled={submittingCancel}>
              {submittingCancel ? 'Cancelling...' : 'Yes, Cancel Request'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to cancel this blood request? This will mark the status as Cancelled and remove it from active donor searches.</p>
      </Modal>
    </div>
  );
};

export default MyRequests;
