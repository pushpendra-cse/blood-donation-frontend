import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { FileText, MapPin, Phone, Hospital, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AvailableRequests = () => {
  const [requests, setRequests] = useState([]);
  const [donorBloodGroup, setDonorBloodGroup] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('All');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Confirmation Modal state
  const [selectedReq, setSelectedReq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/donors/requests');
      if (res.data.success) {
        setRequests(res.data.requests || []);
        setDonorBloodGroup(res.data.donor_blood_group || '');
      }
    } catch (err) {
      console.error('Error loading requests:', err);
      setAlert({ type: 'danger', message: 'Failed to load blood requests.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirmAccept = async () => {
    if (!selectedReq) return;
    setIsSubmitting(true);
    try {
      const res = await api.post('/donors/accept-request', { requestId: selectedReq.id });
      if (res.data.success) {
        setAlert({ type: 'success', message: res.data.message });
        setSelectedReq(null);
        fetchRequests();
      }
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to accept request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = requests.filter(r => {
    if (filterUrgency === 'All') return true;
    return r.urgency === filterUrgency;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText color="var(--primary)" size={28} />
            Available Blood Donation Requests
          </h1>
          <p className="page-subtitle">
            Your Blood Group: <strong>{donorBloodGroup || 'Configured in Profile'}</strong>. Review requests and pledge a donation.
          </p>
        </div>

        {/* Urgency Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Emergency', 'Urgent', 'Normal'].map(u => (
            <button
              key={u}
              onClick={() => setFilterUrgency(u)}
              className={`btn btn-sm ${filterUrgency === u ? 'btn-primary' : 'btn-outline'}`}
            >
              {u === 'Emergency' ? '🚨 Emergency' : u}
            </button>
          ))}
        </div>
      </div>

      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '2rem', animation: 'pulse-slow 1s infinite' }}>🩸</div>
          <p style={{ marginTop: '12px' }}>Loading blood requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--secondary)', marginBottom: '8px' }}>No Pending Requests Found</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            There are currently no active blood requests matching the selected urgency filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map((req) => {
            const isMatch = req.blood_group === donorBloodGroup;
            return (
              <div
                key={req.id}
                className="card"
                style={{
                  borderLeft: req.urgency === 'Emergency' ? '5px solid var(--danger)' : req.urgency === 'Urgent' ? '5px solid var(--warning)' : '5px solid var(--info)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        fontFamily: 'Outfit, sans-serif',
                        padding: '4px 10px',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {req.blood_group}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          Required Units: <strong>{req.units_required}</strong>
                        </div>
                        {isMatch && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>
                            ✓ Exact Blood Match
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={req.urgency} type="urgency" />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary)', marginBottom: '10px' }}>
                    {req.hospital_name}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '6px', color: 'var(--text-muted)' }}>
                      <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span>{req.hospital_address}, {req.city}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', color: 'var(--text-muted)' }}>
                      <Phone size={16} color="var(--info)" style={{ flexShrink: 0 }} />
                      <span>Receiver: <strong>{req.receiver_name}</strong> ({req.receiver_phone})</span>
                    </div>
                    {req.reason && (
                      <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', fontStyle: 'italic' }}>
                        "{req.reason}"
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                    Posted {new Date(req.created_at).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => setSelectedReq(req)}
                    className="btn btn-primary btn-sm"
                  >
                    Accept Request
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title="Confirm Blood Donation Commitment"
        footer={
          <>
            <button onClick={() => setSelectedReq(null)} className="btn btn-outline" disabled={isSubmitting}>
              Cancel
            </button>
            <button onClick={handleConfirmAccept} className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Yes, I Will Donate'}
            </button>
          </>
        }
      >
        {selectedReq && (
          <div>
            <p style={{ marginBottom: '16px', lineHeight: 1.5 }}>
              Are you sure you want to accept this request for <strong>{selectedReq.blood_group}</strong> blood at <strong>{selectedReq.hospital_name}</strong> in <strong>{selectedReq.city}</strong>?
            </p>
            <div style={{ background: 'var(--primary-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
              <div><strong>Hospital:</strong> {selectedReq.hospital_name}</div>
              <div><strong>Address:</strong> {selectedReq.hospital_address}</div>
              <div><strong>Contact:</strong> {selectedReq.receiver_name} ({selectedReq.receiver_phone})</div>
            </div>
            <p style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              A donation appointment record will be created in your history. Please coordinate with the receiver/hospital for donation timing.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AvailableRequests;
